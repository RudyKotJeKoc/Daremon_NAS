import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { MusicScanner } from '../music-scanner.js';

function createFetchMock(responses) {
    return vi.fn(async (url, options = {}) => {
        const method = (options.method || 'GET').toUpperCase();
        const key = `${method} ${url}`;
        if (!responses.has(key)) {
            throw new Error(`Unexpected fetch call: ${key}`);
        }

        const { status = 200, body } = responses.get(key);
        if (body instanceof Error) {
            throw body;
        }

        return {
            ok: status >= 200 && status < 300,
            status,
            async json() {
                if (body === undefined) {
                    throw new Error('No JSON body available');
                }
                return body;
            },
        };
    });
}

describe('MusicScanner', () => {
    let originalFetch;

    beforeEach(() => {
        originalFetch = globalThis.fetch;
    });

    afterEach(() => {
        if (originalFetch) {
            globalThis.fetch = originalFetch;
        } else {
            delete globalThis.fetch;
        }
        vi.restoreAllMocks();
    });

    it('pobiera dynamiczne utwory z API i filtruje niedostępne pliki', async () => {
        const trackSource = 'https://api.example.com/tracks';
        const fetchMock = createFetchMock(new Map([
            ['GET https://api.example.com/tracks', {
                status: 200,
                body: {
                    tracks: [
                        {
                            id: 'dynamic-1',
                            title: 'Dynamiczny utwór',
                            artist: 'Zespół A',
                            src: 'https://cdn.example.com/audio-1.mp3',
                            weight: 3,
                            tags: ['featured'],
                            type: 'song',
                            golden: true,
                        },
                        {
                            id: 'dynamic-2',
                            title: 'Niedostępny utwór',
                            artist: 'Zespół B',
                            src: 'https://cdn.example.com/audio-2.mp3',
                        },
                    ],
                },
            }],
            ['HEAD https://cdn.example.com/audio-1.mp3', { status: 200 }],
            ['HEAD https://cdn.example.com/audio-2.mp3', { status: 404 }],
        ]));

        // Create scanner with sequential strategy to test filtering behavior
        const scanner = new MusicScanner({ 
            trackSource, 
            fetchImpl: fetchMock,
            logger: { ...console, info: vi.fn() },
            availabilityStrategy: 'sequential'
        });
        
        const tracks = await scanner.scanMusicFolder();

        expect(fetchMock).toHaveBeenCalledWith(trackSource, { method: 'GET' });
        expect(tracks).toHaveLength(1);
        expect(tracks[0]).toMatchObject({
            id: 'dynamic-1',
            title: 'Dynamiczny utwór',
            artist: 'Zespół A',
            src: 'https://cdn.example.com/audio-1.mp3',
            weight: 3,
            tags: ['featured'],
            type: 'song',
            golden: true,
        });
    });

    it('używa awaryjnej playlisty, gdy źródło utworów i fallback są niedostępne', async () => {
        const trackSource = 'https://api.example.com/tracks';
        const networkError = new Error('network down');
        const fetchMock = vi.fn(() => Promise.reject(networkError));

        const scanner = new MusicScanner({ trackSource, fetchImpl: fetchMock });
        vi.spyOn(scanner.logger, 'error').mockImplementation(() => {});

        const tracks = await scanner.scanMusicFolder();

        expect(tracks).toEqual(scanner.getEmergencyPlaylist());
        expect(fetchMock).toHaveBeenCalledWith('./playlist.json');
    });
});
