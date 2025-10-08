import { waitForMediaReady } from './media-utils.js';
import { createInitialState } from './state.js';
import { createTrackListItem } from './ui-utils.js';
import { PollSystem } from './poll-system.js';
// strategic/machine docs imports removed in simplified build

/**
 * DAREMON Radio ETS - Hoofdlogica van de applicatie v8
 *
 * Dit bestand bevat de volledige functionaliteit voor de webradioapplicatie.
 * Belangrijkste verbeteringen in v8:
 * - Internationalisatie (i18n): Ondersteuning voor Pools en Nederlands, met automatische detectie.
 * - Focus op de radiospeler met uitgebreide sociale functies (recensies, likes, dedykacje).
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Referenties ---
    const dom = {
        player: {
            cover: document.getElementById('track-cover'),
            title: document.getElementById('track-title'),
            artist: document.getElementById('track-artist'),
            trackInfo: document.getElementById('track-info'),
            progressContainer: document.getElementById('progress-container'),
            progressBar: document.getElementById('progress-bar'),
            stickyProgressBar: document.getElementById('sticky-progress-bar'),
            currentTime: document.getElementById('current-time'),
            timeRemaining: document.getElementById('time-remaining'),
            playPauseBtn: document.getElementById('play-pause-btn'),
            nextBtn: document.getElementById('next-btn'),
            likeBtn: document.getElementById('like-btn'),
            likeCount: document.getElementById('like-count'),
            volumeSlider: document.getElementById('volume-slider'),
            ratingSection: document.getElementById('rating-section'),
            starRatingContainer: document.querySelector('.star-rating'),
            commentForm: document.getElementById('comment-form'),
            commentInput: document.getElementById('comment-input'),
            averageRatingDisplay: document.getElementById('average-rating-display'),
        },
        stickyPlayer: {
            container: document.getElementById('sticky-player'),
            cover: document.getElementById('sticky-track-cover'),
            title: document.getElementById('sticky-track-title'),
            playPauseBtn: document.getElementById('sticky-play-pause-btn'),
            nextBtn: document.getElementById('sticky-next-btn'),
        },
        sidePanel: {
            panel: document.getElementById('side-panel'),
            menuToggle: document.getElementById('menu-toggle'),
            historyList: document.getElementById('history-list'),
            goldenRecordsList: document.getElementById('golden-records-list'),
            topRatedList: document.getElementById('top-rated-list'),
            messagesList: document.getElementById('messages-list'),
            djMessageForm: document.getElementById('dj-message-form'),
            djMessageInput: document.getElementById('dj-message-input'),
        },
        polls: {
            container: document.getElementById('polls-container'),
            section: document.getElementById('polls-section'),
        },
        // strategic polls removed in simplified build
        // machineDocumentation section removed
        header: {
            listenerCount: document.getElementById('listener-count'),
        },
        autoplayOverlay: document.getElementById('autoplay-overlay'),
        introVideo: document.getElementById('intro-video'),
        welcomeGreeting: document.getElementById('welcome-greeting'),
        visualizerCanvas: document.getElementById('visualizer-canvas'),
        offlineIndicator: document.getElementById('offline-indicator'),
        errorOverlay: document.getElementById('error-overlay'),
        errorMessage: document.getElementById('error-message'),
        errorCloseBtn: document.getElementById('error-close-btn'),
        errorRetryBtn: document.getElementById('error-retry-btn'),
        themeSwitcher: document.querySelector('.theme-switcher'),
    };

    // --- State Management ---
    let audioContext, analyser;
    const players = [new Audio(), new Audio()];
    let activePlayerIndex = 0;
    players.forEach(p => { p.crossOrigin = "anonymous"; p.preload = "auto"; });

    let visualizerAnimationId = null;

    const state = createInitialState();

    // --- INTERNATIONALISATIE (i18n) ---
    async function i18n_init() {
        const rawNavigatorLanguage = typeof navigator === 'object' && typeof navigator.language === 'string'
            ? navigator.language
            : 'nl';
        const userLang = rawNavigatorLanguage.split('-')[0];
        state.language = ['nl', 'pl'].includes(userLang) ? userLang : 'nl'; // Standaard Nederlands
        document.documentElement.lang = state.language;

        try {
            const response = await fetch(`locales/${state.language}.json`);
            if (!response.ok) throw new Error('Vertaalbestand niet gevonden');
            state.translations = await response.json();
            i18n_apply();
        } catch (error) {
            console.error("Kon vertaalbestand niet laden:", error);
            // Use fallback translations
            state.translations = {
                loading: "Laden...",
                startBtn: "Start Radio",
                errorPlaylistLoad: "Fout bij laden playlist",
                errorTimeout: "Timeout fout",
                errorFetch: "Fetch fout",
                retrying: "Opnieuw proberen...",
                retryFailed: "Opnieuw proberen mislukt",
                you: "Jij",
                aiDjName: "DJ Bot",
                aiResponses: ["Bedankt voor je bericht!", "Leuk dat je luistert!", "Geweldige muziekkeuze!"],
                trackTitleDefault: "Welkom bij Radio",
                trackArtistDefault: "Het beste van technologie en muziek",
                headerSubtitle: "Het officiële bedrijfsradiostation",
                listenersLabel: "Luisteraars:",
                goldenRecords: "Gouden Platen",
                topRated: "Best Beoordeeld",
                recentlyPlayed: "Recent Afgespeeld",
                djMessages: "DJ Berichten",
                themes: "Thema's",
                tools: "Hulpmiddelen",
                evacuationCalendar: "Evacuatiekalender",
                backToRadio: "Terug naar Radio",
                sendBtn: "Verstuur",
                submitReview: "Verstuur Recensie",
                hotkeysInfo: "Sneltoetsen: Spatie = Afspelen/Pauzeren, N = Volgende, L = Like, ↑↓ = Volume",
                
            };
            i18n_apply();
        }
    }

    function t(key, replacements = {}) {
        let text = state.translations[key] || `[${key}]`;
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(`{{${placeholder}}}`, value);
        }
        return text;
    }

    function i18n_apply() {
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            if (el && state.translations[el.dataset.i18nKey]) {
                el.textContent = t(el.dataset.i18nKey);
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            if (el && state.translations[el.dataset.i18nPlaceholder]) {
                el.placeholder = t(el.dataset.i18nPlaceholder);
            }
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            if (el && state.translations[el.dataset.i18nTitle]) {
                el.title = t(el.dataset.i18nTitle);
            }
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            if (el && state.translations[el.dataset.i18nAriaLabel]) {
                el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
            }
        });

        // song dedications removed in simplified build
    }

    // --- Recent Rotation System ---
    function prepareRecentRotation() {
        if (!state.config.recent || !state.config.recent.trackIds) return;

        state.recentRotation = [...state.config.recent.trackIds];
        state.recentTrackSet = new Set(state.recentRotation);

        console.log(`Recent rotation prepared: ${state.recentRotation.length} tracks`);
    }

    function replenishRecentRotation() {
        if (!state.config.recent || !state.config.recent.trackIds) return;

        state.recentRotation = [...state.config.recent.trackIds];
        state.recentTrackSet = new Set(state.recentRotation);

        console.log('Recent rotation replenished');
    }

    function removeFromRecentRotation(trackId) {
        const index = state.recentRotation.indexOf(trackId);
        if (index > -1) {
            state.recentRotation.splice(index, 1);
        }
        state.recentTrackSet.delete(trackId);
    }

    function drawRecentTrack(trackPool) {
        const availableRecent = state.recentRotation.filter(id =>
            trackPool.some(track => track.id === id)
        );

        if (availableRecent.length === 0) return null;

        const randomId = availableRecent[Math.floor(Math.random() * availableRecent.length)];
        return trackPool.find(t => t.id === randomId);
    }

    function buildWeightedPool(tracks) {
        const pool = [];
        tracks.forEach(track => {
            const weight = track.weight || 1;
            const boost = state.tempBoosts[track.id] || 0;
            const finalWeight = Math.max(1, weight + boost);

            for (let i = 0; i < finalWeight; i++) {
                pool.push(track);
            }
        });
        return pool;
    }

    // --- Intro Sequence ---
    function prepareIntroSequence() {
        const startBtn = document.createElement('button');
        startBtn.id = 'start-btn';
        startBtn.textContent = t('startBtn');
        startBtn.setAttribute('aria-label', t('startBtn'));

        startBtn.style.cssText = `
            padding: 1rem 3rem;
            font-size: 1.5rem;
            background: transparent;
            border: 3px solid var(--primary-accent);
            color: var(--primary-accent);
            border-radius: 50px;
            cursor: pointer;
            font-family: var(--font-family);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s ease;
            animation: neon-flicker 3s infinite;
        `;

        startBtn.addEventListener('click', startRadio);

        if (dom.autoplayOverlay) {
            dom.autoplayOverlay.appendChild(startBtn);
        }

        setTimeout(() => {
            if (!state.isInitialized && startBtn.parentElement) {
                startBtn.click();
            }
        }, 3000);
    }

    // --- Placeholder Functions (usuń jeśli nie planujesz kalendarza) ---
    function populateMachineSelect() {
        console.log('populateMachineSelect - not implemented');
    }

    function renderCalendar() {
        console.log('renderCalendar - not implemented');
    }


    function initializePolls() {
        if (!dom.polls || !dom.polls.container) {
            console.warn('Brak kontenera dla ankiet');
            return;
        }

        const translate = (key, fallback) => {
            const value = t(key);
            return typeof value === 'string' && !value.startsWith('[') ? value : fallback;
        };

        const pollSystem = new PollSystem({
            strings: {
                submit: translate('pollSubmit', 'Wyślij odpowiedź'),
                success: translate('pollSuccess', 'Dziękujemy za głos!'),
                selectOption: translate('pollSelectOption', 'Wybierz odpowiedź przed wysłaniem.'),
                selectMultiple: translate('pollSelectMultiple', 'Zaznacz przynajmniej jedną odpowiedź.'),
                textRequired: translate('pollTextRequired', 'Wpisz odpowiedź, zanim wyślesz.'),
                resultsHeading: translate('pollResultsHeading', 'Wyniki'),
                noVotes: translate('pollNoVotes', 'Brak głosów w tej ankiecie.'),
                correctAnswer: translate('pollCorrectAnswer', 'Poprawna odpowiedź!'),
                incorrectAnswer: translate('pollIncorrectAnswer', 'Dziękujemy za odpowiedź!'),
                rangeLabel: translate('pollRangeLabel', 'Wybierz ocenę na skali'),
                openTextPlaceholder: translate('pollOpenTextPlaceholder', 'Twoja odpowiedź...'),
                totalVotesLabel: translate('pollTotalVotesLabel', 'Oddane głosy:'),
            }
        });
        state.pollSystem = pollSystem;

        dom.polls.container.innerHTML = '';

        // Tylko 5 prostych ankiet związanych z radiem
        const examplePolls = [
            {
                question: 'Który utwór był HITEM tego tygodnia?',
                type: 'single-choice',
                options: [
                    'Retro (Live Edit)',
                    'City Lights (Synthwave)',
                    'Ocean Drive (Remix)',
                    'Neon Nights (Club Mix)'
                ],
                duration: '7 dni'
            },
            {
                question: 'Jaki gatunek muzyczny chcesz słyszeć częściej?',
                type: 'multiple-choice',
                options: ['Electro/Synth', 'Rock', 'Techno/House', 'Pop/Dance', 'Ambient']
            },
            {
                question: 'Jak oceniasz DAREMON Radio ogólnie?',
                type: 'rating',
                scale: 5,
                labels: ['Słabo', 'Średnio', 'Świetnie']
            },
            {
                question: 'O której godzinie najczęściej słuchasz?',
                type: 'single-choice',
                options: [
                    '6:00 - 9:00 (Rano)',
                    '9:00 - 12:00 (Praca)',
                    '12:00 - 14:00 (Lunch)',
                    '14:00 - 18:00 (Popołudnie)',
                    '18:00 - 22:00 (Wieczór)'
                ]
            },
            {
                question: 'Która funkcja najbardziej Ci się podoba?',
                type: 'multiple-choice',
                options: [
                    'System ocen utworów',
                    'Wizualizacja audio',
                    'Złote Płyty',
                    'Najwyżej ocenione',
                    'Motywy kolorystyczne'
                ]
            }
        ];

        console.log('System ankiet zainicjalizowany z', examplePolls.length, 'ankietami');

        // Renderuj ankiety w kontenerze
        examplePolls.forEach(pollDef => {
            const poll = pollSystem.addPoll(pollDef);
            const pollContainer = document.createElement('div');
            pollContainer.id = `poll-${poll.id}`;
            pollContainer.className = 'poll-container';
            dom.polls.container.appendChild(pollContainer);
            pollSystem.renderPoll(poll, pollContainer);
        });
    }

    function checkMilestoneAndAddPoll() {
        if (state.history.length === 10 && state.pollSystem && dom.polls?.container) {
            const newPoll = state.pollSystem.addPoll({
                question: 'Gratulacje! Posłuchałeś 10 utworów. Jak Ci się podoba radio?',
                type: 'emoji-rating',
                options: ['😞', '😐', '🙂', '😊', '🤩']
            });

            const pollContainer = document.createElement('div');
            pollContainer.id = `poll-${newPoll.id}`;
            pollContainer.className = 'poll-container';
            dom.polls.container.insertBefore(pollContainer, dom.polls.container.firstChild);

            state.pollSystem.renderPoll(newPoll, pollContainer);
            pollContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function createQuickPoll(question, options, type = 'single-choice') {
        if (!state.pollSystem) {
            console.error('System ankiet nie jest zainicjalizowany');
            return null;
        }

        const poll = state.pollSystem.addPoll({ question, options, type });
        if (!dom.polls?.container) {
            return poll;
        }

        const pollContainer = document.createElement('div');
        pollContainer.id = `poll-${poll.id}`;
        pollContainer.className = 'poll-container';
        dom.polls.container.insertBefore(pollContainer, dom.polls.container.firstChild);
        state.pollSystem.renderPoll(poll, pollContainer);
        return poll;
    }

    function exportPollStats() {
        if (!state.pollSystem) {
            console.warn('System ankiet nie jest dostępny');
            return null;
        }

        const stats = state.pollSystem.polls
            .map(poll => {
                const result = state.pollSystem.getResults(poll.id);
                if (!result) return null;
                return {
                    question: poll.question,
                    type: poll.type,
                    totalVotes: result.totalVotes,
                    results: result.results || result.responses,
                };
            })
            .filter(Boolean);

        console.table(stats.map(item => ({ question: item.question, totalVotes: item.totalVotes })));
        return stats;
    }


    // --- Initialisatie ---
    async function initialize() {
        await i18n_init();

        try {
            await loadPlaylist();
            loadStateFromLocalStorage();
            setupEventListeners();
            initializePolls();
            // strategic polls and machine docs removed in simplified build
            updateWelcomeGreeting();
            updateOfflineStatus();
            // messages and song dedications removed in simplified build
            renderGoldenRecords();
            renderTopRated();
            // calendar and machine select removed
            setInterval(updateListenerCount, 15000);
            updateListenerCount();
            // GO/NO-GO analysis removed

            prepareIntroSequence();
        } catch (error) {
            console.error("Initialisatie mislukt:", error);
            displayError(t('errorPlaylistLoad', { message: error.message }), true);
        }
    }

    async function loadPlaylist() {
        const TIMEOUT_MS = 15000; // Zwiększony timeout do 15s
        
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Przekroczono czas ładowania playlisty (15s)')), TIMEOUT_MS)
        );
        
        try {
            console.log('🔍 Skanowanie muzyki...');
            
            // Użyj music-scanner do automatycznego skanowania folderu music
            let scanner;
            let generatedDaremon = false;
            // Dutch-themed titles (beavers, ships, sinking)
            const makeDutchTitle = (n) => {
                const themes = [
                    'Beverdam bij de Rivier',
                    'Bevers aan Boord',
                    'Schip in de Storm',
                    'Noodsignaal op Zee',
                    'Onder de Waterlijn',
                    'Kapitein Bever',
                    'Zinkende Schemering',
                    'Scheepswrak in de Diepte',
                    'Zeegang en Houten Dam',
                    'Rivierdelta en Dammen',
                    'Schipbreuk bij de Dam',
                    'Stille Haven, Zware Golf',
                    'Bevers en de Oostzee',
                    'Romp en Ratelstaart',
                    'Kielwater van de Bever',
                    'Ondergaande Zon, Ondergaand Schip',
                    'Drijvend Hout en Burcht',
                    'Muiterij op de Beverboot',
                    'Noorderwind en Natte Vacht',
                    'Sirenes over de Zuidpier',
                    'Damwachter aan Dek',
                    'Golven tegen de Burcht',
                    'Schroef en Staart',
                    'Diepgang naar de Delta',
                    'Zeilschip en Zinklijn',
                    'Beverbrigade op Zee',
                    'Scheepsklok in de Mist',
                    'Stormvloed en Dam',
                    'Riviermonding bij Nacht',
                    'Bakboord Bever',
                    'Havenlicht op de Burcht',
                    'Kade van Kastor',
                    'Redding in het Riet',
                    'Anker bij de Beverdam',
                    'Zeebranding en Burchtmuur',
                    'Vloedlijn en Vacht',
                    'Scheepstoeter en Stuwdam',
                    'Planken, Peddels en Pels',
                    'Middengolf voor de Burcht',
                    'Zeeschuim en Zinkgat'
                ];
                const base = themes[(n - 1) % themes.length];
                return `${base}`; // no number suffix in title for a natural look
            };
            const generateDaremonTracks = (max = 231) => {
                const out = [];
                const ensureCover = (n) => `https://placehold.co/120x120/222/fff?text=${n}`;
                for (let n = 1; n <= max; n++) {
                    out.push({
                        id: `utwor-${n}`,
                        title: makeDutchTitle(n),
                        artist: 'Onbekend',
                        src: `./music/Daremon (${n}).mp3`,
                        cover: ensureCover(n),
                        tags: ['bever', 'schip', 'zinken'],
                        weight: 3,
                        type: 'song',
                        golden: false
                    });
                }
                return out;
            };
            if (window.MusicScanner) {
                scanner = new window.MusicScanner();
            } else {
                // Fallback jeśli moduł nie jest dostępny
                console.warn('⚠️ MusicScanner nie jest dostępny, używam playlist.json');
                scanner = { 
                    scanMusicFolder: async () => {
                        // Generuj listę utworów w schemacie Daremon (1..231)
                        generatedDaremon = true;
                        return generateDaremonTracks(231);
                    }
                };
            }
            
            // Skanuj muzykę z uwzględnieniem ocen
            const tracks = await scanner.scanMusicFolder();

            // Mapuj tylko gdy źródło pochodzi z playlist.json (Utwor -> Daremon)
            const mapUtworToDaremonSrc = (src) => {
                if (typeof src !== 'string') return src;
                const m = src.match(/^(?:\.\/|\/)music\/Utwor \((\d+)\)\.mp3$/i);
                if (m) {
                    const n = m[1];
                    return `./music/Daremon (${n}).mp3`;
                }
                return src;
            };

            const normalizedTracks = generatedDaremon
                ? tracks
                : tracks.map(t => ({
                    ...t,
                    src: t.type === 'song' ? mapUtworToDaremonSrc(t.src) : t.src
                }));

            // Dodaj brakujące utwory, jeśli folder zawiera pliki Daremon (1..231)
            // Zachowaj spójny schemat ID jak istniejące: utwor-N dla zwykłych piosenek
            const MAX_NUM = 231;
            const canonicalize = (s) => typeof s === 'string' ? s.replace(/^\/music\//i, './music/').toLowerCase() : '';
            const hasSrcFor = new Set(normalizedTracks.map(t => canonicalize(t.src)));
            const hasId = new Set(normalizedTracks.map(t => t.id));
            const ensureCover = (n) => `https://placehold.co/120x120/222/fff?text=${n}`;

            if (!generatedDaremon) {
                for (let n = 1; n <= MAX_NUM; n++) {
                    const daremonSrc = `./music/Daremon (${n}).mp3`;
                    if (!hasSrcFor.has(canonicalize(daremonSrc))) {
                        // Nie dubluj istniejących specjalnych ID (np. kaput/bmw-kut/jingle-*)
                        const newId = `utwor-${n}`;
                        if (hasId.has(newId)) continue;
                        normalizedTracks.push({
                            id: newId,
                            title: makeDutchTitle(n),
                            artist: 'Onbekend',
                            src: daremonSrc,
                            cover: ensureCover(n),
                            tags: ['bever', 'schip', 'zinken'],
                            weight: 3,
                            type: 'song',
                            golden: false
                        });
                        hasSrcFor.add(canonicalize(daremonSrc));
                        hasId.add(newId);
                    }
                }
            }
            
            // Zastosuj wagi na podstawie ocen użytkowników
            // Use STORAGE_PREFIX safely with fallback
            const STORAGE_PREFIX = (window.CONFIG && window.CONFIG.STORAGE_PREFIX) || 'daremon';
            const reviews = JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}_reviews`) || '{}');
            
            let processedTracks = normalizedTracks;
            if (scanner.applyRatingWeights && Object.keys(reviews).length > 0) {
                processedTracks = scanner.applyRatingWeights(normalizedTracks, reviews);
                console.log(`🎵 Zastosowano wagi na podstawie ${Object.keys(reviews).length} ocen`);
            }
            
            state.playlist = processedTracks;

            // Załaduj konfigurację z playlist.json (bez utworów)
            try {
                const configResponse = await fetch('./playlist.json');
                if (configResponse.ok) {
                    const configData = await configResponse.json();
                    state.config = configData.config || {};
                    console.log('📄 Załadowano konfigurację z playlist.json');

                    // Jeśli brak zgodnych plików jingle w folderze, wyłącz jinglowanie
                    const jingleTracks = state.playlist.filter(t => t.type === 'jingle');
                    const hasDaremonStyleJingle = jingleTracks.some(t => /Daremon\s*\(/i.test(String(t.src)));
                    if (jingleTracks.length > 0 && !hasDaremonStyleJingle) {
                        state.config.jingle = { ...(state.config.jingle || {}), enabled: false };
                        console.warn('🔇 Wyłączono jingle: brak pasujących plików w katalogu music');
                    }
                }
            } catch (error) {
                console.warn('⚠️ Nie można załadować konfiguracji, używam domyślnej');
                state.config = {};
            }

            prepareRecentRotation();

            if (state.playlist.length === 0) {
                throw new Error('Playlist is empty - no music files found');
            }

            console.log(`✅ Załadowano ${state.playlist.length} utworów z automatycznego skanowania`);
            
            // Zaktualizuj wagi na podstawie istniejących ocen
            if (state.reviews && Object.keys(state.reviews).length > 0) {
                updatePlaylistWeights();
            }
        } catch (e) {
            console.error('❌ Błąd ładowania playlisty:', e);
            
            // Próba użycia cache jako fallback
            if (e.message.includes('Przekroczono czas')) {
                console.log('🔄 Próba pobrania z cache...');
                try {
                    const cachedResponse = await caches.match('./playlist.json');
                    if (cachedResponse) {
                        const data = await cachedResponse.json();
                        // Map cached playlist to nowe ścieżki Daremon oraz uzupełnij brakujące pozycje
                        const mapUtworToDaremonSrc = (src) => {
                            if (typeof src !== 'string') return src;
                            const m = src.match(/^(?:\.\/|\/)music\/Utwor \((\d+)\)\.mp3$/i);
                            if (m) {
                                const n = m[1];
                                return `./music/Daremon (${n}).mp3`;
                            }
                            return src;
                        };
                        const canonicalize = (s) => typeof s === 'string' ? s.replace(/^\/music\//i, './music/').toLowerCase() : '';
                        const normalized = (data.tracks || []).map(t => ({ ...t, src: mapUtworToDaremonSrc(t.src) }));
                        const hasSrcFor = new Set(normalized.map(t => canonicalize(t.src)));
                        const hasId = new Set(normalized.map(t => t.id));
                        const ensureCover = (n) => `https://placehold.co/120x120/222/fff?text=${n}`;
                        for (let n = 1; n <= 231; n++) {
                            const daremonSrc = `./music/Daremon (${n}).mp3`;
                            if (!hasSrcFor.has(canonicalize(daremonSrc))) {
                                const newId = `utwor-${n}`;
                                if (!hasId.has(newId)) {
                                    normalized.push({
                                        id: newId,
                                        title: `Utwór ${n}`,
                                        artist: 'Nieznany',
                                        src: daremonSrc,
                                        cover: ensureCover(n),
                                        tags: [],
                                        weight: 3,
                                        type: 'song',
                                        golden: false
                                    });
                                    hasSrcFor.add(canonicalize(daremonSrc));
                                    hasId.add(newId);
                                }
                            }
                        }
                        state.playlist = normalized;
                        state.config = data.config || {};
                        prepareRecentRotation();
                        console.log(`✅ Załadowano z cache: ${state.playlist.length} utworów`);
                        return;
                    }
                } catch (cacheError) {
                    console.error('Cache fallback failed:', cacheError);
                }
            }
            
            throw new Error(`Failed to load playlist: ${e.message}`);
        }
    }
    
    async function retryLoad() {
        if (dom.errorRetryBtn) dom.errorRetryBtn.disabled = true;
        if (dom.errorMessage) dom.errorMessage.textContent = t('retrying');
        try {
            await loadPlaylist();
            if (dom.errorOverlay) dom.errorOverlay.classList.add('hidden');
            if (state.isInitialized) {
                playNextTrack();
            }
        } catch (err) {
            displayError(t('retryFailed', { message: err.message }), true);
        } finally {
            if (dom.errorRetryBtn) dom.errorRetryBtn.disabled = false;
        }
    }

    function startRadio() {
        if (state.isInitialized) return;
        state.isInitialized = true;

        setupAudioContext();

        if (dom.autoplayOverlay) {
            dom.autoplayOverlay.classList.add('is-hidden');
            setTimeout(() => dom.autoplayOverlay.style.display = 'none', 600);
        }

        playNextTrack();
    }
    
    function setupAudioContext() {
        if (audioContext) return;
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;

            players.forEach(player => {
                const source = audioContext.createMediaElementSource(player);
                source.connect(analyser);
            });
            analyser.connect(audioContext.destination);
            scheduleVisualizerFrame();
        } catch (e) {
            console.error("Audio context setup failed:", e);
        }
    }

    // --- Kern Speler Logica ---
    function selectNextTrack(isPreload = false) {
        if (!state.playlist || state.playlist.length === 0) {
            console.error("Playlist is empty");
            return null;
        }

        const isTrackPlayable = (track) => !state.failedTracks.includes(track.id);

        const jingleConfig = state.config.jingle || {};
        if (!isPreload && jingleConfig.enabled && state.songsSinceJingle >= (jingleConfig.everySongs || 4)) {
            const jingles = state.playlist.filter(t => t.type === 'jingle' && isTrackPlayable(t));
            if (jingles.length > 0) {
                state.songsSinceJingle = 0;
                return jingles[Math.floor(Math.random() * jingles.length)];
            }
        }

        const availableTracks = state.playlist.filter(track =>
            !state.history.includes(track.id) &&
            track.type === 'song' &&
            isTrackPlayable(track)
        );
        let trackPool = availableTracks.length > 0
            ? availableTracks
            : state.playlist.filter(t => t.type === 'song' && isTrackPlayable(t));

        if (trackPool.length === 0) {
            trackPool = state.playlist.filter(t => t.type === 'song');
        }

        if (availableTracks.length === 0) {
            state.history = state.currentTrack ? [state.currentTrack.id] : [];
        }

        // FIX: Ensure the current track is not repeated if other options are available.
        if (trackPool.length > 1 && state.currentTrack) {
            trackPool = trackPool.filter(track => track.id !== state.currentTrack.id);
        }

        if (!state.recentRotation.length && state.nextGroupPreference === 'recent') {
            replenishRecentRotation();
        }

        let nextTrack = null;
        if (state.recentRotation.length && state.nextGroupPreference === 'recent') {
            nextTrack = drawRecentTrack(trackPool);
        }

        if (!nextTrack) {
            const weightedPool = buildWeightedPool(trackPool);
            if (weightedPool.length === 0) {
                console.warn('Weighted pool is empty, falling back to random selection.');
                nextTrack = trackPool[Math.floor(Math.random() * trackPool.length)];
            } else {
                nextTrack = weightedPool[Math.floor(Math.random() * weightedPool.length)];
            }
        }

        if (nextTrack && state.recentTrackSet.has(nextTrack.id)) {
            removeFromRecentRotation(nextTrack.id);
            state.nextGroupPreference = 'older';
        } else if (state.recentTrackSet && state.recentTrackSet.size > 0) {
            state.nextGroupPreference = 'recent';
        }

        if (!isPreload && nextTrack && nextTrack.type === 'song') state.songsSinceJingle++;
        return nextTrack;
    }

    function playTrackNow(track) {
        if (!track || track.id === state.currentTrack?.id) return;
        state.nextTrack = track;
        const activePlayer = players[activePlayerIndex];
        if (state.isPlaying && activePlayer.currentTime > 0) {
            crossfade();
        } else {
            playNextTrack();
        }
    }

    function normalizeTrackSrc(src = '') {
        if (!src) return src;
        if (src.startsWith('/music/')) {
            return `.${src}`;
        }
        return src;
    }

    function playNextTrack() {
        const nextTrack = state.nextTrack || selectNextTrack();
        if (!nextTrack) {
            console.error("No track to play");
            return;
        }

        const previousTrack = state.currentTrack;
        if (previousTrack?.golden && state.pollSystem && dom.polls?.container) {
            const existingPoll = state.pollSystem.polls.find(poll => poll.question.includes(previousTrack.title));
            if (!existingPoll) {
                const goldPoll = state.pollSystem.addPoll({
                    question: `Jak oceniasz "${previousTrack.title}"?`,
                    type: 'rating',
                    scale: 5,
                    labels: ['Słabo', 'W porządku', 'Rewelacja!']
                });

                const pollContainer = document.createElement('div');
                pollContainer.id = `poll-${goldPoll.id}`;
                pollContainer.className = 'poll-container';
                dom.polls.container.insertBefore(pollContainer, dom.polls.container.firstChild);

                state.pollSystem.renderPoll(goldPoll, pollContainer);
            }
        }

        state.currentTrack = nextTrack;
        state.nextTrack = null;
        state.nextTrackReady = false;

        const activePlayer = players[activePlayerIndex];
        activePlayer.src = normalizeTrackSrc(state.currentTrack.src);
        const baseVolume = dom.player.volumeSlider ? parseFloat(dom.player.volumeSlider.value) : 0.5;
        activePlayer.volume = isQuietHour() ? baseVolume * 0.5 : baseVolume;

        const playPromise = activePlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                state.isPlaying = true;
                updateUIForNewTrack();
                updateHistory();
                preloadNextTrack();
            }).catch(handleAudioError);
        }
    }

    function preloadNextTrack() {
        state.nextTrack = selectNextTrack(true);
        state.nextTrackReady = false;

        if (state.nextTrack) {
            const inactivePlayerIndex = 1 - activePlayerIndex;
            const inactivePlayer = players[inactivePlayerIndex];

            const markReady = () => {
                state.nextTrackReady = true;
                cleanupListeners();
            };

            const handlePreloadError = (event) => {
                cleanupListeners();
                const failedTrack = state.nextTrack;
                if (failedTrack && !state.failedTracks.includes(failedTrack.id)) {
                    state.failedTracks.push(failedTrack.id);
                }

                const trackLabel = failedTrack?.title || failedTrack?.id || 'Onbekend nummer';
                displayError(`Voorbeluisteren mislukt: ${trackLabel}`);

                state.nextTrack = null;
                state.nextTrackReady = false;

                const target = event?.target;
                if (target && typeof target.removeAttribute === 'function') {
                    target.removeAttribute('src');
                    if (typeof target.load === 'function') {
                        target.load();
                    }
                }

                setTimeout(preloadNextTrack, 0);
            };

            const cleanupListeners = () => {
                inactivePlayer.removeEventListener('canplaythrough', markReady);
                inactivePlayer.removeEventListener('error', handlePreloadError);
            };

            inactivePlayer.addEventListener('canplaythrough', markReady, { once: true });
            inactivePlayer.addEventListener('error', handlePreloadError, { once: true });
            inactivePlayer.src = normalizeTrackSrc(state.nextTrack.src);
        }
    }

    async function crossfade() {
        try {
            if (!state.nextTrack) {
                playNextTrack();
                return;
            }

            const inactivePlayerIndex = 1 - activePlayerIndex;
            const activePlayer = players[activePlayerIndex];
            const nextPlayer = players[inactivePlayerIndex];

            if (!nextPlayer.src) {
                throw new Error('Next player source missing');
            }

            if (nextPlayer.readyState < 2) {
                await waitForMediaReady(nextPlayer, { timeout: 5000 });
            }

            activePlayerIndex = inactivePlayerIndex;

            nextPlayer.volume = 0;
            await nextPlayer.play();

            state.currentTrack = state.nextTrack;
            state.nextTrack = null;
            state.nextTrackReady = false;
            updateUIForNewTrack();
            updateHistory();

            const fadeDuration = (state.config.crossfadeSeconds || 2) * 1000;
            const intervalTime = 50;
            const steps = Math.max(1, Math.floor(fadeDuration / intervalTime));
            const baseVolume = dom.player.volumeSlider ? parseFloat(dom.player.volumeSlider.value) : 0.5;
            const finalVolume = isQuietHour() ? baseVolume * 0.5 : baseVolume;
            const volumeStep = finalVolume / steps;

            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                activePlayer.volume = Math.max(0, activePlayer.volume - volumeStep);
                nextPlayer.volume = Math.min(finalVolume, nextPlayer.volume + volumeStep);

                if (currentStep >= steps) {
                    activePlayer.pause();
                    activePlayer.volume = finalVolume;
                    clearInterval(fadeInterval);
                    preloadNextTrack();
                }
            }, intervalTime);
        } catch (error) {
            console.error('Crossfade error:', error);
            setTimeout(playNextTrack, 0);
        }
    }
    
    async function handleAudioError(error) {
        console.error('Audio afspeelfout:', error);

        const isHtmlMediaElement = typeof HTMLMediaElement !== 'undefined';
        const mediaTarget = isHtmlMediaElement && error?.target instanceof HTMLMediaElement ? error.target : null;
        const activePlayer = players[activePlayerIndex];
        const player = mediaTarget || activePlayer;
        const failingTrack = mediaTarget === activePlayer ? state.currentTrack : state.nextTrack || state.currentTrack;

        let source = player?.currentSrc || player?.src || failingTrack?.src;
        if (source) {
            source = normalizeTrackSrc(source);
        }

        let isNotFound = false;
        if (source) {
            try {
                const response = await fetch(source, { method: 'HEAD' });
                isNotFound = response.status === 404;
            } catch (fetchError) {
                console.warn('Kon audiobron niet verifiëren:', fetchError);
            }
        }

        if (failingTrack) {
            if (isNotFound) {
                if (!state.failedTracks.includes(failingTrack.id)) {
                    state.failedTracks.push(failingTrack.id);
                }
                displayError(`Bestand niet gevonden: ${failingTrack.title || failingTrack.id}`);
            } else {
                displayError(`Fout bij afspelen: ${failingTrack.title || failingTrack.id}`);
            }

            setTimeout(playNextTrack, isNotFound ? 0 : 2000);
        }
    }

    function togglePlayPause() {
        if (!state.isInitialized) { startRadio(); return; }
        const activePlayer = players[activePlayerIndex];
        if (activePlayer.paused) {
            if (audioContext && audioContext.state === 'suspended') { audioContext.resume(); }
            activePlayer.play().catch(handleAudioError);
        } else {
            activePlayer.pause();
        }
    }
    
    function seekTrack(e) {
        const activePlayer = players[activePlayerIndex];
        if (!activePlayer.duration) return;
        const progressContainer = dom.player.progressContainer;
        if (!progressContainer) return;
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        activePlayer.currentTime = (clickX / width) * activePlayer.duration;
    }
    
    function isQuietHour() {
        try {
            if (!state.config.quietHours) return false;
            const now = new Date();
            const [startH, startM] = state.config.quietHours.start.split(':');
            const [endH, endM] = state.config.quietHours.end.split(':');
            const quietStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startH, startM);
            const quietEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endH, endM);
            if (quietEnd < quietStart) { return now >= quietStart || now < quietEnd; } 
            else { return now >= quietStart && now < quietEnd; }
        } catch (e) {
            console.error("Fout bij parsen van quietHours:", e);
            return false;
        }
    }

    // --- UI Update & State Management ---
    function updateUIForNewTrack() {
        if (!state.currentTrack) return;
        const { title, artist, cover, id } = state.currentTrack;
        const elementsToFade = [dom.player.trackInfo, dom.player.cover].filter(Boolean);
        
        elementsToFade.forEach(el => el.classList.add('fade-out'));
        
        setTimeout(() => {
            if (dom.player.title) dom.player.title.textContent = title;
            if (dom.player.artist) dom.player.artist.textContent = artist;
            if (dom.player.cover) dom.player.cover.src = cover;
            if (dom.stickyPlayer.title) dom.stickyPlayer.title.textContent = title;
            if (dom.stickyPlayer.cover) dom.stickyPlayer.cover.src = cover;
            document.title = `${title} - Radio`;
            
            renderRatingUI(id);
            elementsToFade.forEach(el => el.classList.remove('fade-out'));

            updateLikes();
            updatePlayPauseButtons();
        }, 200);
    }
    
    function updatePlayPauseButtons() {
        state.isPlaying = !players[activePlayerIndex].paused;
        const icon = state.isPlaying ? '⸸️' : '▶️';
        if (dom.player.playPauseBtn) dom.player.playPauseBtn.textContent = icon;
        if (dom.stickyPlayer.playPauseBtn) dom.stickyPlayer.playPauseBtn.textContent = icon;

        const label = t(state.isPlaying ? 'playPauseLabel_pause' : 'playPauseLabel_play');
        if (dom.player.playPauseBtn) dom.player.playPauseBtn.setAttribute("aria-label", label);
        if (dom.stickyPlayer.playPauseBtn) dom.stickyPlayer.playPauseBtn.setAttribute("aria-label", label);

        document.body.classList.toggle('playing', state.isPlaying);

        if (state.isPlaying) {
            scheduleVisualizerFrame();
        } else {
            stopVisualizerLoop();
            clearVisualizerCanvas();
        }
    }

    function updateProgressBar() {
        const audio = players[activePlayerIndex];
        if (!audio.duration || !state.isPlaying || !audio.currentTime) return;

        const crossfadeTime = state.config.crossfadeSeconds || 2;
        if ((audio.duration - audio.currentTime) < crossfadeTime) {
            crossfade();
            return;
        }

        const progress = (audio.currentTime / audio.duration) * 100;
        if (dom.player.progressBar) dom.player.progressBar.style.width = `${progress}%`;
        if (dom.player.stickyProgressBar) dom.player.stickyProgressBar.style.width = `${progress}%`;
        if (dom.player.currentTime) dom.player.currentTime.textContent = formatTime(audio.currentTime);
        if (dom.player.timeRemaining) dom.player.timeRemaining.textContent = `-${formatTime(audio.duration - audio.currentTime)}`;
    }
    
    function updateHistory() {
        if (!state.currentTrack || state.history[0] === state.currentTrack.id) return;
        state.history.unshift(state.currentTrack.id);
        state.history = state.history.slice(0, 15);
        saveHistory();

        checkMilestoneAndAddPoll();

        if (dom.sidePanel.historyList) {
            dom.sidePanel.historyList.innerHTML = '';
            state.history.forEach(trackId => {
                const track = state.playlist.find(t => t.id === trackId);
                if (track) {
                    const item = createTrackListItem(track, {
                        subtitle: Array.isArray(track.tags) && track.tags.length > 0
                            ? track.tags.slice(0, 2).join(', ')
                            : ''
                    });
                    dom.sidePanel.historyList.appendChild(item);
                }
            });
        }
    }

    function updateWelcomeGreeting() {
        if (!dom.welcomeGreeting) return;
        const hour = new Date().getHours();
    let greeting = "Welkom bij Radio!";
    if (hour >= 6 && hour < 12) greeting = "Goedemorgen! Welkom bij Radio!";
    else if (hour >= 12 && hour < 18) greeting = "Goedemiddag! Welkom bij Radio!";
    else if (hour >= 18 && hour < 22) greeting = "Goedenavond! Welkom bij Radio!";
    else greeting = "Goedenacht! Welkom bij Radio!";
        
        dom.welcomeGreeting.textContent = greeting;
    }
    
    function updateOfflineStatus() {
        if (dom.offlineIndicator) {
            const isOnline = typeof navigator === 'object' ? navigator.onLine : true;
            dom.offlineIndicator.classList.toggle('hidden', isOnline);
        }
    }
    
    function displayError(message, showRetry = false) {
        if (dom.errorMessage) dom.errorMessage.textContent = message;
        if (dom.errorRetryBtn) dom.errorRetryBtn.classList.toggle('hidden', !showRetry);
        if (dom.errorOverlay) dom.errorOverlay.classList.remove('hidden');
    }

    // --- LocalStorage Management ---
    function safeLocalStorage(key, value) {
        // Guard clause for environment without localStorage
        if (typeof window === 'undefined' || !window.localStorage) {
            console.warn('localStorage niedostępny');
            return value === undefined ? null : undefined;
        }
        
        // Use STORAGE_PREFIX from CONFIG with fallback
        const STORAGE_PREFIX = (window.CONFIG && window.CONFIG.STORAGE_PREFIX) || 'daremon';
        
        try {
            if (value === undefined) {
                const item = window.localStorage.getItem(`${STORAGE_PREFIX}_${key}`);
                return item ? JSON.parse(item) : null;
            }
            window.localStorage.setItem(`${STORAGE_PREFIX}_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error(`localStorage błąd dla klucza "${key}":`, e);
            return value === undefined ? null : undefined;
        }
    }
    
    function loadStateFromLocalStorage() {
        state.likes = safeLocalStorage('likes') || {};
        state.messages = safeLocalStorage('messages') || [];
        // song dedications removed in simplified build
        state.history = safeLocalStorage('history') || [];
        state.reviews = safeLocalStorage('reviews') || {};
        applyTheme(safeLocalStorage('theme') || 'arburg');

        // Zaktualizuj wagi utworów na podstawie załadowanych ocen
        if (state.playlist && state.playlist.length > 0) {
            updatePlaylistWeights();
        }
    }

    function saveHistory() { safeLocalStorage('history', state.history); }
    function saveTheme(theme) { safeLocalStorage('theme', theme); }
    function saveLikes() { safeLocalStorage('likes', state.likes); }
    function saveMessages() { safeLocalStorage('messages', state.messages); }
    // song dedications feature removed in simplified build
    function saveReviews() { safeLocalStorage('reviews', state.reviews); }

    // --- Beoordelings- en Recensiesysteem ---
    function renderRatingUI(trackId) {
        if (!dom.player.starRatingContainer) return;
        
        dom.player.starRatingContainer.innerHTML = '';
        if (dom.player.commentForm) dom.player.commentForm.classList.add('hidden');
        let currentRating = 0;

        for (let i = 1; i <= 5; i++) {
            const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            star.setAttribute("viewBox", "0 0 24 24");
            star.setAttribute("fill", "currentColor");
            star.dataset.value = i;
            star.innerHTML = `<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`;
            
            star.addEventListener('mouseover', () => highlightStars(i));
            star.addEventListener('mouseout', () => highlightStars(currentRating));
            star.addEventListener('click', () => {
                currentRating = i;
                if (dom.player.commentForm) dom.player.commentForm.classList.remove('hidden');
            });
            dom.player.starRatingContainer.appendChild(star);
        }

        updateAverageRatingDisplay(trackId);
    }

    function highlightStars(rating) {
        if (!dom.player.starRatingContainer) return;
        const stars = dom.player.starRatingContainer.querySelectorAll('svg');
        stars.forEach(star => {
            star.classList.toggle('active', star.dataset.value <= rating);
        });
    }

    function handleRatingSubmit(e) {
        e.preventDefault();
        if (!dom.player.starRatingContainer || !dom.player.commentInput) return;
        
        const stars = dom.player.starRatingContainer.querySelectorAll('svg.active');
        const rating = stars.length;
        const comment = dom.player.commentInput.value;
        const trackId = state.currentTrack?.id;

        if (rating === 0) {
            displayError("Selecteer een beoordeling");
            return;
        }

        if (!state.reviews[trackId]) state.reviews[trackId] = [];
        state.reviews[trackId].push({ rating, comment: sanitizeHTML(comment), timestamp: Date.now() });
        saveReviews();
        
        if (dom.player.commentForm) {
            dom.player.commentForm.reset();
            dom.player.commentForm.classList.add('hidden');
        }
        highlightStars(0);
        updateAverageRatingDisplay(trackId);
        renderTopRated();
    }
    
    function calculateAverageRating(trackId) {
        const reviews = state.reviews[trackId];
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    }

    function updateAverageRatingDisplay(trackId) {
        if (!dom.player.averageRatingDisplay) return;
        const avg = calculateAverageRating(trackId);
        const count = state.reviews[trackId]?.length || 0;
        dom.player.averageRatingDisplay.textContent = count > 0 ? `Gemiddeld: ${avg.toFixed(1)} ⭐ (${count} beoordelingen)` : "Nog geen beoordelingen";
        
        // Zaktualizuj wagi utworów na podstawie nowych ocen
        updatePlaylistWeights();
    }
    
    /**
     * Aktualizuje wagi utworów w playliście na podstawie ocen użytkowników
     */
    function updatePlaylistWeights() {
        if (!state.playlist || state.playlist.length === 0) return;
        
        state.playlist.forEach(track => {
            const reviews = state.reviews[track.id];
            if (!reviews || reviews.length === 0) {
                // Brak ocen - zachowaj oryginalną wagę
                track.weight = track.originalWeight || track.weight || 1;
                return;
            }
            
            // Zachowaj oryginalną wagę przy pierwszym uruchomieniu
            if (!track.originalWeight) {
                track.originalWeight = track.weight || 1;
            }
            
            // Oblicz średnią ocenę
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            
            // Przekształć ocenę na mnożnik wagi (1-5 gwiazdek → 0.5-3.0 mnożnik)
            const ratingMultiplier = 0.5 + (avgRating - 1) * 0.625; // 1★→0.5x, 3★→1.75x, 5★→3.0x
            
            // Dodatkowy boost dla popularnych utworów (wiele ocen)
            const popularityBoost = Math.min(1.5, 1 + (reviews.length - 1) * 0.1); // Max +50% za popularność
            
            // Oblicz finalną wagę
            track.weight = Math.max(0.1, Math.round(track.originalWeight * ratingMultiplier * popularityBoost * 10) / 10);
            
            console.log(`🎵 ${track.title}: ocena ${avgRating.toFixed(1)}/5 (${reviews.length} głosów) → waga ${track.weight}`);
        });
        
        console.log(`✅ Zaktualizowano wagi ${state.playlist.length} utworów na podstawie ocen`);
    }

    // --- Best Beoordeelde Nummers ---
    function renderTopRated() {
        if (!dom.sidePanel.topRatedList) return;
        
        const ratedTracks = Object.keys(state.reviews).map(trackId => {
            const track = state.playlist.find(t => t.id === trackId);
            if (!track) return null;
            return {
                ...track,
                avgRating: calculateAverageRating(trackId),
                reviewCount: state.reviews[trackId].length
            };
        }).filter(Boolean);

        ratedTracks.sort((a, b) => b.avgRating - a.avgRating);

        dom.sidePanel.topRatedList.innerHTML = '';
        ratedTracks.slice(0, 5).forEach(track => {
            const subtitle = `${track.avgRating.toFixed(1)} ⭐ · ${track.reviewCount}`;
            const item = createTrackListItem(track, {
                subtitle,
                interactive: true,
                onActivate: () => playTrackNow(track)
            });
            dom.sidePanel.topRatedList.appendChild(item);
        });
    }

    // --- Luisteraarstelsimulatie ---
    function updateListenerCount() {
        if (!dom.header.listenerCount) return;
        const isOnline = typeof navigator === 'object' ? navigator.onLine : true;
        if (!isOnline) {
            dom.header.listenerCount.textContent = 'Offline';
            return;
        }
        const base = 5 + (Object.keys(state.likes).length % 10);
        const avgRating = state.currentTrack ? calculateAverageRating(state.currentTrack.id) : 0;
        const ratingBonus = Math.floor(avgRating * 2);
        const variance = Math.floor(Math.random() * 7) - 3;
        dom.header.listenerCount.textContent = `${base + ratingBonus + variance}`;
    }

    // --- Gouden Platen & Berichten ---
    function renderGoldenRecords() { 
        if (!dom.sidePanel.goldenRecordsList) return;
        const goldenTracks = state.playlist.filter(t => t.golden);
        dom.sidePanel.goldenRecordsList.innerHTML = '';
        goldenTracks.forEach(track => {
            const item = createTrackListItem(track, {
                subtitle: Array.isArray(track.tags) && track.tags.length > 0
                    ? track.tags.slice(0, 2).join(', ')
                    : '',
                interactive: true,
                onActivate: () => playTrackNow(track)
            });
            dom.sidePanel.goldenRecordsList.appendChild(item);
        });
    }

    function handleLike() {
        if (!state.currentTrack) return;
        const id = state.currentTrack.id;
        state.likes[id] = (state.likes[id] || 0) + 1;
        saveLikes();
        updateLikes();
        if (dom.player.likeBtn) {
            dom.player.likeBtn.classList.add('liked-animation');
            setTimeout(() => dom.player.likeBtn.classList.remove('liked-animation'), 400);
        }
    }
    
    function updateLikes() {
        const count = state.currentTrack ? state.likes[state.currentTrack.id] || 0 : 0;
        if (dom.player.likeCount) dom.player.likeCount.textContent = count;
    }
    
    function handleMessageSubmit(e) {
        e.preventDefault();
        const now = Date.now();
        if (now - state.lastMessageTimestamp < 30000) {
            displayError("Wacht 30 seconden tussen berichten");
            return;
        }
        
        if (!dom.sidePanel.djMessageInput) return;
        const message = dom.sidePanel.djMessageInput.value;
        if (!message.trim()) return;

        state.lastMessageTimestamp = now;
        addMessage("Jij", sanitizeHTML(message));
        if (dom.sidePanel.djMessageForm) dom.sidePanel.djMessageForm.reset();

        // Keyword-based boosting removed in simplified, privacy-safe build
        
        setTimeout(() => {
            const aiResponses = ["Bedankt voor je bericht!", "Leuk dat je luistert!", "Geweldige muziekkeuze!", "Blijf genieten van de muziek!"];
            const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            addMessage("DJ Bot", aiResponse, true);
        }, 1500);
    }

    function addMessage(author, text, isAI = false) {
        state.messages.push({ author, text, isAI, timestamp: new Date().toLocaleTimeString() });
        state.messages = state.messages.slice(-10);
        saveMessages();
        renderMessages();
    }

    function renderMessages() {
        if (!dom.sidePanel.messagesList) return;
        dom.sidePanel.messagesList.innerHTML = '';
        state.messages.forEach(msg => {
            const li = document.createElement('li');
            if (msg.isAI) li.classList.add('ai-response');
            li.innerHTML = `<b>${msg.author}:</b> ${msg.text} <i>(${msg.timestamp})</i>`;
            dom.sidePanel.messagesList.appendChild(li);
        });
        if(dom.sidePanel.messagesList.lastChild) {
            dom.sidePanel.messagesList.lastChild.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // song dedications feature removed in simplified build

    // --- Visualizer & Hulpprogramma's ---
    function scheduleVisualizerFrame() {
        if (visualizerAnimationId !== null) return;
        visualizerAnimationId = requestAnimationFrame(() => {
            visualizerAnimationId = null;
            drawVisualizer();
        });
    }

    function stopVisualizerLoop() {
        if (visualizerAnimationId !== null) {
            cancelAnimationFrame(visualizerAnimationId);
            visualizerAnimationId = null;
        }
    }

    function clearVisualizerCanvas() {
        if (!dom.visualizerCanvas) return;
        const ctx = dom.visualizerCanvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, dom.visualizerCanvas.width, dom.visualizerCanvas.height);
        }
    }

    function drawVisualizer() {
        const particleHost = typeof window !== 'undefined' ? window : globalThis;
        if (!analyser || !state.isPlaying || !dom.visualizerCanvas) {
            stopVisualizerLoop();
            clearVisualizerCanvas();
            if (particleHost.visualizerParticles) {
                particleHost.visualizerParticles = [];
            }
            return;
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const canvas = dom.visualizerCanvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ustaw rozmiar canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Wyczyść canvas z ciemnym gradientem tła
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, 'rgba(4, 19, 43, 0.95)');
        bgGradient.addColorStop(1, 'rgba(8, 37, 82, 0.95)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // === SUNBURST EFFECT (promienie z centrum) ===
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const numRays = 48;
        const maxRayLength = Math.max(canvas.width, canvas.height) * 0.6;

        ctx.save();
        ctx.globalAlpha = 0.3;

        for (let i = 0; i < numRays; i++) {
            const angle = (i / numRays) * Math.PI * 2;
            const amplitude = dataArray[Math.floor((i / numRays) * bufferLength)];
            const rayLength = (amplitude / 255) * maxRayLength * 0.5;

            const gradient = ctx.createLinearGradient(
                centerX, centerY,
                centerX + Math.cos(angle) * rayLength,
                centerY + Math.sin(angle) * rayLength
            );
            gradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 140, 0, 0)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * rayLength,
                centerY + Math.sin(angle) * rayLength
            );
            ctx.stroke();
        }
        ctx.restore();

        // === BOTTOM EQUALIZER BARS (złote słupki na dole) ===
        const numBars = 64;
        const barWidth = canvas.width / numBars;
        const maxBarHeight = canvas.height * 0.25; // 25% wysokości ekranu

        for (let i = 0; i < numBars; i++) {
            const dataIndex = Math.floor((i / numBars) * bufferLength);
            const amplitude = dataArray[dataIndex];
            const barHeight = (amplitude / 255) * maxBarHeight;

            // Gradient dla każdego słupka (ciemny dół -> jasny góra)
            const barGradient = ctx.createLinearGradient(
                i * barWidth, canvas.height,
                i * barWidth, canvas.height - barHeight
            );
            barGradient.addColorStop(0, 'rgba(255, 100, 0, 0.9)');
            barGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.95)');
            barGradient.addColorStop(1, 'rgba(255, 215, 0, 1)');

            ctx.fillStyle = barGradient;
            ctx.fillRect(
                i * barWidth + 1, // mała przerwa między słupkami
                canvas.height - barHeight,
                barWidth - 2,
                barHeight
            );

            // Dodatkowy blask na górze słupka
            if (barHeight > maxBarHeight * 0.3) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.fillRect(
                    i * barWidth + 1,
                    canvas.height - barHeight,
                    barWidth - 2,
                    3
                );
            }
        }

        // === PARTICLES EFFECT (spadające cząsteczki) ===
        if (!particleHost.visualizerParticles) {
            particleHost.visualizerParticles = [];
        }

        // Generuj nowe cząsteczki
        if (Math.random() > 0.7) {
            particleHost.visualizerParticles.push({
                x: Math.random() * canvas.width,
                y: 0,
                speedY: Math.random() * 2 + 1,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        // Rysuj i aktualizuj cząsteczki
        ctx.fillStyle = 'rgba(255, 180, 50, 0.6)';
        particleHost.visualizerParticles = particleHost.visualizerParticles.filter(particle => {
            particle.y += particle.speedY;

            if (particle.y > canvas.height) return false;

            ctx.globalAlpha = particle.opacity;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size * 3);

            return true;
        });

        ctx.globalAlpha = 1;

        scheduleVisualizerFrame();
    }

    
    function formatTime(seconds) { 
        if (isNaN(seconds)) return "0:00"; 
        const minutes = Math.floor(seconds / 60); 
        const secs = Math.floor(seconds % 60); 
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; 
    }
    
    function sanitizeHTML(str) { 
        const temp = document.createElement('div'); 
        temp.textContent = str; 
        return temp.innerHTML; 
    }
    
    function applyTheme(theme) { 
        document.body.dataset.theme = theme; 
    }

    // --- Event Listeners Instellen ---
    function setupEventListeners() {
        // Speler & Audio
        if (dom.player.playPauseBtn) dom.player.playPauseBtn.addEventListener('click', togglePlayPause);
        if (dom.player.nextBtn) dom.player.nextBtn.addEventListener('click', playNextTrack);
        if (dom.player.likeBtn) dom.player.likeBtn.addEventListener('click', handleLike);
        if (dom.player.volumeSlider) {
            dom.player.volumeSlider.addEventListener('input', (e) => { 
                const newVolume = isQuietHour() ? e.target.value * 0.5 : e.target.value; 
                players.forEach(p => p.volume = newVolume); 
            });
        }
        if (dom.player.progressContainer) dom.player.progressContainer.addEventListener('click', seekTrack);
        if (dom.player.commentForm) dom.player.commentForm.addEventListener('submit', handleRatingSubmit);
        
        players.forEach((player) => { 
            player.addEventListener('timeupdate', () => { 
                if (player === players[activePlayerIndex]) updateProgressBar(); 
            }); 
            player.addEventListener('ended', () => { 
                if (player === players[activePlayerIndex]) playNextTrack(); 
            }); 
            player.addEventListener('pause', () => { 
                if (player === players[activePlayerIndex]) updatePlayPauseButtons(); 
            }); 
            player.addEventListener('play', () => { 
                if (player === players[activePlayerIndex]) updatePlayPauseButtons(); 
            }); 
            player.addEventListener('error', handleAudioError); 
        });
        
        // Sticky Speler & Algemene UI
        if (dom.stickyPlayer.playPauseBtn) dom.stickyPlayer.playPauseBtn.addEventListener('click', togglePlayPause);
        if (dom.stickyPlayer.nextBtn) dom.stickyPlayer.nextBtn.addEventListener('click', playNextTrack);
        if (dom.themeSwitcher) {
            dom.themeSwitcher.addEventListener('click', (e) => { 
                if (e.target.tagName === 'BUTTON') { 
                    const theme = e.target.id.replace('theme-', ''); 
                    applyTheme(theme); 
                    saveTheme(theme); 
                } 
            });
        }
    if (dom.sidePanel.djMessageForm) dom.sidePanel.djMessageForm.addEventListener('submit', handleMessageSubmit);
        if (dom.errorCloseBtn) dom.errorCloseBtn.addEventListener('click', () => {
            if (dom.errorOverlay) dom.errorOverlay.classList.add('hidden');
        });
        if (dom.errorRetryBtn) dom.errorRetryBtn.addEventListener('click', retryLoad);

        // Machine documentation event listeners removed

        // Systeem Events
        window.addEventListener('online', updateOfflineStatus);
        window.addEventListener('offline', updateOfflineStatus);
        
        const nowPlayingSection = document.getElementById('now-playing-section');
        if (nowPlayingSection && dom.stickyPlayer.container) {
            const observer = new IntersectionObserver((entries) => { 
                dom.stickyPlayer.container.classList.toggle('visible', !entries[0].isIntersecting); 
            }, { threshold: 0.1 });
            observer.observe(nowPlayingSection);
        }
        
        // Toetsenbord & Touch
        window.addEventListener('keydown', (e) => { 
            if (document.activeElement.tagName === 'TEXTAREA' ||
                (dom.errorOverlay && !dom.errorOverlay.classList.contains('hidden'))) return;
            
            if (e.code === 'Space') { 
                e.preventDefault(); 
                togglePlayPause(); 
            } 
            if (e.code === 'KeyN') playNextTrack(); 
            if (e.code === 'KeyL') handleLike(); 
            if (e.code === 'ArrowUp' && dom.player.volumeSlider) { 
                e.preventDefault(); 
                dom.player.volumeSlider.value = Math.min(1, parseFloat(dom.player.volumeSlider.value) + 0.05).toFixed(2); 
                players.forEach(p=>p.volume = dom.player.volumeSlider.value); 
            } 
            if (e.code === 'ArrowDown' && dom.player.volumeSlider) { 
                e.preventDefault(); 
                dom.player.volumeSlider.value = Math.max(0, parseFloat(dom.player.volumeSlider.value) - 0.05).toFixed(2); 
                players.forEach(p=>p.volume = dom.player.volumeSlider.value); 
            } 
        });
        
        let touchStartX = 0; 
        let touchEndX = 0; 
        if (dom.sidePanel.menuToggle && dom.sidePanel.panel) {
            dom.sidePanel.menuToggle.addEventListener('click', () => dom.sidePanel.panel.classList.toggle('open')); 
        }
        
        document.body.addEventListener('touchstart', e => { 
            touchStartX = e.changedTouches[0].screenX; 
        }, { passive: true }); 
        
        document.body.addEventListener('touchend', e => { 
            touchEndX = e.changedTouches[0].screenX; 
            const deltaX = touchEndX - touchStartX; 
            if (Math.abs(deltaX) > 50) { 
                if (deltaX < 0) { 
                    if(dom.sidePanel.panel && dom.sidePanel.panel.classList.contains('open')) { 
                        dom.sidePanel.panel.classList.remove('open'); 
                    } else { 
                        playNextTrack(); 
                    } 
                } else { 
                    if (dom.sidePanel.panel) dom.sidePanel.panel.classList.add('open'); 
                } 
            } 
        });
    }
    
    // --- Service Worker ---
    if (typeof navigator === 'object' && 'serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker geregistreerd:', reg.scope))
                .catch(err => console.error('Service Worker registratie mislukt:', err));
        });
    }

    if (typeof window === 'object') {
        window.createQuickPoll = createQuickPoll;
        window.exportPollStats = exportPollStats;
    }

    initialize();
});
