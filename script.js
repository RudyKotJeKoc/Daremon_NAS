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
    const countdownStatus = document.getElementById('countdown-status');
    const rompaDeadline = new Date(2026, 2, 31, 23, 59, 59);

    const updateElementText = (element, value) => {
        if (element) {
            element.textContent = value;
        }
    };

    const formatDoubleDigit = (value) => value.toString().padStart(2, '0');

    let intervalId;

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

        const ariaLabel = `Pozostało ${days} dni, ${hours} godzin, ${minutes} minut i ${seconds} sekund.`;
        countdownDisplay.setAttribute('aria-label', ariaLabel);

        if (countdownStatus) {
            if (diff <= 0) {
                countdownStatus.textContent = '31 marca 2026 nadszedł — czas na nowy etap Daremon!';
            } else {
                countdownStatus.textContent = `Do 31 marca 2026 pozostało ${days} dni, ${hours} godzin, ${minutes} minut i ${seconds} sekund.`;
            }
        }

        if (diff <= 0 && intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    updateCountdown();
    intervalId = window.setInterval(updateCountdown, 1000);
});