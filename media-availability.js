const DEFAULT_TIMEOUT = 2000;

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

export async function filterUnavailableTracks(tracks = [], options = {}) {
    const { shouldCheck = defaultShouldCheck, logger = console, ...checkOptions } = options;

    const playableTracks = [];
    const missingTracks = [];

    for (const track of tracks) {
        if (!shouldCheck(track)) {
            playableTracks.push(track);
            continue;
        }

        const exists = await checkFileExists(track.src, { ...checkOptions, logger });
        if (exists) {
            playableTracks.push(track);
        } else {
            missingTracks.push(track);
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
