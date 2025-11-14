/**
 * Theme Toggle - Light/Dark Mode Switcher
 */

// Initialize theme from localStorage or default to 'arburg' (dark)
const savedTheme = localStorage.getItem('theme') || 'arburg';
document.body.setAttribute('data-theme', savedTheme);

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'arburg' : 'light';

            // Update theme
            document.body.setAttribute('data-theme', newTheme);

            // Save to localStorage
            localStorage.setItem('theme', newTheme);

            // Add click animation
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 150);
        });
    }

    // Also sync hero CTA with start button if exists
    const heroCTA = document.getElementById('hero-cta');
    const startButton = document.getElementById('start-btn');
    const heroListenerCount = document.getElementById('hero-listener-count');
    const listenerCount = document.getElementById('listener-count');

    if (heroCTA && startButton) {
        heroCTA.addEventListener('click', () => {
            startButton.click();

            // Scroll to player after short delay
            setTimeout(() => {
                const playerSection = document.getElementById('now-playing-section');
                if (playerSection) {
                    playerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        });
    }

    // Sync listener counts
    if (listenerCount && heroListenerCount) {
        const observer = new MutationObserver(() => {
            heroListenerCount.textContent = listenerCount.textContent;
        });

        observer.observe(listenerCount, {
            childList: true,
            characterData: true,
            subtree: true
        });

        // Initial sync
        heroListenerCount.textContent = listenerCount.textContent;
    }
});
