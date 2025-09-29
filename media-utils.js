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
