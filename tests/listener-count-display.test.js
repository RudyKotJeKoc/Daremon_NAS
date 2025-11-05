import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createListenerCountController } from '../listener-count.js';

describe('Listener Count Display Feature', () => {
    let element;
    let visibilityState;
    let onlineState;
    let visibilityTarget;
    let onlineTarget;
    let navigatorRef;
    let documentRef;
    let currentTime;

    // Helper function to flush all pending promises
    const flushPromises = async () => {
        await Promise.resolve();
        await Promise.resolve();
    };

    beforeEach(() => {
        vi.useFakeTimers();
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
        currentTime = Date.now();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Simulated listener count (no endpoint)', () => {
        it('displays a realistic simulated listener count when no endpoint is configured', async () => {
            const controller = createListenerCountController({
                element,
                endpoint: null, // No endpoint configured - should use simulation
                navigatorRef,
                documentRef,
                visibilityEventTarget: visibilityTarget,
                onlineEventTarget: onlineTarget,
                now: () => currentTime,
                logger: { warn: vi.fn() },
            });

            controller.start();
            
            // Run pending timers to trigger the initial fetch/simulation
            await vi.runOnlyPendingTimersAsync();
            await flushPromises();

            // Should have a numeric value (simulated count)
            expect(element.textContent).toMatch(/^\d+$/);
            const count = parseInt(element.textContent, 10);
            expect(count).toBeGreaterThanOrEqual(1);
            expect(count).toBeLessThanOrEqual(50);
        });

        it('updates simulated listener count periodically', async () => {
            const controller = createListenerCountController({
                element,
                endpoint: null,
                navigatorRef,
                documentRef,
                visibilityEventTarget: visibilityTarget,
                onlineEventTarget: onlineTarget,
                cacheDuration: 15000,
                now: () => currentTime,
                logger: { warn: vi.fn() },
            });

            controller.start();
            
            await vi.runOnlyPendingTimersAsync();
            await flushPromises();

            const firstCount = element.textContent;
            expect(firstCount).toMatch(/^\d+$/);

            // Advance time by cache duration
            currentTime += 16000;
            await vi.advanceTimersByTimeAsync(15000);
            await flushPromises();

            const secondCount = element.textContent;
            expect(secondCount).toMatch(/^\d+$/);
            
            // Both should be valid numbers (may be same or different due to simulation)
            expect(parseInt(firstCount, 10)).toBeGreaterThanOrEqual(1);
            expect(parseInt(secondCount, 10)).toBeGreaterThanOrEqual(1);
        });

        it('generates realistic counts based on time of day', async () => {
            // Test morning hours (8-10 AM) - should have lower baseline
            const morningTime = new Date();
            morningTime.setHours(9, 0, 0, 0);
            currentTime = morningTime.getTime();

            const controller = createListenerCountController({
                element,
                endpoint: null,
                navigatorRef,
                documentRef,
                visibilityEventTarget: visibilityTarget,
                onlineEventTarget: onlineTarget,
                now: () => currentTime,
                logger: { warn: vi.fn() },
            });

            controller.start();
            await vi.runOnlyPendingTimersAsync();
            await flushPromises();

            const morningCount = parseInt(element.textContent, 10);
            expect(morningCount).toBeGreaterThanOrEqual(1);
            expect(morningCount).toBeLessThanOrEqual(50);
        });
    });

    describe('API endpoint listener count', () => {
        it('displays listener count from API endpoint when configured', async () => {
            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ listeners: 42 }),
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
            await flushPromises();

            expect(element.textContent).toBe('42');
            expect(fetchMock).toHaveBeenCalledWith('https://example.com/listeners', { cache: 'no-store' });
        });

        it('handles different API response formats', async () => {
            const testCases = [
                { response: { listeners: 25 }, expected: '25' },
                { response: { count: 30 }, expected: '30' },
                { response: { value: 35 }, expected: '35' },
                { response: { current: 40 }, expected: '40' },
                { response: { total: 45 }, expected: '45' },
                { response: 50, expected: '50' }, // Direct number
                { response: '55', expected: '55' }, // String number
            ];

            for (const { response, expected } of testCases) {
                // Reset element for each test case
                const testElement = { textContent: '' };
                
                const fetchMock = vi.fn().mockResolvedValue({
                    ok: true,
                    json: async () => response,
                });

                const controller = createListenerCountController({
                    element: testElement,
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
                await flushPromises();

                expect(testElement.textContent).toBe(expected);
                
                controller.dispose();
            }
        });
    });

    describe('UI state management', () => {
        it('shows "Offline" when network is offline', async () => {
            const controller = createListenerCountController({
                element,
                endpoint: null,
                navigatorRef,
                documentRef,
                visibilityEventTarget: visibilityTarget,
                onlineEventTarget: onlineTarget,
                now: () => currentTime,
                logger: { warn: vi.fn() },
            });

            controller.start();
            await vi.runOnlyPendingTimersAsync();
            await flushPromises();

            // Should have initial count
            const initialContent = element.textContent;
            expect(initialContent).toMatch(/^\d+$/);

            // Go offline
            onlineState = false;
            onlineTarget.dispatchEvent(new Event('offline'));

            expect(element.textContent).toBe('Offline');
        });

        it('stops updating when page is hidden', async () => {
            const fetchMock = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ listeners: 10 }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ listeners: 20 }),
                });

            const controller = createListenerCountController({
                element,
                endpoint: 'https://example.com/listeners',
                fetchImpl: fetchMock,
                navigatorRef,
                documentRef,
                visibilityEventTarget: visibilityTarget,
                onlineEventTarget: onlineTarget,
                cacheDuration: 5000,
                now: () => currentTime,
                logger: { warn: vi.fn() },
            });

            controller.start();
            await vi.runOnlyPendingTimersAsync();
            await flushPromises();

            expect(element.textContent).toBe('10');
            expect(fetchMock).toHaveBeenCalledTimes(1);

            // Hide page
            visibilityState = 'hidden';
            visibilityTarget.dispatchEvent(new Event('visibilitychange'));

            // Advance time - should not fetch when hidden
            currentTime += 6000;
            await vi.advanceTimersByTimeAsync(5000);
            await Promise.resolve();

            expect(fetchMock).toHaveBeenCalledTimes(1); // Still only 1 call
            expect(element.textContent).toBe('10'); // Still showing old value
        });

        it('resumes updating when page becomes visible again', async () => {
            const fetchMock = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ listeners: 10 }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ listeners: 20 }),
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
            await flushPromises();

            expect(fetchMock).toHaveBeenCalledTimes(1);

            // Hide then show
            visibilityState = 'hidden';
            visibilityTarget.dispatchEvent(new Event('visibilitychange'));
            
            visibilityState = 'visible';
            visibilityTarget.dispatchEvent(new Event('visibilitychange'));
            
            await vi.runOnlyPendingTimersAsync();
            await flushPromises();

            expect(element.textContent).toBe('20');
            expect(fetchMock).toHaveBeenCalledTimes(2);
        });
    });

    describe('Controller lifecycle', () => {
        it('can be started and stopped', async () => {
            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ listeners: 15 }),
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
            await flushPromises();

            expect(element.textContent).toBe('15');
            expect(fetchMock).toHaveBeenCalledTimes(1);

            controller.stop();

            // After stopping, advancing time should not trigger more fetches
            currentTime += 20000;
            await vi.advanceTimersByTimeAsync(20000);
            await Promise.resolve();

            expect(fetchMock).toHaveBeenCalledTimes(1); // Still only 1 call
        });

        it('properly disposes and cleans up', () => {
            const controller = createListenerCountController({
                element,
                endpoint: null,
                navigatorRef,
                documentRef,
                visibilityEventTarget: visibilityTarget,
                onlineEventTarget: onlineTarget,
                now: () => currentTime,
                logger: { warn: vi.fn() },
            });

            controller.start();
            controller.dispose();

            // After disposal, stop should be idempotent
            expect(() => controller.stop()).not.toThrow();
            expect(() => controller.dispose()).not.toThrow();
        });
    });
});
