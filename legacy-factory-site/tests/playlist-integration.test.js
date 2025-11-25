import { describe, expect, it, vi } from 'vitest';
import { fetchPlaylist } from '../playlist-service.js';

describe('playlist integration', () => {
    it('does not append Daremon placeholders when using external fallback list', async () => {
        const fallbackTracks = [
            {
                id: 'external-1',
                title: 'Real Track One',
                artist: 'API Artist',
                src: './music/Utwor (1).mp3',
                type: 'song',
                weight: 1,
                golden: false
            },
            {
                id: 'external-2',
                title: 'Second Track',
                artist: 'API Artist',
                src: 'music/custom.mp3',
                type: 'song',
                weight: 1,
                golden: false
            }
        ];

        const scanner = {
            scanMusicFolder: vi.fn().mockResolvedValue([]),
            loadFallbackPlaylist: vi.fn().mockResolvedValue(fallbackTracks),
            getEmergencyPlaylist: vi.fn(() => []),
            applyRatingWeights: vi.fn((tracks) => tracks)
        };

        const filterUnavailable = vi.fn(async (tracks) => ({
            playableTracks: tracks,
            missingTracks: []
        }));

        const { playlist } = await fetchPlaylist({
            scanner,
            filterUnavailableTracks: filterUnavailable,
            reviews: {}
        });

        expect(scanner.scanMusicFolder).toHaveBeenCalled();
        expect(scanner.loadFallbackPlaylist).toHaveBeenCalled();
        expect(filterUnavailable).toHaveBeenCalledTimes(2);
        expect(playlist).toHaveLength(2);
        expect(playlist.every(track => !/Daremon \(\d+\)\.mp3$/i.test(track.src))).toBe(true);
        expect(playlist.map(track => track.id)).toEqual(['external-1', 'external-2']);
    });
});
