import { describe, it, expect } from 'vitest';
import { shouldRenameFile, getFixedFilename } from '../scripts/fix-media-filenames.js';

describe('fix-media-filenames', () => {
  describe('shouldRenameFile', () => {
    it('should detect files without space before parentheses', () => {
      expect(shouldRenameFile('image(1).jpg')).toBe(true);
      expect(shouldRenameFile('photo(27).png')).toBe(true);
      expect(shouldRenameFile('video(10).mp4')).toBe(true);
      expect(shouldRenameFile('file(999).webm')).toBe(true);
    });

    it('should not flag files with correct spacing', () => {
      expect(shouldRenameFile('image (1).jpg')).toBe(false);
      expect(shouldRenameFile('photo (27).png')).toBe(false);
      expect(shouldRenameFile('video (10).mp4')).toBe(false);
    });

    it('should not flag files without parentheses', () => {
      expect(shouldRenameFile('image.jpg')).toBe(false);
      expect(shouldRenameFile('my-photo.png')).toBe(false);
      expect(shouldRenameFile('video_clip.mp4')).toBe(false);
    });

    it('should not flag files with non-numeric parentheses content', () => {
      expect(shouldRenameFile('image(abc).jpg')).toBe(false);
      expect(shouldRenameFile('photo(test).png')).toBe(false);
    });
  });

  describe('getFixedFilename', () => {
    it('should add space before parentheses with numbers', () => {
      expect(getFixedFilename('image(1).jpg')).toBe('image (1).jpg');
      expect(getFixedFilename('photo(27).png')).toBe('photo (27).png');
      expect(getFixedFilename('video(10).mp4')).toBe('video (10).mp4');
      expect(getFixedFilename('clip(999).webm')).toBe('clip (999).webm');
    });

    it('should handle multi-digit numbers', () => {
      expect(getFixedFilename('image(123).jpg')).toBe('image (123).jpg');
      expect(getFixedFilename('photo(9999).png')).toBe('photo (9999).png');
    });

    it('should not modify already correctly named files', () => {
      expect(getFixedFilename('image (1).jpg')).toBe('image (1).jpg');
      expect(getFixedFilename('photo (27).png')).toBe('photo (27).png');
    });

    it('should not modify files without parentheses', () => {
      expect(getFixedFilename('image.jpg')).toBe('image.jpg');
      expect(getFixedFilename('my-photo.png')).toBe('my-photo.png');
    });

    it('should handle multiple occurrences in the same filename', () => {
      expect(getFixedFilename('image(1)_copy(2).jpg')).toBe('image (1)_copy (2).jpg');
    });

    it('should handle filenames with hyphens and underscores', () => {
      expect(getFixedFilename('my-image(5).jpg')).toBe('my-image (5).jpg');
      expect(getFixedFilename('my_photo(10).png')).toBe('my_photo (10).png');
    });

    it('should handle different file extensions', () => {
      expect(getFixedFilename('file(1).jpg')).toBe('file (1).jpg');
      expect(getFixedFilename('file(1).jpeg')).toBe('file (1).jpeg');
      expect(getFixedFilename('file(1).png')).toBe('file (1).png');
      expect(getFixedFilename('file(1).gif')).toBe('file (1).gif');
      expect(getFixedFilename('file(1).webp')).toBe('file (1).webp');
      expect(getFixedFilename('file(1).mp4')).toBe('file (1).mp4');
      expect(getFixedFilename('file(1).webm')).toBe('file (1).webm');
    });
  });
});
