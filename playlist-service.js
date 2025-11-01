import { encodeMediaPath } from './media-utils.js';

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
    reviews = {},

    skipAvailabilityCheck = false
}) {
    if (!scanner || typeof scanner.scanMusicFolder !== 'function') {
        return { playlist: [], failedTrackIds: [] };
    }

    const primaryTracks = await scanner.scanMusicFolder();
    const normalizedPrimary = normalizeRealTracks(primaryTracks);
    const weightedPrimary = applyRatingWeights(scanner, normalizedPrimary, reviews);


    let playlist, failedIds;
    if (skipAvailabilityCheck || weightedPrimary.length > 100) {
        console.log(`⚡ Pominięto sprawdzanie dostępności ${weightedPrimary.length} utworów (optymalizacja wydajności)`);
        playlist = weightedPrimary;
        failedIds = new Set();
    } else {
        const primaryAvailability = await filterUnavailableTracks(weightedPrimary);
        playlist = primaryAvailability.playableTracks || [];
        failedIds = new Set(extractFailedIds(primaryAvailability.missingTracks));
    }

    if (playlist.length === 0) {
        let fallbackTracks = [];
        let isEmergencyPlaylist = false;

        if (typeof scanner.loadFallbackPlaylist === 'function') {
            try {
                fallbackTracks = await scanner.loadFallbackPlaylist();
            } catch (fallbackError) {
                // console.warn('Nie można załadować playlisty fallback:', fallbackError); // Removed: users don't need to see this
            }
        }

        if ((!Array.isArray(fallbackTracks) || fallbackTracks.length === 0) && typeof scanner.getEmergencyPlaylist === 'function') {
            fallbackTracks = scanner.getEmergencyPlaylist();
            isEmergencyPlaylist = true;
        }

        const normalizedFallback = normalizeRealTracks(fallbackTracks);
        const weightedFallback = applyRatingWeights(scanner, normalizedFallback, reviews);

        // Don't filter emergency playlist or large playlists for availability - it's a last resort
        if (isEmergencyPlaylist || weightedFallback.length > 100) {
            if (isEmergencyPlaylist) {

                console.warn('⚠️ Używam playlisty awaryjnej - pominięto sprawdzanie dostępności plików');

            } else {
                console.log(`⚡ Pominięto sprawdzanie dostępności ${weightedFallback.length} utworów fallback (optymalizacja wydajności)`);
            }
            playlist = weightedFallback;
        } else {
            const fallbackAvailability = await filterUnavailableTracks(weightedFallback);
            playlist = fallbackAvailability.playableTracks || [];
            extractFailedIds(fallbackAvailability.missingTracks).forEach(id => failedIds.add(id));
        }
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

    // URLs są już zakodowane po stronie serwera - zwracamy bez zmian
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    let normalized = trimmed.replace(/\\/g, '/');

    // Check if already encoded (contains %20 or other percent-encoded chars)
    const isAlreadyEncoded = /%[0-9A-F]{2}/i.test(normalized);

    if (normalized.startsWith('./') || normalized.startsWith('../')) {


        return encodeMediaPath(normalized);
    }

    if (normalized.startsWith('/')) {
        return encodeMediaPath(`.${normalized}`);
    }

    return encodeMediaPath(`./${normalized}`);
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
