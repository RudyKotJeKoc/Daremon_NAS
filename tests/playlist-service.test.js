import { describe, expect, it } from 'vitest';
import { normalizeRealTracks } from '../playlist-service.js';

describe('normalizeRealTracks', () => {
    it('normalizes local relative paths and encodes spaces', () => {
        const tracks = [
            { id: 't1', src: 'music/Utwor (2).mp3' }
        ];

        const result = normalizeRealTracks(tracks);

        expect(result).toHaveLength(1);
        expect(result[0].src).toBe('./music/Utwor%20(2).mp3');
    });

    it('does not double encode already encoded URLs', () => {
        const tracks = [
            { id: 't2', src: 'https://daremon.nl/music/Daremon%20(213).mp3' }
        ];

        const result = normalizeRealTracks(tracks);

        expect(result).toHaveLength(1);
        expect(result[0].src).toBe('https://daremon.nl/music/Daremon%20(213).mp3');
    });
});
