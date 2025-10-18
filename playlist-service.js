export function normalizeRealTracks(tracks) {
    if (!Array.isArray(tracks)) {
        return [];
    }

    return tracks
        .filter(track => track && typeof track === 'object')
        .map(track => {
            const normalizedSrc = normalizeTrackSrc(track.src);
            if (normalizedSrc === null) {
                return { ...track };
            }
            return {
                ...track,
                src: normalizedSrc
            };
        })
        .filter(track => typeof track.src === 'string' && track.src.length > 0);
}

export async function fetchPlaylist({
    scanner,
    filterUnavailableTracks,
    reviews = {}
}) {
    if (!scanner || typeof scanner.scanMusicFolder !== 'function') {
        return { playlist: [], failedTrackIds: [] };
    }

    const primaryTracks = await scanner.scanMusicFolder();
    const normalizedPrimary = normalizeRealTracks(primaryTracks);
    const weightedPrimary = applyRatingWeights(scanner, normalizedPrimary, reviews);

    const primaryAvailability = await filterUnavailableTracks(weightedPrimary);
    let playlist = primaryAvailability.playableTracks || [];
    const failedIds = new Set(extractFailedIds(primaryAvailability.missingTracks));

    if (playlist.length === 0) {
        let fallbackTracks = [];
        if (typeof scanner.loadFallbackPlaylist === 'function') {
            try {
                fallbackTracks = await scanner.loadFallbackPlaylist();
            } catch (fallbackError) {
                console.warn('Nie można załadować playlisty fallback:', fallbackError);
            }
        }

        if ((!Array.isArray(fallbackTracks) || fallbackTracks.length === 0) && typeof scanner.getEmergencyPlaylist === 'function') {
            fallbackTracks = scanner.getEmergencyPlaylist();
        }

        const normalizedFallback = normalizeRealTracks(fallbackTracks);
        const weightedFallback = applyRatingWeights(scanner, normalizedFallback, reviews);
        const fallbackAvailability = await filterUnavailableTracks(weightedFallback);

        playlist = fallbackAvailability.playableTracks || [];
        extractFailedIds(fallbackAvailability.missingTracks).forEach(id => failedIds.add(id));
    }

    return {
        playlist,
        failedTrackIds: Array.from(failedIds)
    };
}

function normalizeTrackSrc(src) {
    if (typeof src !== 'string') {
        return null;
    }

    const trimmed = src.trim();
    if (!trimmed) {
        return '';
    }

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    let normalized = trimmed.replace(/\\/g, '/');

    if (normalized.startsWith('./') || normalized.startsWith('../')) {
        return normalized;
    }

    if (normalized.startsWith('/')) {
        return `.${normalized}`;
    }

    return `./${normalized}`;
}

function applyRatingWeights(scanner, tracks, reviews) {
    if (!Array.isArray(tracks) || tracks.length === 0) {
        return [];
    }

    const reviewKeys = reviews ? Object.keys(reviews) : [];

    if (!reviewKeys || reviewKeys.length === 0) {
        return tracks;
    }

    if (scanner && typeof scanner.applyRatingWeights === 'function') {
        try {
            const weighted = scanner.applyRatingWeights(tracks, reviews);
            console.log(`🎵 Zastosowano wagi na podstawie ${reviewKeys.length} ocen`);
            return weighted;
        } catch (error) {
            console.warn('Nie można zastosować wag ocen:', error);
            return tracks;
        }
    }

    return tracks;
}

function extractFailedIds(missingTracks) {
    if (!Array.isArray(missingTracks)) {
        return [];
    }

    return missingTracks
        .map(track => track && track.id)
        .filter(Boolean);
}
