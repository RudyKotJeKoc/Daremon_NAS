const TRACKS_JSON_PATH = './tracks.json';

let metadataCache = null;
let metadataPromise = null;

function normalizeTrackFileKey(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const withoutParams = trimmed.split(/[?#]/)[0];
    const parts = withoutParams.split('/');
    const lastSegment = parts[parts.length - 1];
    if (!lastSegment) {
        return null;
    }

    try {
        return decodeURIComponent(lastSegment).toLowerCase();
    } catch (error) {
        // console.warn('Nie można znormalizować nazwy pliku utworu:', error); // Removed: users don't need to see this
        return lastSegment.toLowerCase();
    }
}

function buildMetadataMap(records) {
    const map = new Map();
    if (!Array.isArray(records)) {
        return map;
    }

    records.forEach(record => {
        if (!record) {
            return;
        }

        const key = normalizeTrackFileKey(record.file || record.src || record.id);
        if (!key) {
            return;
        }

        const metadata = {
            title: typeof record.title === 'string' ? record.title.trim() : '',
            artist: typeof record.artist === 'string' ? record.artist.trim() : '',
            album: typeof record.album === 'string' ? record.album.trim() : '',
            cover: typeof record.cover === 'string' ? record.cover.trim() : ''
        };

        map.set(key, metadata);
    });

    return map;
}

export async function loadTrackMetadata({ fetchImpl } = {}) {
    if (metadataCache) {
        return metadataCache;
    }

    if (metadataPromise) {
        return metadataPromise;
    }

    const fetcher = fetchImpl || (typeof fetch === 'function' ? fetch : null);
    if (!fetcher) {
        metadataCache = new Map();
        return metadataCache;
    }

    metadataPromise = (async () => {
        try {
            const response = await fetcher(TRACKS_JSON_PATH, { cache: 'no-store' });
            if (!response || !response.ok) {
                throw new Error(`HTTP ${response ? response.status : 'brak odpowiedzi'}`);
            }

            const payload = await response.json();
            metadataCache = buildMetadataMap(payload?.tracks);
        } catch (error) {
            // console.warn('Nie można załadować metadanych utworów:', error); // Removed: users don't need to see this
            metadataCache = new Map();
        } finally {
            metadataPromise = null;
        }

        return metadataCache;
    })();

    return metadataPromise;
}

export function applyMetadataToTrack(track, metadataMap) {
    if (!track) {
        return track;
    }

    const map = metadataMap instanceof Map ? metadataMap : metadataCache;
    if (!(map instanceof Map) || map.size === 0) {
        return track;
    }

    const candidates = [track.src, track.file, track.id];
    let metadata = null;
    for (const candidate of candidates) {
        const key = normalizeTrackFileKey(candidate);
        if (key && map.has(key)) {
            metadata = map.get(key);
            break;
        }
    }

    if (!metadata) {
        return track;
    }

    const merged = { ...track };
    if (metadata.title) {
        merged.title = metadata.title;
    }
    if (metadata.artist) {
        merged.artist = metadata.artist;
    }
    if (metadata.album) {
        merged.album = metadata.album;
    }
    if (metadata.cover && !merged.cover) {
        merged.cover = metadata.cover;
    }

    return merged;
}

export function applyMetadataToPlaylist(tracks, metadataMap) {
    if (!Array.isArray(tracks)) {
        return [];
    }

    const map = metadataMap instanceof Map ? metadataMap : metadataCache;
    if (!(map instanceof Map) || map.size === 0) {
        return tracks.slice();
    }

    return tracks.map(track => applyMetadataToTrack(track, map));
}

export function resetTrackMetadataCache() {
    metadataCache = null;
    metadataPromise = null;
}

export { normalizeTrackFileKey };
