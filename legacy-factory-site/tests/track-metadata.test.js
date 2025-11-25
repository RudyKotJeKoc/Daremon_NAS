import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    loadTrackMetadata,
    applyMetadataToTrack,
    applyMetadataToPlaylist,
    resetTrackMetadataCache,
} from '../track-metadata.js';

function createFetchResponse(tracks) {
    return {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ tracks })
    };
}

describe('track metadata integration', () => {
    beforeEach(() => {
        resetTrackMetadataCache();
    });

    it('loads metadata and normalizes file keys', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(createFetchResponse([
            { file: 'music/Utwor (1).mp3', title: 'Real Title', artist: 'Artist 1' }
        ]));

        const metadataMap = await loadTrackMetadata({ fetchImpl });

        expect(fetchImpl).toHaveBeenCalledWith('./tracks.json', { cache: 'no-store' });
        const entry = metadataMap.get('utwor (1).mp3');
        expect(entry).toBeDefined();
        expect(entry.title).toBe('Real Title');
        expect(entry.artist).toBe('Artist 1');
    });

    it('applies metadata to a single track without mutating the original', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(createFetchResponse([
            { file: 'Utwor (2).mp3', title: 'Updated Title', artist: 'Updated Artist' }
        ]));

        const metadataMap = await loadTrackMetadata({ fetchImpl });

        const originalTrack = {
            id: 'track-2',
            src: './music/Utwor (2).mp3',
            title: 'Old Title',
            artist: 'Unknown Artist'
        };

        const enrichedTrack = applyMetadataToTrack(originalTrack, metadataMap);

        expect(enrichedTrack).not.toBe(originalTrack);
        expect(enrichedTrack.title).toBe('Updated Title');
        expect(enrichedTrack.artist).toBe('Updated Artist');
        expect(originalTrack.title).toBe('Old Title');
        expect(originalTrack.artist).toBe('Unknown Artist');
    });

    it('applies metadata across the whole playlist and keeps unmatched tracks intact', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(createFetchResponse([
            { file: 'Utwor (3).mp3', title: 'Track Three', artist: 'Artist 3' }
        ]));

        const metadataMap = await loadTrackMetadata({ fetchImpl });

        const playlist = [
            { id: 'track-3', src: './music/Utwor (3).mp3', title: 'Placeholder', artist: 'Unknown' },
            { id: 'track-4', src: './music/Utwor (4).mp3', title: 'Another', artist: 'Someone' }
        ];

        const enrichedPlaylist = applyMetadataToPlaylist(playlist, metadataMap);

        expect(enrichedPlaylist).toHaveLength(2);
        expect(enrichedPlaylist[0].title).toBe('Track Three');
        expect(enrichedPlaylist[0].artist).toBe('Artist 3');
        expect(enrichedPlaylist[1]).toBe(playlist[1]);
    });
});
