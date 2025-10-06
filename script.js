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
    const countdownFreedomMessage = document.getElementById('countdown-freedom-message');
    const countdownPrepMessage = document.getElementById('countdown-prep-message');
    const countdownCelebrationMessage = document.getElementById('countdown-celebration-message');
    const countdownDayTargets = document.querySelectorAll('[data-countdown-days]');
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
        countdownDayTargets.forEach((element) => {
            updateElementText(element, days.toString());
        });
        updateElementText(countdownElements.hours, formatDoubleDigit(hours));
        updateElementText(countdownElements.minutes, formatDoubleDigit(minutes));
        updateElementText(countdownElements.seconds, formatDoubleDigit(seconds));

        const ariaLabel = `Pozostało ${days} dni, ${hours} godzin, ${minutes} minut i ${seconds} sekund.`;
        countdownDisplay.setAttribute('aria-label', ariaLabel);

        const celebrationMessage = '31 marca 2026 nadszedł — czas na nowy etap Daremon!';
        const preparationMessage = `Do 31 marca 2026 pozostało ${days} dni, ${hours} godzin, ${minutes} minut i ${seconds} sekund.`;

        if (countdownStatus) {
            countdownStatus.textContent = diff <= 0 ? celebrationMessage : preparationMessage;
        }

        if (countdownFreedomMessage) {
            const isCelebration = diff <= 0;

            if (countdownPrepMessage) {
                countdownPrepMessage.hidden = isCelebration;
            }

            if (countdownCelebrationMessage) {
                countdownCelebrationMessage.hidden = !isCelebration;
            }
        }

        if (diff <= 0 && intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    updateCountdown();
    intervalId = window.setInterval(updateCountdown, 1000);

    const daremonHub = document.getElementById('daremon-hub');

    if (daremonHub) {
        const tabButtons = Array.from(daremonHub.querySelectorAll('[role="tab"]'));
        const tabPanels = Array.from(daremonHub.querySelectorAll('[role="tabpanel"]'));

        const activateTab = (tab) => {
            const targetId = tab.getAttribute('aria-controls');

            tabButtons.forEach((button) => {
                const isSelected = button === tab;
                button.setAttribute('aria-selected', isSelected.toString());
                button.tabIndex = isSelected ? 0 : -1;
                button.classList.toggle('daremon-tab--active', isSelected);
            });

            tabPanels.forEach((panel) => {
                if (panel.id === targetId) {
                    panel.hidden = false;
                    panel.setAttribute('tabindex', '0');
                } else {
                    panel.hidden = true;
                    panel.setAttribute('tabindex', '-1');
                }
            });
        };

        const focusTab = (tab) => {
            tab.focus();
            activateTab(tab);
        };

        tabButtons.forEach((tab) => {
            tab.addEventListener('click', () => {
                activateTab(tab);
            });

            tab.addEventListener('keydown', (event) => {
                const currentIndex = tabButtons.indexOf(tab);

                switch (event.key) {
                    case 'ArrowRight':
                    case 'ArrowDown': {
                        event.preventDefault();
                        const nextTab = tabButtons[(currentIndex + 1) % tabButtons.length];
                        focusTab(nextTab);
                        break;
                    }
                    case 'ArrowLeft':
                    case 'ArrowUp': {
                        event.preventDefault();
                        const previousIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                        const previousTab = tabButtons[previousIndex];
                        focusTab(previousTab);
                        break;
                    }
                    case 'Home': {
                        event.preventDefault();
                        focusTab(tabButtons[0]);
                        break;
                    }
                    case 'End': {
                        event.preventDefault();
                        focusTab(tabButtons[tabButtons.length - 1]);
                        break;
                    }
                    default:
                        break;
                }
            });
        });

        const defaultTab = tabButtons.find((button) => button.getAttribute('aria-selected') === 'true') || tabButtons[0];

        if (defaultTab) {
            activateTab(defaultTab);
        }
    }
});