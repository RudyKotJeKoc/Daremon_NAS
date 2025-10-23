import { describe, expect, it, beforeEach, vi } from 'vitest';
import { encodeMediaPath, getMimeTypeFromSrc, isAudioSourceSupported, clearAudioSupportCache } from '../media-utils.js';

describe('media utils audio support', () => {
    beforeEach(() => {
        clearAudioSupportCache();
    });

    describe('encodeMediaPath', () => {
        it('encodes spaces in local file names', () => {
            expect(encodeMediaPath('./images/image (2).png')).toBe('./images/image%20(2).png');
        });

        it('keeps already encoded URLs stable', () => {
            const encoded = 'https://daremon.nl/music/Daremon%20(213).mp3';
            expect(encodeMediaPath(encoded)).toBe(encoded);
        });
    });

    describe('getMimeTypeFromSrc', () => {
        it('returns mime type for mp3 files', () => {
            expect(getMimeTypeFromSrc('./music/Daremon (1).mp3')).toBe('audio/mpeg');
        });

        it('ignores query params and uppercase extensions', () => {
            expect(getMimeTypeFromSrc('https://cdn.example.com/song.MP4?version=2')).toBe('audio/mp4');
        });

        it('returns null when extension is missing', () => {
            expect(getMimeTypeFromSrc('https://daremon.nl/audio/stream')).toBeNull();
        });
    });

    describe('isAudioSourceSupported', () => {
        it('delegates to provided audio element', () => {
            const fakeAudio = { canPlayType: vi.fn().mockReturnValue('probably') };
            expect(isAudioSourceSupported('./track.mp3', { audioElement: fakeAudio })).toBe(true);
            expect(fakeAudio.canPlayType).toHaveBeenCalledWith('audio/mpeg');
        });

        it('marks unsupported formats as false', () => {
            const fakeAudio = { canPlayType: vi.fn().mockReturnValue('') };
            expect(isAudioSourceSupported('./archive.flac', { audioElement: fakeAudio })).toBe(false);
            expect(fakeAudio.canPlayType).toHaveBeenCalledWith('audio/flac');
        });

        it('assumes support when Audio API is unavailable', () => {
            expect(isAudioSourceSupported('./music/unknown.xyz')).toBe(true);
        });
    });
});
