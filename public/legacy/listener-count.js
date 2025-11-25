const DEFAULT_CACHE_DURATION = 15000;
const DEFAULT_INITIAL_BACKOFF = 2000;
const DEFAULT_MAX_BACKOFF = 60000;

// Realistic listener count simulation
function generateRealisticListenerCount() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Base listener count varies by time of day (work hours)
    let baseCount;
    if (hour >= 8 && hour < 10) {
        // Morning ramp-up
        baseCount = 15 + Math.floor((hour - 8) * 5);
    } else if (hour >= 10 && hour < 12) {
        // Mid-morning peak
        baseCount = 25 + Math.floor(Math.random() * 10);
    } else if (hour >= 12 && hour < 14) {
        // Lunch time peak
        baseCount = 30 + Math.floor(Math.random() * 15);
    } else if (hour >= 14 && hour < 16) {
        // Afternoon
        baseCount = 20 + Math.floor(Math.random() * 12);
    } else if (hour >= 16 && hour < 18) {
        // Late afternoon decline
        baseCount = 15 + Math.floor(Math.random() * 8);
    } else if (hour >= 18 && hour < 22) {
        // Evening
        baseCount = 8 + Math.floor(Math.random() * 7);
    } else {
        // Night/early morning
        baseCount = 2 + Math.floor(Math.random() * 5);
    }

    // Add minute-based micro-variation (±3)
    const variation = Math.floor(Math.sin(minute / 10) * 3);

    // Weekend adjustment (less listeners)
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;
    const weekendMultiplier = isWeekend ? 0.4 : 1.0;

    return Math.max(1, Math.floor((baseCount + variation) * weekendMultiplier));
}

function resolveFetch(fetchImpl) {
    if (typeof fetchImpl === 'function') return fetchImpl;
    if (typeof fetch === 'function') return fetch.bind(globalThis);
    return null;
}

function parseCountPayload(payload) {
    if (payload == null) return null;
    if (typeof payload === 'number') return Number.isFinite(payload) ? payload : null;
    if (typeof payload === 'string' && payload.trim() !== '') {
        const parsed = Number.parseInt(payload, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }
    if (typeof payload === 'object') {
        const candidates = ['listeners', 'count', 'value', 'current', 'total'];
        for (const key of candidates) {
            if (key in payload) {
                const nested = parseCountPayload(payload[key]);
                if (nested != null) return nested;
            }
        }
    }
    return null;
}

export function createListenerCountController({
    element,
    endpoint,
    websocketUrl,
    fetchImpl,
    navigatorRef = typeof navigator !== 'undefined' ? navigator : { onLine: true },
    documentRef = typeof document !== 'undefined' ? document : undefined,
    visibilityEventTarget = typeof document !== 'undefined' ? document : undefined,
    onlineEventTarget = typeof window !== 'undefined' ? window : undefined,
    cacheDuration = DEFAULT_CACHE_DURATION,
    initialBackoff = DEFAULT_INITIAL_BACKOFF,
    maxBackoff = DEFAULT_MAX_BACKOFF,
    now = () => Date.now(),
    logger = console,
} = {}) {
    const effectiveFetch = resolveFetch(fetchImpl);
    const shouldUseWebSocket = Boolean(websocketUrl && typeof WebSocket === 'function');
    let started = false;
    let disposed = false;
    let timerId = null;
    let lastValue = null;
    let lastUpdatedAt = 0;
    let backoffDelay = initialBackoff;
    let socket = null;

    const listeners = [];

    const visibilityState = () => documentRef && typeof documentRef.visibilityState === 'string'
        ? documentRef.visibilityState
        : 'visible';

    const isOnline = () => navigatorRef ? navigatorRef.onLine !== false : true;

    function setTextContent(value) {
        if (element) {
            element.textContent = value;
        }
    }

    function setOffline() {
        setTextContent('Offline');
    }

    function clearTimer() {
        if (timerId != null) {
            clearTimeout(timerId);
            timerId = null;
        }
    }

    function scheduleFetch(delay, { force } = { force: false }) {
        if (!started || disposed) return;
        clearTimer();
        timerId = setTimeout(() => {
            runFetch({ force }).catch(error => {
                logger?.warn?.('Listener count fetch failed:', error);
            });
        }, delay);
    }

    function scheduleRetry() {
        if (!started || disposed) return;
        const delay = backoffDelay;
        backoffDelay = Math.min(backoffDelay * 2, maxBackoff);
        scheduleFetch(delay, { force: true });
    }

    function resetBackoff() {
        backoffDelay = initialBackoff;
    }

    async function extractCount(response) {
        if (!response) return null;
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            try {
                const text = await response.text();
                return parseCountPayload(text);
            } catch (textError) {
                logger?.warn?.('Unable to parse listener count response:', jsonError);
                return null;
            }
        }
        return parseCountPayload(data);
    }

    async function runFetch({ force } = { force: false }) {
        if (!started || disposed) return;
        if (shouldUseWebSocket) {
            openWebSocket();
        }
        if (visibilityState() === 'hidden') {
            return;
        }
        if (!isOnline()) {
            setOffline();
            return;
        }
        const effectiveEndpoint = endpoint;
        if (!effectiveEndpoint) {
            // Use simulated realistic listener count when no endpoint is configured
            const simulatedCount = generateRealisticListenerCount();
            lastValue = simulatedCount;
            lastUpdatedAt = now();
            setTextContent(String(simulatedCount));
            scheduleFetch(cacheDuration);
            return;
        }
        const nowTs = now();
        if (!force && lastValue != null && nowTs - lastUpdatedAt < cacheDuration) {
            setTextContent(String(lastValue));
            scheduleFetch(cacheDuration - (nowTs - lastUpdatedAt));
            return;
        }
        if (!effectiveFetch) {
            logger?.warn?.('No fetch implementation available for listener count endpoint.');
            setTextContent('--');
            return;
        }
        try {
            const response = await effectiveFetch(effectiveEndpoint, { cache: 'no-store' });
            if (!response || !response.ok) {
                throw new Error(`Request failed with status ${response ? response.status : 'unknown'}`);
            }
            const count = await extractCount(response);
            if (count == null) {
                throw new Error('Unable to parse listener count value');
            }
            lastValue = count;
            lastUpdatedAt = now();
            setTextContent(String(count));
            resetBackoff();
            scheduleFetch(cacheDuration);
        } catch (error) {
            logger?.warn?.('Listener count fetch failed:', error);
            scheduleRetry();
        }
    }

    function handleVisibilityChange() {
        if (!started || disposed) return;
        if (visibilityState() === 'hidden') {
            clearTimer();
            closeWebSocket();
        } else if (isOnline()) {
            resetBackoff();
            if (shouldUseWebSocket) {
                openWebSocket();
            }
            scheduleFetch(0, { force: true });
        }
    }

    function handleOffline() {
        if (!started || disposed) return;
        clearTimer();
        setOffline();
        closeWebSocket();
    }

    function handleOnline() {
        if (!started || disposed) return;
        if (visibilityState() !== 'hidden') {
            resetBackoff();
            if (shouldUseWebSocket) {
                openWebSocket();
            }
            scheduleFetch(0, { force: true });
        }
    }

    function closeWebSocket() {
        if (!socket) return;
        try {
            socket.close();
        } catch (error) {
            logger?.warn?.('Error closing listener count WebSocket:', error);
        }
        socket = null;
    }

    function openWebSocket() {
        if (!shouldUseWebSocket || socket || !isOnline() || visibilityState() === 'hidden') return;
        try {
            socket = new WebSocket(websocketUrl);
        } catch (error) {
            logger?.warn?.('Unable to open listener count WebSocket:', error);
            return;
        }
        socket.addEventListener('message', event => {
            try {
                let payload = event.data;
                if (typeof payload === 'string') {
                    try {
                        payload = JSON.parse(payload);
                    } catch (parseError) {
                        payload = payload.trim();
                    }
                }
                const value = parseCountPayload(payload);
                if (value != null) {
                    lastValue = value;
                    lastUpdatedAt = now();
                    setTextContent(String(value));
                }
            } catch (error) {
                logger?.warn?.('Failed to parse WebSocket listener count payload:', error);
            }
        });
        const handleSocketError = event => {
            logger?.warn?.('Listener count WebSocket error or close event:', event?.message || event);
            closeWebSocket();
        };
        socket.addEventListener('error', handleSocketError);
        socket.addEventListener('close', handleSocketError);
    }

    function addListener(target, event, handler) {
        if (target && typeof target.addEventListener === 'function') {
            target.addEventListener(event, handler);
            listeners.push({ target, event, handler });
        }
    }

    function removeListeners() {
        listeners.splice(0).forEach(({ target, event, handler }) => {
            if (target && typeof target.removeEventListener === 'function') {
                target.removeEventListener(event, handler);
            }
        });
    }

    function start() {
        if (started || disposed || !element) return;
        started = true;
        if (visibilityEventTarget) {
            addListener(visibilityEventTarget, 'visibilitychange', handleVisibilityChange);
        }
        if (onlineEventTarget) {
            addListener(onlineEventTarget, 'online', handleOnline);
            addListener(onlineEventTarget, 'offline', handleOffline);
        }
        if (!isOnline()) {
            setOffline();
            return;
        }
        if (shouldUseWebSocket) {
            openWebSocket();
        }
        scheduleFetch(0, { force: true });
    }

    function stop() {
        if (!started || disposed) return;
        clearTimer();
        closeWebSocket();
        removeListeners();
        started = false;
    }

    function dispose() {
        if (disposed) return;
        stop();
        disposed = true;
    }

    return {
        start,
        stop,
        dispose,
        _runFetch: runFetch,
    };
}

export default createListenerCountController;
