import { describe, it, expect, vi } from 'vitest';
import { checkFileExists, filterUnavailableTracks } from '../media-availability.js';

describe('checkFileExists', () => {
    it('returns true when the resource responds with ok status', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
        const logger = { warn: vi.fn() };

        const result = await checkFileExists('/music/demo.mp3', { fetchImpl: fetchMock, logger });

        expect(result).toBe(true);
        expect(fetchMock).toHaveBeenCalledWith('/music/demo.mp3', expect.objectContaining({ method: 'HEAD' }));
        expect(logger.warn).not.toHaveBeenCalled();
    });

    it('returns false and logs a warning when the resource is missing', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404 });
        const logger = { warn: vi.fn() };

        const result = await checkFileExists('/music/missing.mp3', { fetchImpl: fetchMock, logger });

        expect(result).toBe(false);
        expect(logger.warn).toHaveBeenCalledWith('Plik nie znaleziony: /music/missing.mp3');
    });
});

describe('filterUnavailableTracks', () => {
    it('filters out tracks whose media files cannot be reached', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ ok: true, status: 200 })
            .mockResolvedValueOnce({ ok: false, status: 404 });
        const logger = { warn: vi.fn() };

        const tracks = [
            { id: 'good', title: 'Good Track', src: '/music/good.mp3', type: 'song' },
            { id: 'missing', title: 'Missing Track', src: '/music/missing.mp3', type: 'song' },
        ];

        const { playableTracks, missingTracks } = await filterUnavailableTracks(tracks, {
            fetchImpl: fetchMock,
            logger,
        });

        expect(playableTracks.map(track => track.id)).toEqual(['good']);
        expect(missingTracks.map(track => track.id)).toEqual(['missing']);
        expect(logger.warn).toHaveBeenCalledWith('Plik nie znaleziony: /music/missing.mp3');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Pominięto 1 utworów'));
    });
});
