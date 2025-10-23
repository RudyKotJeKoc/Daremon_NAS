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
    it('filters out tracks whose media files cannot be reached (sequential strategy)', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ ok: true, status: 200 })
            .mockResolvedValueOnce({ ok: false, status: 404 });
        const logger = { warn: vi.fn(), info: vi.fn() };

        const tracks = [
            { id: 'good', title: 'Good Track', src: '/music/good.mp3', type: 'song' },
            { id: 'missing', title: 'Missing Track', src: '/music/missing.mp3', type: 'song' },
        ];

        const { playableTracks, missingTracks } = await filterUnavailableTracks(tracks, {
            fetchImpl: fetchMock,
            logger,
            strategy: 'sequential',
        });

        expect(playableTracks.map(track => track.id)).toEqual(['good']);
        expect(missingTracks.map(track => track.id)).toEqual(['missing']);
        expect(logger.warn).toHaveBeenCalledWith('Plik nie znaleziony: /music/missing.mp3');
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Pominięto 1 utworów'));
    });

    it('lazy strategy returns all tracks without checking', async () => {
        const fetchMock = vi.fn();
        const logger = { warn: vi.fn(), info: vi.fn() };

        const tracks = [
            { id: 'track1', title: 'Track 1', src: './music/track1.mp3', type: 'song' },
            { id: 'track2', title: 'Track 2', src: './music/track2.mp3', type: 'song' },
        ];

        const { playableTracks, missingTracks } = await filterUnavailableTracks(tracks, {
            fetchImpl: fetchMock,
            logger,
            strategy: 'lazy',
        });

        expect(playableTracks.length).toBe(2);
        expect(missingTracks.length).toBe(0);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('lazy loading'));
    });

    it('skip strategy bypasses HEAD verification for local files', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValue({ ok: false, status: 404 });
        const logger = { warn: vi.fn(), info: vi.fn() };

        const tracks = [
            { id: 'local1', title: 'Local Track 1', src: './music/local1.mp3', type: 'song' },
            { id: 'local2', title: 'Local Track 2', src: '../music/local2.mp3', type: 'song' },
            { id: 'remote', title: 'Remote Track', src: 'https://example.com/remote.mp3', type: 'song' },
        ];

        const { playableTracks, missingTracks } = await filterUnavailableTracks(tracks, {
            fetchImpl: fetchMock,
            logger,
            strategy: 'skip',
        });

        // Local files should pass without checking, remote file should be checked and fail
        expect(playableTracks.map(t => t.id)).toEqual(['local1', 'local2']);
        expect(missingTracks.map(t => t.id)).toEqual(['remote']);
        expect(fetchMock).toHaveBeenCalledTimes(1); // Only remote file checked
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Pominięto weryfikację HEAD'));
    });

    it('parallel strategy checks tracks in chunks', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ ok: true, status: 200 })
            .mockResolvedValueOnce({ ok: true, status: 200 })
            .mockResolvedValueOnce({ ok: false, status: 404 });
        const logger = { warn: vi.fn(), info: vi.fn() };

        const tracks = [
            { id: 'track1', title: 'Track 1', src: '/music/track1.mp3', type: 'song' },
            { id: 'track2', title: 'Track 2', src: '/music/track2.mp3', type: 'song' },
            { id: 'track3', title: 'Track 3', src: '/music/track3.mp3', type: 'song' },
        ];

        const { playableTracks, missingTracks } = await filterUnavailableTracks(tracks, {
            fetchImpl: fetchMock,
            logger,
            strategy: 'parallel',
            chunkSize: 10,
        });

        expect(playableTracks.length).toBe(2);
        expect(missingTracks.length).toBe(1);
        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('równoległe'));
    });
});
