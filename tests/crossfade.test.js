import { describe, expect, it, vi } from 'vitest';
import { waitForMediaReady } from '../media-utils.js';

class FakeMediaElement extends EventTarget {
    constructor() {
        super();
        this.readyState = 0;
    }
}

describe('waitForMediaReady', () => {
    it('resolves immediately when media is already ready', async () => {
        const media = new FakeMediaElement();
        media.readyState = 3;

        await expect(waitForMediaReady(media)).resolves.toBeUndefined();
    });

    it('waits for canplaythrough event before resolving', async () => {
        const media = new FakeMediaElement();
        media.readyState = 0;

        const promise = waitForMediaReady(media, { timeout: 200 });

        setTimeout(() => {
            media.readyState = 3;
            media.dispatchEvent(new Event('canplaythrough'));
        }, 20);

        await expect(promise).resolves.toBeUndefined();
    });

    it('rejects when the readiness timeout is reached', async () => {
        vi.useFakeTimers();
        const media = new FakeMediaElement();
        media.readyState = 0;

        const promise = waitForMediaReady(media, { timeout: 25 });
        const captured = promise.catch(error => error);

        await vi.runAllTimersAsync();
        const error = await captured;
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Timed out waiting for media readiness');
        vi.useRealTimers();
    });
});
