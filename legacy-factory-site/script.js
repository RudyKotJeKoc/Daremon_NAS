// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document ready!');

    const countdownDisplay = document.getElementById('countdown-display');
    if (!countdownDisplay) {
        return;
    }

    const countdownElements = {
        days: document.getElementById('countdown-days'),
        hours: document.getElementById('countdown-hours'),
        minutes: document.getElementById('countdown-minutes'),
        seconds: document.getElementById('countdown-seconds')
    };
    const unitLabels = {
        days: countdownDisplay.querySelector('[data-i18n-key="countdownDays"]'),
        hours: countdownDisplay.querySelector('[data-i18n-key="countdownHours"]'),
        minutes: countdownDisplay.querySelector('[data-i18n-key="countdownMinutes"]'),
        seconds: countdownDisplay.querySelector('[data-i18n-key="countdownSeconds"]')
    };
    const countdownStatus = document.getElementById('countdown-status');
    const countdownHeading = document.getElementById('countdown-heading');

    const fallbackTranslations = {
        countdownHeading: 'Odliczamy do 01.04.2026',
        countdownIntro: 'Trzymamy rękę na pulsie – zobacz, ile zostało.',
        countdownDays: 'dni',
        countdownHours: 'godziny',
        countdownMinutes: 'minuty',
        countdownSeconds: 'sekundy',
        countdownStatusTemplate: 'Do 01.04.2026 pozostało {{days}} dni, {{hours}} godzin, {{minutes}} minut i {{seconds}} sekund.',
        countdownStatusComplete: '01.04.2026 — osiągnięto termin.',
        countdownAriaLive: 'Pozostało {{days}} dni, {{hours}} godzin, {{minutes}} minut i {{seconds}} sekund do 01.04.2026.'
    };

    const translate = (key, replacements = {}) => {
        let text = '';
        if (typeof window.daremonTranslate === 'function') {
            text = window.daremonTranslate(key, replacements);
        }
        if (!text || text.startsWith('[')) {
            text = fallbackTranslations[key] || '';
            Object.entries(replacements).forEach(([placeholder, value]) => {
                text = text.replace(`{{${placeholder}}}`, value);
            });
        }
        return text;
    };

    const rompaDeadline = new Date(2026, 3, 1, 0, 0, 0);

    const updateElementText = (element, value) => {
        if (element) {
            element.textContent = value;
        }
    };

    const applyStaticLabels = () => {
        if (countdownHeading && !countdownHeading.textContent.trim()) {
            countdownHeading.textContent = translate('countdownHeading');
        }
        if (countdownStatus && !countdownStatus.textContent.trim()) {
            countdownStatus.textContent = translate('countdownIntro');
        }
        Object.entries(unitLabels).forEach(([key, element]) => {
            if (element) {
                element.textContent = translate(`countdown${key.charAt(0).toUpperCase()}${key.slice(1)}`);
            }
        });
    };

    const formatDoubleDigit = (value) => value.toString().padStart(2, '0');

    let intervalId = null;
    let animationId = null;
    let lastUpdateTime = 0;

    const updateCountdown = () => {
        const now = new Date();
        const diff = rompaDeadline.getTime() - now.getTime();
        const safeDiff = Math.max(diff, 0);

        const totalSeconds = Math.floor(safeDiff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        updateElementText(countdownElements.days, days.toString());
        updateElementText(countdownElements.hours, formatDoubleDigit(hours));
        updateElementText(countdownElements.minutes, formatDoubleDigit(minutes));
        updateElementText(countdownElements.seconds, formatDoubleDigit(seconds));

        const replacements = {
            days: days.toString(),
            hours: formatDoubleDigit(hours),
            minutes: formatDoubleDigit(minutes),
            seconds: formatDoubleDigit(seconds)
        };

        const ariaLabel = translate('countdownAriaLive', replacements);
        if (ariaLabel) {
            countdownDisplay.setAttribute('aria-label', ariaLabel);
        }

        if (countdownStatus) {
            if (diff <= 0) {
                countdownStatus.textContent = translate('countdownStatusComplete');
            } else {
                countdownStatus.textContent = translate('countdownStatusTemplate', replacements);
            }
        }

        if (diff <= 0) {
            stopCountdown();
        }
    };

    // Użyj requestAnimationFrame zamiast setInterval dla lepszej wydajności
    const animateCountdown = (timestamp) => {
        if (timestamp - lastUpdateTime >= 1000) {
            updateCountdown();
            lastUpdateTime = timestamp;
        }

        if (!document.hidden && intervalId) {
            animationId = requestAnimationFrame(animateCountdown);
        }
    };

    const startCountdown = () => {
        if (intervalId) return; // Already running

        intervalId = true; // Mark as running
        lastUpdateTime = 0;
        animationId = requestAnimationFrame(animateCountdown);
    };

    const stopCountdown = () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        intervalId = null;
    };

    applyStaticLabels();
    updateCountdown();
    startCountdown();

    // Pause/resume countdown based on page visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopCountdown();
        } else {
            startCountdown();
        }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopCountdown();
    });
});