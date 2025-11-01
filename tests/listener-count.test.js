import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createListenerCountController } from '../listener-count.js';

describe('listener count controller', () => {
    let fetchMock;
    let element;
    let visibilityState;
    let onlineState;
    let visibilityTarget;
    let onlineTarget;
    let navigatorRef;
    let documentRef;
    let currentTime;

    beforeEach(() => {
        vi.useFakeTimers();
        fetchMock = vi.fn();
        element = { textContent: '' };
        visibilityState = 'visible';
        onlineState = true;
        visibilityTarget = new EventTarget();
        onlineTarget = new EventTarget();
        navigatorRef = { get onLine() { return onlineState; } };
        documentRef = {
            get visibilityState() {
                return visibilityState;
            },
            addEventListener: (...args) => visibilityTarget.addEventListener(...args),
            removeEventListener: (...args) => visibilityTarget.removeEventListener(...args),
        };
        currentTime = 0;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('retries with backoff and pauses when the page is hidden', async () => {
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ listeners: 12 }),
            })
            .mockRejectedValueOnce(new Error('network fail'))
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ listeners: 18 }),
            });

        const controller = createListenerCountController({
            element,
            endpoint: 'https://example.com/listeners',
            fetchImpl: fetchMock,
            navigatorRef,
            documentRef,
            visibilityEventTarget: visibilityTarget,
            onlineEventTarget: onlineTarget,
            cacheDuration: 15000,
            initialBackoff: 2000,
            maxBackoff: 8000,
            now: () => currentTime,
            logger: { warn: vi.fn() },
        });

        controller.start();

        await vi.runOnlyPendingTimersAsync();
        await Promise.resolve();
        await Promise.resolve();
        expect(element.textContent).toBe('12');
        expect(fetchMock).toHaveBeenCalledTimes(1);

        currentTime = 16000;
        await vi.advanceTimersByTimeAsync(15000);
        await Promise.resolve();
        await Promise.resolve();
        expect(fetchMock).toHaveBeenCalledTimes(2);

        visibilityState = 'hidden';
        visibilityTarget.dispatchEvent(new Event('visibilitychange'));
        await vi.advanceTimersByTimeAsync(5000);
        expect(fetchMock).toHaveBeenCalledTimes(2);

        visibilityState = 'visible';
        visibilityTarget.dispatchEvent(new Event('visibilitychange'));
        await vi.runOnlyPendingTimersAsync();
        await Promise.resolve();
        await Promise.resolve();
        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(element.textContent).toBe('18');
    });

    it('shows Offline when navigator reports offline', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ listeners: 21 }),
        });

        const controller = createListenerCountController({
            element,
            endpoint: 'https://example.com/listeners',
            fetchImpl: fetchMock,
            navigatorRef,
            documentRef,
            visibilityEventTarget: visibilityTarget,
            onlineEventTarget: onlineTarget,
            now: () => currentTime,
            logger: { warn: vi.fn() },
        });

        controller.start();
        await vi.runOnlyPendingTimersAsync();
        await Promise.resolve();
        await Promise.resolve();
        expect(element.textContent).toBe('21');

        onlineState = false;
        onlineTarget.dispatchEvent(new Event('offline'));
        expect(element.textContent).toBe('Offline');
    });
});
