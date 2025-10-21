import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRandomMedia, updateSlideshow } from '../slideshow.js';

class MockElement {
    constructor(tagName) {
        this.tagName = tagName.toUpperCase();
        this.attributes = new Map();
        this.children = [];
        this._innerHTML = '';
    }

    setAttribute(name, value) {
        this.attributes.set(name, value);
    }

    getAttribute(name) {
        return this.attributes.get(name) ?? null;
    }

    appendChild(child) {
        this.children.push(child);
        return child;
    }

    querySelector(tag) {
        return this.children.find((child) => child.tagName.toLowerCase() === tag.toLowerCase()) ?? null;
    }

    set innerHTML(value) {
        this._innerHTML = value;
        this.children = [];
    }

    get innerHTML() {
        return this._innerHTML;
    }

    set src(value) {
        this.attributes.set('src', value);
    }

    get src() {
        return this.attributes.get('src');
    }

    set alt(value) {
        this.attributes.set('alt', value);
    }

    get alt() {
        return this.attributes.get('alt');
    }

    set playsInline(value) {
        this._playsInline = value;
    }

    get playsInline() {
        return this._playsInline ?? false;
    }
}

describe('getRandomMedia', () => {
    it('encodes spaces in selected media file path', () => {
        const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
        const encodedPath = getRandomMedia(['https://daremon.nl/video/video (17).mp4']);
        expect(encodedPath).toBe('https://daremon.nl/video/video%20(17).mp4');
        randomSpy.mockRestore();
    });

    it('encodes spaces for default media files', () => {
        const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
        const encodedPath = getRandomMedia();
        expect(encodedPath).toBe('https://daremon.nl/images/image%20(1).png');
        randomSpy.mockRestore();
    });
});

describe('updateSlideshow', () => {
    let container;

    beforeEach(() => {
        container = new MockElement('div');
        container.id = 'slideshow-container';

        const mockDocument = {
            createElement: (tag) => new MockElement(tag),
            getElementById: (id) => (id === 'slideshow-container' ? container : null),
            body: {
                appendChild: () => {},
            },
        };

        vi.stubGlobal('document', mockDocument);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('renders videos with encoded sources when paths contain spaces', () => {
        const files = ['https://daremon.nl/video/video (17).mp4'];
        const encodedPath = 'https://daremon.nl/video/video%20(17).mp4';
        const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

        updateSlideshow(files);

        const renderedVideo = container.querySelector('video');
        expect(renderedVideo).not.toBeNull();
        expect(renderedVideo?.getAttribute('src')).toBe(encodedPath);
        randomSpy.mockRestore();
    });

    it('renders png images with encoded sources when paths contain spaces', () => {
        const files = ['https://daremon.nl/images/image (3).png'];
        const encodedPath = 'https://daremon.nl/images/image%20(3).png';
        const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

        updateSlideshow(files);

        const renderedImage = container.querySelector('img');
        expect(renderedImage).not.toBeNull();
        expect(renderedImage?.getAttribute('src')).toBe(encodedPath);
        randomSpy.mockRestore();
    });
});
