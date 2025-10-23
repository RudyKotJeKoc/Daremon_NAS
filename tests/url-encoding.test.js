import { describe, it, expect } from 'vitest';
import { normalizeRealTracks } from '../playlist-service.js';

describe('URL encoding for music files', () => {
    it('encodes spaces in music file paths', () => {
        const tracks = [
            { id: 'track-1', src: './music/Daremon (213).mp3', title: 'Test Track' }
        ];

        const normalized = normalizeRealTracks(tracks);

        expect(normalized[0].src).toBe('./music/Daremon%20(213).mp3');
    });

    it('encodes spaces in paths starting with /', () => {
        const tracks = [
            { id: 'track-1', src: '/music/Utwor (1).mp3', title: 'Test Track' }
        ];

        const normalized = normalizeRealTracks(tracks);

        expect(normalized[0].src).toBe('./music/Utwor%20(1).mp3');
    });

    it('does NOT double-encode already encoded paths', () => {
        const tracks = [
            { id: 'track-1', src: '/music/Utwor%20(200).mp3', title: 'Test Track' }
        ];

        const normalized = normalizeRealTracks(tracks);

        // Should NOT become ./music/Utwor%2520(200).mp3
        expect(normalized[0].src).toBe('./music/Utwor%20(200).mp3');
    });

    it('handles already encoded paths with ./', () => {
        const tracks = [
            { id: 'track-1', src: './music/Utwor%20(100).mp3', title: 'Test Track' }
        ];

        const normalized = normalizeRealTracks(tracks);

        // Should stay as-is, no double encoding
        expect(normalized[0].src).toBe('./music/Utwor%20(100).mp3');
    });

    it('handles remote URLs without double-encoding', () => {
        const tracks = [
            { id: 'track-1', src: 'https://daremon.nl/music/Daremon (213).mp3', title: 'Test Track' }
        ];

        const normalized = normalizeRealTracks(tracks);

        // Should keep remote URLs as-is (they should already be encoded by the server)
        expect(normalized[0].src).toBe('https://daremon.nl/music/Daremon (213).mp3');
    });

    it('handles paths without spaces', () => {
        const tracks = [
            { id: 'track-1', src: './music/track1.mp3', title: 'Test Track' }
        ];

        const normalized = normalizeRealTracks(tracks);

        expect(normalized[0].src).toBe('./music/track1.mp3');
    });

    it('encodes special characters in file names', () => {
        const tracks = [
            { id: 'track-1', src: './music/Song & Dance (2023).mp3', title: 'Test Track' }
        ];

        const normalized = normalizeRealTracks(tracks);

        // encodeURI encodes spaces but preserves safe characters like ()
        expect(normalized[0].src).toBe('./music/Song%20&%20Dance%20(2023).mp3');
    });

    it('handles multiple tracks with spaces', () => {
        const tracks = [
            { id: 'track-1', src: './music/Daremon (1).mp3', title: 'Track 1' },
            { id: 'track-2', src: './music/Daremon (2).mp3', title: 'Track 2' },
            { id: 'track-3', src: './music/Daremon (213).mp3', title: 'Track 213' }
        ];

        const normalized = normalizeRealTracks(tracks);

        expect(normalized[0].src).toBe('./music/Daremon%20(1).mp3');
        expect(normalized[1].src).toBe('./music/Daremon%20(2).mp3');
        expect(normalized[2].src).toBe('./music/Daremon%20(213).mp3');
    });

    it('handles playlist.json format with already encoded paths', () => {
        const tracks = [
            { id: 'track-1', src: '/music/Utwor%20(1).mp3', title: 'Utwór 1' },
            { id: 'track-200', src: '/music/Utwor%20(200).mp3', title: 'Utwór 200' },
            { id: 'track-500', src: '/music/Utwor%20(500).mp3', title: 'Utwór 500' }
        ];

        const normalized = normalizeRealTracks(tracks);

        expect(normalized[0].src).toBe('./music/Utwor%20(1).mp3');
        expect(normalized[1].src).toBe('./music/Utwor%20(200).mp3');
        expect(normalized[2].src).toBe('./music/Utwor%20(500).mp3');
    });
});
