import { describe, it, expect } from 'vitest';
import { mediaFiles } from '../slideshow-media.js';
import { getRandomMedia } from '../slideshow.js';

describe('Media Files Loading', () => {
    it('loads generated media files from slideshow-media.js', () => {
        // Verify that the generated media files are available
        expect(mediaFiles).toBeDefined();
        expect(Array.isArray(mediaFiles)).toBe(true);
    });

    it('includes .png files in generated media', () => {
        const pngFiles = mediaFiles.filter(file => file.endsWith('.png'));
        expect(pngFiles.length).toBeGreaterThan(0);
    });

    it('includes .mp4 files in generated media', () => {
        const mp4Files = mediaFiles.filter(file => file.endsWith('.mp4'));
        expect(mp4Files.length).toBeGreaterThan(0);
    });

    it('all media files have correct relative paths', () => {
        mediaFiles.forEach(file => {
            expect(file).toMatch(/^\.\/(images|video)\/.+\.(png|mp4|jpg|jpeg|webp|webm|ogg|mov)$/);
        });
    });

    it('getRandomMedia returns a valid media file path', () => {
        const media = getRandomMedia();
        expect(media).toBeDefined();
        expect(typeof media).toBe('string');
    });

    it('getRandomMedia properly encodes special characters in paths', () => {
        const filesWithSpaces = ['./images/test image (1).png'];
        const media = getRandomMedia(filesWithSpaces);
        expect(media).toContain('%20'); // Space should be encoded
    });
});
