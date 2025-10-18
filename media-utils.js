export function waitForMediaReady(mediaElement, { timeout = 5000 } = {}) {
    if (!mediaElement) {
        return Promise.reject(new Error('Media element is required'));
    }

    if (typeof mediaElement.readyState === 'number' && mediaElement.readyState >= 2) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        let settled = false;
        let timerId;

        const cleanup = () => {
            mediaElement.removeEventListener('canplaythrough', onReady);
            mediaElement.removeEventListener('loadeddata', onReady);
            mediaElement.removeEventListener('error', onError);
            if (timerId) {
                clearTimeout(timerId);
            }
        };

        const finish = (cb) => {
            if (settled) return;
            settled = true;
            cleanup();
            cb();
        };

        const onReady = () => finish(resolve);
        const onError = () => finish(() => reject(new Error('Media failed to load')));
        const onTimeout = () => finish(() => reject(new Error('Timed out waiting for media readiness')));

        mediaElement.addEventListener('canplaythrough', onReady, { once: true });
        mediaElement.addEventListener('loadeddata', onReady, { once: true });
        mediaElement.addEventListener('error', onError, { once: true });

        if (timeout > 0) {
            timerId = setTimeout(onTimeout, timeout);
        }
    });
}

const INTERRUPTED_MESSAGES = [
    'The play() request was interrupted by a call to pause()',
    'The play() request was interrupted by a new load request'
];

export function shouldIgnorePlaybackError(error) {
    if (!error) {
        return false;
    }

    const name = typeof error === 'object' && error !== null && 'name' in error ? error.name : undefined;
    if (name === 'AbortError') {
        return true;
    }

    const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
    if (code === 20) { // DOMException.ABORT_ERR legacy code
        return true;
    }

    const message = typeof error === 'object' && error !== null && 'message' in error
        ? error.message
        : typeof error === 'string'
            ? error
            : undefined;

    if (typeof message === 'string') {
        return INTERRUPTED_MESSAGES.some(fragment => message.includes(fragment));
    }

    return false;
}
