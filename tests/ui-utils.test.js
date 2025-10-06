import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTrackListItem } from '../ui-utils.js';

class FakeElement extends EventTarget {
    constructor(tagName) {
        super();
        this.tagName = tagName.toUpperCase();
        this.children = [];
        this.attributes = {};
        this.className = '';
        this.style = {};
        this.dataset = {};
        this._textContent = '';
        const classSet = new Set();
        this.classList = {
            add: (...classes) => {
                classes.forEach(cls => classSet.add(cls));
                this.className = Array.from(classSet).join(' ');
            },
            contains: (cls) => classSet.has(cls)
        };
    }

    appendChild(child) {
        this.children.push(child);
        return child;
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    set textContent(value) {
        this._textContent = value;
    }

    get textContent() {
        return this._textContent;
    }
}

describe('createTrackListItem', () => {
    let originalDocument;

    beforeEach(() => {
        originalDocument = globalThis.document;
        globalThis.document = {
            createElement: (tagName) => new FakeElement(tagName)
        };
    });

    afterEach(() => {
        globalThis.document = originalDocument;
    });

    it('renders a list item with cover art and optional subtitle', () => {
        const track = { id: 'track-1', artist: 'DJ Test', title: 'Sample', cover: 'cover.png' };

        const item = createTrackListItem(track, { subtitle: '4.5 ⭐ · 3' });

        expect(item.classList.contains('track-list-item')).toBe(true);
        expect(item.dataset.trackId).toBe('track-1');

        const [cover, infoWrapper] = item.children;
        expect(cover.tagName).toBe('IMG');
        expect(cover.src).toBe('cover.png');
        expect(cover.alt).toBe('DJ Test – Sample');

        expect(infoWrapper.children).toHaveLength(2);
        expect(infoWrapper.children[0].textContent).toBe('DJ Test - Sample');
        expect(infoWrapper.children[1].textContent).toBe('4.5 ⭐ · 3');
    });

    it('creates interactive list items that respond to click and keyboard', () => {
        const track = { id: 'track-2', artist: 'DJ Test', title: 'Interactive', cover: '' };
        const onActivate = vi.fn();

        const item = createTrackListItem(track, { interactive: true, onActivate });

        expect(item.getAttribute('role')).toBe('button');
        expect(item.tabIndex).toBe(0);

        item.dispatchEvent(new Event('click'));

        const keyEvent = new Event('keydown');
        keyEvent.key = 'Enter';
        item.dispatchEvent(keyEvent);

        expect(onActivate).toHaveBeenCalledTimes(2);
    });
});
