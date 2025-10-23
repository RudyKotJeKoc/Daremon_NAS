

const DEFAULT_TIMEOUT = 2000;
const DEFAULT_CHUNK_SIZE = 50;
const LEGACY_MAX_CONCURRENT = 10;

function createAbortController(timeout) {
    if (typeof AbortController === 'undefined') {
        return { controller: null, timeoutId: null };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutId };
}

export async function checkFileExists(src, options = {}) {
    const {
        timeout = DEFAULT_TIMEOUT,
        fetchImpl = typeof fetch === 'function' ? fetch : null,
        logger = console
    } = options;

    if (!fetchImpl || typeof src !== 'string' || src.trim() === '') {
        return false;
    }

    const { controller, timeoutId } = createAbortController(timeout);

    try {
        const response = await fetchImpl(src, {
            method: 'HEAD',
            signal: controller ? controller.signal : undefined,
        });

        if (response.status === 404) {
            logger.warn(`Plik nie znaleziony: ${src}`);
            return false;
        }

        return Boolean(response.ok);
    } catch (error) {
        if (error && error.name === 'AbortError') {
            logger.warn(`Przekroczono czas sprawdzania pliku: ${src}`);
        } else {
            logger.warn(`Błąd sprawdzania pliku: ${src}`, error);
        }
        return false;
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}

function defaultShouldCheck(track) {
    if (!track || typeof track !== 'object') return false;
    const src = track.src;
    if (typeof src !== 'string') return false;
    if (src.trim() === '') return false;
    if (src.startsWith('data:')) return false;
    return true;
}


function isLocalFile(src) {
    if (typeof src !== 'string') return false;
    const trimmed = src.trim();
    // Check if it's a local file (relative path starting with ./ or ../)
    return trimmed.startsWith('./') || trimmed.startsWith('../');
}

/**
 * Check tracks in parallel chunks to improve performance
 * @param {Array} tracks - Tracks to check
 * @param {Object} options - Options including chunkSize
 * @returns {Promise<{playableTracks: Array, missingTracks: Array}>}
 */
async function checkTracksInChunks(tracks, options) {
    const { 
        shouldCheck = defaultShouldCheck, 
        logger = console, 
        chunkSize = DEFAULT_CHUNK_SIZE,
        ...checkOptions 
    } = options;


    const playableTracks = [];
    const missingTracks = [];


    // Process tracks in chunks
    for (let i = 0; i < tracks.length; i += chunkSize) {
        const chunk = tracks.slice(i, i + chunkSize);
        
        const results = await Promise.all(
            chunk.map(async (track) => {
                if (!shouldCheck(track)) {
                    return { track, exists: true };
                }

                const exists = await checkFileExists(track.src, { ...checkOptions, logger });
                return { track, exists };
            })
        );

        for (const { track, exists } of results) {
            if (exists) {
                playableTracks.push(track);
            } else {
                missingTracks.push(track);
            }
        }
    }

    if (missingTracks.length > 0) {
        const sample = missingTracks
            .map(track => track?.title || track?.id || track?.src)
            .filter(Boolean)
            .slice(0, 5)
            .join(', ');
        const suffix = missingTracks.length > 5 ? '…' : '';
        logger.warn(`Pominięto ${missingTracks.length} utworów bez dostępnych plików: ${sample}${suffix}`);
    }

    return { playableTracks, missingTracks };
}

/**
 * Filter tracks based on availability checking strategy
 * 
 * Strategies:
 * - 'skip' (Option 1): Skip HEAD verification for local files - fastest, checks only during playback
 * - 'parallel' (Option 2): Use Promise.all() with limited chunks (default 50 parallel) - safer, ~20s for 500 tracks
 * - 'lazy' (Option 3): Load playlist immediately without checking - most optimal, check on playback attempt
 * - 'sequential' (legacy): Check files one by one - slowest but most thorough
 * 
 * @param {Array} tracks - Array of track objects
 * @param {Object} options - Configuration options
 * @param {string} options.strategy - 'skip' | 'parallel' | 'lazy' | 'sequential' (default: 'lazy')
 * @param {number} options.chunkSize - Parallel chunk size (default: 50, only for 'parallel' strategy)
 * @param {Function} options.shouldCheck - Custom function to determine if track should be checked
 * @param {Object} options.logger - Logger instance
 * @returns {Promise<{playableTracks: Array, missingTracks: Array}>}
 */
export async function filterUnavailableTracks(tracks = [], options = {}) {
    const { 
        strategy = 'lazy',
        shouldCheck = defaultShouldCheck, 
        logger = console, 
        chunkSize = DEFAULT_CHUNK_SIZE,
        ...checkOptions 
    } = options;

    // Option 3: Lazy loading - skip all checks, load playlist immediately
    if (strategy === 'lazy') {
        logger.info('📋 Tryb lazy loading: sprawdzanie dostępności przy próbie odtworzenia');
        return { 
            playableTracks: tracks.filter(track => !shouldCheck(track) || track), 
            missingTracks: [] 
        };
    }

    // Option 1: Skip HEAD verification for local files
    if (strategy === 'skip') {
        logger.info('📋 Pominięto weryfikację HEAD dla plików lokalnych');
        const playableTracks = [];
        const missingTracks = [];

        for (const track of tracks) {
            if (!shouldCheck(track)) {
                playableTracks.push(track);
                continue;
            }

            // Skip checking for local files, only check remote URLs
            if (isLocalFile(track.src)) {
                playableTracks.push(track);
            } else {
                const exists = await checkFileExists(track.src, { ...checkOptions, logger });
                if (exists) {
                    playableTracks.push(track);
                } else {
                    missingTracks.push(track);
                }
            }
        }

        if (missingTracks.length > 0) {
            const sample = missingTracks
                .map(track => track?.title || track?.id || track?.src)
                .filter(Boolean)
                .slice(0, 5)
                .join(', ');
            const suffix = missingTracks.length > 5 ? '…' : '';
            logger.warn(`Pominięto ${missingTracks.length} utworów bez dostępnych plików: ${sample}${suffix}`);
        }

        return { playableTracks, missingTracks };
    }

    // Option 2: Parallel checking with chunks
    if (strategy === 'parallel') {
        logger.info(`📋 Sprawdzanie równoległe z chunkami po ${chunkSize} utworów`);
        return checkTracksInChunks(tracks, { shouldCheck, logger, chunkSize, ...checkOptions });
    }

    // Legacy sequential checking (default fallback for backwards compatibility)
    logger.info('📋 Sprawdzanie sekwencyjne (legacy)');
    const playableTracks = [];
    const missingTracks = [];

    // Split tracks into chunks for parallel processing
    const concurrency = Math.max(1, Math.min(chunkSize, LEGACY_MAX_CONCURRENT));
    const chunks = [];
    for (let i = 0; i < tracks.length; i += concurrency) {
        chunks.push(tracks.slice(i, i + concurrency));
    }


    for (const chunk of chunks) {
        const results = await Promise.all(
            chunk.map(async (track) => {
                if (!shouldCheck(track)) {
                    return { track, exists: true };
                }

                const exists = await checkFileExists(track.src, { ...checkOptions, logger });
                return { track, exists };
            })
        );

        for (const { track, exists } of results) {
            if (exists) {
                playableTracks.push(track);
            } else {
                missingTracks.push(track);
            }
        }
    }

    if (missingTracks.length > 0) {
        const sample = missingTracks
            .map(track => track?.title || track?.id || track?.src)
            .filter(Boolean)
            .slice(0, 5)
            .join(', ');
        const suffix = missingTracks.length > 5 ? '…' : '';
        logger.warn(`Pominięto ${missingTracks.length} utworów bez dostępnych plików: ${sample}${suffix}`);
    }

    return { playableTracks, missingTracks };
}

export default { checkFileExists, filterUnavailableTracks };
