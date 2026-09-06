/**
 * Language Switcher Component
 * Handles language switching with proper hreflang updates
 */

export function initializeLanguageSwitcher() {
    const toggle = document.getElementById('language-toggle');
    const menu = document.getElementById('language-menu');
    const currentLangDisplay = document.getElementById('current-language');
    const languageOptions = document.querySelectorAll('.language-option');

    if (!toggle || !menu) {
        console.warn('Language switcher elements not found');
        return;
    }

    // Update current language display
    const updateCurrentLanguage = (lang) => {
        const langMap = {
            'nl': 'NL',
            'pl': 'PL'
        };
        if (currentLangDisplay) {
            currentLangDisplay.textContent = langMap[lang] || 'NL';
        }
    };

    // Set initial language
    const savedLang = localStorage.getItem('daremon_language') || document.documentElement.lang || 'nl';
    updateCurrentLanguage(savedLang);

    // Toggle menu
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.setAttribute('aria-hidden', isExpanded);
        menu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            menu.classList.remove('active');
        }
    });

    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', async (e) => {
            e.preventDefault();
            const newLang = option.dataset.lang;

            if (!newLang) return;

            // Save to localStorage
            try {
                localStorage.setItem('daremon_language', newLang);
            } catch (error) {
                console.error('Failed to save language preference:', error);
            }

            // Update document language
            document.documentElement.lang = newLang;

            // Update current language display
            updateCurrentLanguage(newLang);

            // Close menu
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            menu.classList.remove('active');

            // Update hreflang canonical URL
            updateHreflangTags(newLang);

            // Reload translations and reapply
            await reloadTranslations(newLang);

            console.log(`✅ Language switched to: ${newLang}`);
        });
    });

    console.log('✅ Language switcher initialized');
}

/**
 * Update hreflang tags dynamically
 */
function updateHreflangTags(currentLang) {
    const baseUrl = window.location.origin + window.location.pathname;

    // Update or create hreflang tags
    const langs = ['nl', 'pl'];
    langs.forEach(lang => {
        let hreflangLink = document.querySelector(`link[hreflang="${lang}"]`);

        if (!hreflangLink) {
            hreflangLink = document.createElement('link');
            hreflangLink.rel = 'alternate';
            hreflangLink.hreflang = lang;
            document.head.appendChild(hreflangLink);
        }

        if (lang === 'nl') {
            hreflangLink.href = baseUrl;
        } else {
            hreflangLink.href = `${baseUrl}?lang=${lang}`;
        }
    });

    // Update x-default
    let defaultLink = document.querySelector('link[hreflang="x-default"]');
    if (!defaultLink) {
        defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        document.head.appendChild(defaultLink);
    }
    defaultLink.href = baseUrl;

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
    }

    if (currentLang === 'nl') {
        canonicalLink.href = baseUrl;
    } else {
        canonicalLink.href = `${baseUrl}?lang=${currentLang}`;
    }
}

/**
 * Reload translations for the new language
 */
async function reloadTranslations(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load locales/${lang}.json`);
        }

        const translations = await response.json();

        // Update global translations if available
        if (window.daremonState && window.daremonState.translations) {
            window.daremonState.translations = translations;
        }

        // Reapply translations to DOM
        applyTranslations(translations);

        return translations;
    } catch (error) {
        console.error('Error reloading translations:', error);
        return null;
    }
}

/**
 * Apply translations to DOM elements
 */
function applyTranslations(translations) {
    // Text content
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.dataset.i18nKey;
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (translations[key]) {
            el.placeholder = translations[key];
        }
    });

    // Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        if (translations[key]) {
            el.title = translations[key];
        }
    });

    // ARIA labels
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.dataset.i18nAriaLabel;
        if (translations[key]) {
            el.setAttribute('aria-label', translations[key]);
        }
    });

    // Alt attributes
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const key = el.dataset.i18nAlt;
        if (translations[key]) {
            el.setAttribute('alt', translations[key]);
        }
    });
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.initializeLanguageSwitcher = initializeLanguageSwitcher;
}

export default { initializeLanguageSwitcher };
