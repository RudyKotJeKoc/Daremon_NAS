import { waitForMediaReady } from './media-utils.js';
import { createInitialState } from './state.js';
import { createTrackListItem } from './ui-utils.js';
import { PollSystem } from './poll-system.js';
import { STRATEGIC_POLLS, calculateStrategicMetrics, generateGoNoGoReport } from './strategic-polls.js';

const MACHINE_DOCS_KEY = 'daremon_machine_docs_v1';
const ANALYSIS_SCHEDULE_KEY = 'daremon_analysis_scheduled';
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/TO-BE-SET';

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
            songDedicationForm: document.getElementById('song-dedication-form'),
            songWordsInput: document.getElementById('song-words-input'),
            songNameInput: document.getElementById('song-name-input'),
            songDedicationList: document.getElementById('song-dedication-list'),
            songDedicationFeedback: document.getElementById('song-dedication-feedback'),
        },
        polls: {
            container: document.getElementById('polls-container'),
            section: document.getElementById('polls-section'),
        },
        strategicPolls: {
            container: document.getElementById('strategic-polls-container'),
            section: document.getElementById('strategic-polls-section'),
            kpis: {
                responses: document.getElementById('kpi-responses'),
                coreTeam: document.getElementById('kpi-core-team'),
                capital: document.getElementById('kpi-capital'),
                machines: document.getElementById('kpi-machines'),
            },
        },
        machineDocumentation: {
            section: document.getElementById('machine-documentation-cta'),
            form: document.getElementById('machine-doc-form'),
            status: document.getElementById('machine-doc-status'),
            tableBody: document.getElementById('machine-doc-table-body'),
            stats: {
                machines: document.getElementById('machine-stat-machines'),
                team: document.getElementById('machine-stat-team'),
                value: document.getElementById('machine-stat-value'),
            },
            whatsappButton: document.getElementById('machine-whatsapp-button'),
        },
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
                trackTitleDefault: "Welkom bij DAREMON Radio ETS",
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
                songDedicationTitle: "Song Capsule",
                songDedicationIntro: "Deel een paar woorden en wie er in jouw herinneringssong moet schitteren.",
                songWordsLabel: "Jouw woorden",
                songWordsPlaceholder: "Schrijf een korte tekst voor de song...",
                songNameLabel: "Naam van de ster",
                songNamePlaceholder: "Wie moeten we noemen?",
                songDedicationSubmit: "Bewaar herinnering",
                songDedicationThanks: "Bedankt! Je woorden zijn opgeslagen.",
                songDedicationCooldown: "Even geduld – één herinnering per minuut.",
                songDedicationMissing: "Vul zowel je woorden als een naam in.",
                songDedicationEmpty: "Nog geen inzendingen. Wees de eerste om iets te delen!",
                songDedicationTime: "Toegevoegd: {{timestamp}}"
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

        renderSongDedications();
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

        dom.polls.container.innerHTML = '';

        const examplePolls = [
            {
                question: 'Który utwór był HITEM tego tygodnia?',
                type: 'single-choice',
                options: [
                    { id: 'kaput', label: 'Kaput! - Daremon Band' },
                    { id: 'bmw-kut', label: 'BMW jeździ chujowo - DJ Bóbr' },
                    { id: 'plasdan', label: 'Plasdan padł (Remix) - Cleanroom Crew' },
                    { id: 'rompa-disco', label: 'Rompa (Disco Version) - Electric Team' }
                ],
                duration: '7 days'
            },
            {
                question: 'Jaki gatunek muzyczny chcesz słyszeć częściej?',
                type: 'multiple-choice',
                options: [
                    'Electro/Synth',
                    'Rock/Alternative',
                    'Techno/House',
                    'Pop/Dance',
                    'Ambient/Chill'
                ]
            },
            {
                question: 'Jak oceniasz DAREMON Radio ogólnie?',
                type: 'rating',
                scale: 5,
                labels: ['Słabo', 'Średnio', 'Świetnie']
            },
            {
                question: 'Jak oceniasz obecny klimat pracy w zespole?',
                type: 'emoji-rating',
                options: ['😞', '😐', '🙂', '😊', '🎉']
            },
            {
                question: 'O której godzinie najczęściej słuchasz DAREMON Radio?',
                type: 'single-choice',
                options: [
                    '6:00 - 9:00 (Poranny Rush)',
                    '9:00 - 12:00 (Praca)',
                    '12:00 - 14:00 (Lunch)',
                    '14:00 - 18:00 (Popołudnie)',
                    '18:00 - 22:00 (Wieczór)',
                    '22:00 - 6:00 (Nocna zmiana)'
                ]
            },
            {
                question: 'Która funkcja DAREMON Radio najbardziej Ci się podoba?',
                type: 'multiple-choice',
                options: [
                    'Odliczanie do 31 marca 2026',
                    'System ocen utworów',
                    'Chat DJ Bot',
                    'Song Dedications',
                    'Wizualizacja audio',
                    'Złote Płyty',
                    'Najwyżej ocenione',
                    'Motywy kolorystyczne'
                ]
            },
            {
                question: 'Co Twoim zdaniem powinno się stać z maszynami po przejęciu?',
                type: 'single-choice',
                options: [
                    'Wykup przez zespół Daremon',
                    'Sprzedaż zewnętrznej firmie',
                    'Negocjacje z Hansem (właściciel budynków)',
                    'Leasing z opcją wykupu',
                    'Nie mam zdania'
                ]
            },
            {
                question: 'Jak prawdopodobne jest, że polecisz DAREMON Radio współpracownikom?',
                type: 'rating',
                scale: 10,
                labels: ['Bardzo nieprawdopodobne', 'Neutralnie', 'Bardzo prawdopodobne']
            },
            {
                question: 'Ile utworów znajduje się w obecnej playliście DAREMON Radio?',
                type: 'single-choice',
                options: [
                    'Około 100',
                    'Około 150',
                    'Około 177',
                    'Ponad 200'
                ],
                correctAnswer: 'Około 177',
                reward: 'Badge: Music Expert 🎵'
            },
            {
                question: 'Jakiej funkcji najbardziej brakuje w radiu?',
                type: 'open-text',
                options: [],
                duration: null
            }
        ];

        examplePolls.forEach(pollData => {
            const poll = pollSystem.addPoll(pollData);
            const pollContainer = document.createElement('div');
            pollContainer.id = `poll-${poll.id}`;
            pollContainer.className = 'poll-container';
            dom.polls.container.appendChild(pollContainer);
            pollSystem.renderPoll(poll, pollContainer);
        });

        state.pollSystem = pollSystem;
        if (dom.polls.section) {
            dom.polls.section.classList.remove('hidden');
        }

        console.log('System ankiet zainicjalizowany z', examplePolls.length, 'ankietami');
    }

    function loadMachineDocs() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return [];
        }

        try {
            const raw = window.localStorage.getItem(MACHINE_DOCS_KEY);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Nie udało się odczytać rejestru maszyn:', error);
            return [];
        }
    }

    function saveMachineDocs(entries) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }

        try {
            window.localStorage.setItem(MACHINE_DOCS_KEY, JSON.stringify(entries));
        } catch (error) {
            console.error('Nie udało się zapisać rejestru maszyn:', error);
        }
    }

    function updateMachineDocTable(entries = loadMachineDocs()) {
        if (!dom.machineDocumentation.tableBody) {
            return;
        }

        dom.machineDocumentation.tableBody.innerHTML = '';

        if (!entries.length) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'Brak zgłoszeń — zrób pierwsze zdjęcie.';
            row.appendChild(cell);
            dom.machineDocumentation.tableBody.appendChild(row);
            return;
        }

        entries.slice(0, 10).forEach(entry => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = entry.machineName || '—';
            row.appendChild(nameCell);

            const modelCell = document.createElement('td');
            modelCell.textContent = entry.machineModel || '—';
            row.appendChild(modelCell);

            const serialCell = document.createElement('td');
            serialCell.textContent = entry.machineSerial || '—';
            row.appendChild(serialCell);

            const conditionCell = document.createElement('td');
            conditionCell.textContent = entry.machineCondition || entry.machineLocation || 'Brak danych';
            row.appendChild(conditionCell);

            dom.machineDocumentation.tableBody.appendChild(row);
        });
    }

    function updateMachineStats(entries = loadMachineDocs()) {
        if (!dom.machineDocumentation.stats) {
            return;
        }

        const machines = entries.length;
        const reporters = new Set();
        entries.forEach(entry => {
            if (entry.reporter) {
                reporters.add(entry.reporter.trim().toLowerCase());
            }
        });
        const estimatedValue = Math.max(0, machines * 2500);

        if (dom.machineDocumentation.stats.machines) {
            dom.machineDocumentation.stats.machines.textContent = `${machines}`;
            dom.machineDocumentation.stats.machines.setAttribute('aria-label', `Udokumentowane maszyny: ${machines}`);
        }
        if (dom.machineDocumentation.stats.team) {
            dom.machineDocumentation.stats.team.textContent = `${reporters.size}`;
            dom.machineDocumentation.stats.team.setAttribute('aria-label', `Osoby dokumentujące: ${reporters.size}`);
        }
        if (dom.machineDocumentation.stats.value) {
            const formatted = new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
            }).format(estimatedValue);
            dom.machineDocumentation.stats.value.textContent = formatted;
            dom.machineDocumentation.stats.value.setAttribute('aria-label', `Szacowana wartość: ${formatted}`);
        }
    }

    function handleMachineDocSubmit(event) {
        event.preventDefault();

        if (!dom.machineDocumentation.form) {
            return;
        }

        const formData = new FormData(dom.machineDocumentation.form);
        const files = dom.machineDocumentation.form.machinePhotos?.files || [];
        const entry = {
            machineName: formData.get('machineName')?.trim() || '',
            machineModel: formData.get('machineModel')?.trim() || '',
            machineSerial: formData.get('machineSerial')?.trim() || '',
            machineLocation: formData.get('machineLocation')?.trim() || '',
            machineCondition: formData.get('machineCondition')?.trim() || '',
            reporter: formData.get('machineReporter')?.trim() || '',
            photoCount: files.length,
            createdAt: new Date().toISOString(),
        };

        const currentEntries = loadMachineDocs();
        const updatedEntries = [entry, ...currentEntries].slice(0, 30);
        saveMachineDocs(updatedEntries);
        updateMachineDocTable(updatedEntries);
        updateMachineStats(updatedEntries);

        dom.machineDocumentation.form.reset();
        if (dom.machineDocumentation.status) {
            dom.machineDocumentation.status.textContent = files.length
                ? 'Zapisano lokalnie. Udostępnij zdjęcia na grupie WhatsApp.'
                : 'Zapisano lokalnie. Dodaj zdjęcia i podziel się w grupie.';
        }
    }

    function openWhatsAppGroup() {
        if (typeof window !== 'undefined') {
            window.open(WHATSAPP_GROUP_LINK, '_blank', 'noopener');
        }
    }

    function initializeStrategicPolls() {
        if (!dom.strategicPolls?.container) {
            console.warn('Brak kontenera dla ankiet strategicznych');
            return;
        }

        const translate = (key, fallback) => {
            const value = t(key);
            return typeof value === 'string' && !value.startsWith('[') ? value : fallback;
        };

        const pollSystem = new PollSystem({
            storageKey: 'daremon_strategic_polls_v1',
            strings: {
                submit: translate('pollSubmit', 'Wyślij odpowiedź'),
                success: translate('pollSuccess', 'Dziękujemy za głos!'),
                selectOption: translate('pollSelectOption', 'Wybierz odpowiedź przed wysłaniem.'),
                selectMultiple: translate('pollSelectMultiple', 'Zaznacz przynajmniej jedną odpowiedź.'),
                textRequired: translate('pollTextRequired', 'Wpisz odpowiedź, zanim wyślesz.'),
                resultsHeading: translate('pollResultsHeading', 'Wyniki'),
                noVotes: translate('pollNoVotes', 'Brak głosów w tej ankiecie.'),
                rangeLabel: translate('pollRangeLabel', 'Wybierz ocenę na skali'),
                openTextPlaceholder: translate('pollOpenTextPlaceholder', 'Twoja odpowiedź...'),
                totalVotesLabel: translate('pollTotalVotesLabel', 'Oddane głosy:'),
            }
        });

        const originalRecordVote = pollSystem.recordVote.bind(pollSystem);
        pollSystem.recordVote = (poll, submission) => {
            originalRecordVote(poll, submission);
            updateStrategicKpis();
            scheduleGoNoGoAnalysis();
        };

        dom.strategicPolls.container.innerHTML = '';
        const priorityOrder = { CRITICAL: 0, URGENT: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
        const priorityPolls = STRATEGIC_POLLS
            .slice()
            .sort((a, b) => (priorityOrder[a.priority] ?? 5) - (priorityOrder[b.priority] ?? 5))
            .filter(poll => ['CRITICAL', 'URGENT'].includes(poll.priority))
            .slice(0, 6);

        priorityPolls.forEach(pollData => {
            const poll = pollSystem.addPoll(pollData);
            const container = document.createElement('div');
            container.className = `poll-container strategic-poll${pollData.confidential ? ' strategic-poll-confidential' : ''}`;
            container.dataset.category = pollData.category;
            dom.strategicPolls.container.appendChild(container);
            pollSystem.renderPoll(poll, container);
        });

        state.strategicPollSystem = pollSystem;
        updateStrategicKpis();
        scheduleGoNoGoAnalysis(true);
        checkAndRunGoNoGoAnalysis();
    }

    function scheduleGoNoGoAnalysis(force = false) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }

        const existing = window.localStorage.getItem(ANALYSIS_SCHEDULE_KEY);
        if (existing && !force) {
            return;
        }

        const analysisDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        window.localStorage.setItem(ANALYSIS_SCHEDULE_KEY, analysisDate.toISOString());
        console.log(`📊 Analiza GO/NO-GO zaplanowana na: ${analysisDate.toLocaleDateString()}`);
    }

    function checkAndRunGoNoGoAnalysis() {
        if (typeof window === 'undefined' || !window.localStorage || !state.strategicPollSystem) {
            return;
        }

        const scheduled = window.localStorage.getItem(ANALYSIS_SCHEDULE_KEY);
        if (!scheduled) {
            return;
        }

        const scheduledDate = new Date(scheduled);
        if (Number.isNaN(scheduledDate.getTime())) {
            return;
        }

        if (Date.now() >= scheduledDate.getTime()) {
            const report = generateGoNoGoReport(state.strategicPollSystem.store?.polls || {});
            displayGoNoGoReport(report);
            window.localStorage.removeItem(ANALYSIS_SCHEDULE_KEY);
        }
    }

    function updateStrategicKpis() {
        if (!dom.strategicPolls?.kpis) {
            return;
        }

        const metrics = state.strategicPollSystem
            ? calculateStrategicMetrics(state.strategicPollSystem.store?.polls || {})
            : { responseRate: 0, coreTeam: 0, formattedCapital: '€0', machines: 0 };

        if (dom.strategicPolls.kpis.responses) {
            dom.strategicPolls.kpis.responses.textContent = `${metrics.responseRate || 0}%`;
            dom.strategicPolls.kpis.responses.setAttribute('aria-label', `Wypełnione ankiety: ${metrics.responseRate || 0} procent`);
        }
        if (dom.strategicPolls.kpis.coreTeam) {
            dom.strategicPolls.kpis.coreTeam.textContent = `${metrics.coreTeam || 0}`;
            dom.strategicPolls.kpis.coreTeam.setAttribute('aria-label', `Zespół rdzenia: ${metrics.coreTeam || 0} osób`);
        }
        if (dom.strategicPolls.kpis.capital) {
            dom.strategicPolls.kpis.capital.textContent = metrics.formattedCapital || '€0';
            dom.strategicPolls.kpis.capital.setAttribute('aria-label', `Kapitał zadeklarowany: ${metrics.formattedCapital || '€0'}`);
        }
        if (dom.strategicPolls.kpis.machines) {
            dom.strategicPolls.kpis.machines.textContent = `${metrics.machines || 0}`;
            dom.strategicPolls.kpis.machines.setAttribute('aria-label', `Maszyny udokumentowane: ${metrics.machines || 0}`);
        }
    }

    function displayGoNoGoReport(report) {
        if (!report || typeof document === 'undefined') {
            return;
        }

        const existingModal = document.querySelector('.go-nogo-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'go-nogo-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'go-nogo-heading');
        modal.tabIndex = -1;

        const content = document.createElement('div');
        content.className = 'go-nogo-content';

        const gapsHtml = report.criticalGaps?.length
            ? `<div class="critical-gaps"><h3>⚠️ Krytyczne luki</h3><ul>${report.criticalGaps.map(gap => `<li>${gap}</li>`).join('')}</ul></div>`
            : '';

        content.innerHTML = `
            <h2 id="go-nogo-heading">📊 RAPORT GO/NO-GO</h2>
            <div class="decision-badge ${report.decision.toLowerCase()}">${report.decision}</div>
            <div class="report-stats">
                <div class="stat"><span class="label">Zespół Rdzenia</span><span class="value">${report.coreTeam}</span></div>
                <div class="stat"><span class="label">Kapitał</span><span class="value">${report.capital}</span></div>
                <div class="stat"><span class="label">Maszyny</span><span class="value">${report.machines}</span></div>
                <div class="stat"><span class="label">Relacje z klientami</span><span class="value">${report.clients}</span></div>
                <div class="stat"><span class="label">Frekwencja</span><span class="value">${report.responseRate}%</span></div>
            </div>
            <p class="report-note">Średnia deklaracja czasu: ${report.hoursAverage} h/tydz.</p>
            ${gapsHtml}
            <div class="next-steps">
                <h3>📋 Następne kroki</h3>
                <ol>${report.nextSteps.map(step => `<li>${step}</li>`).join('')}</ol>
            </div>
        `;

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'go-nogo-close';
        closeButton.textContent = 'Zamknij';
        closeButton.setAttribute('aria-label', 'Zamknij raport GO/NO-GO');
        closeButton.addEventListener('click', () => modal.remove());
        content.appendChild(closeButton);

        modal.appendChild(content);
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
        setTimeout(() => modal.focus(), 0);

        const escHandler = (event) => {
            if (event.key === 'Escape') {
                modal.remove();
            }
        };
        document.addEventListener('keydown', escHandler, { once: true });
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
            initializeStrategicPolls();
            updateMachineDocTable();
            updateMachineStats();
            updateWelcomeGreeting();
            updateOfflineStatus();
            renderMessages();
            renderSongDedications();
            renderGoldenRecords();
            renderTopRated();
            populateMachineSelect();
            renderCalendar();
            setInterval(updateListenerCount, 15000);
            updateListenerCount();
            setInterval(checkAndRunGoNoGoAnalysis, 6 * 60 * 60 * 1000);

            prepareIntroSequence();
        } catch (error) {
            console.error("Initialisatie mislukt:", error);
            displayError(t('errorPlaylistLoad', { message: error.message }), true);
        }
    }

    async function loadPlaylist() {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(t('errorTimeout'))), 10000)
        );
        
        try {
            const fetchPromise = fetch('./playlist.json');
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('Response is not JSON, content-type:', contentType);
                const text = await response.text();
                console.error('Received content:', text.substring(0, 200));
                throw new Error('Server returned HTML instead of JSON - check file path');
            }
            
            const data = await response.json();
            state.playlist = data.tracks || [];
            state.config = data.config || {};

            prepareRecentRotation();

            if (state.playlist.length === 0) {
                throw new Error('Playlist is empty');
            }

            console.log(`Loaded ${state.playlist.length} tracks`);
        } catch (e) {
            console.error('Playlist load error:', e);
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
            document.title = `${title} - DAREMON Radio ETS`;
            
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
        let greeting = "Welkom bij DAREMON Radio ETS!";
        if (hour >= 6 && hour < 12) greeting = "Goedemorgen! Welkom bij DAREMON Radio ETS!";
        else if (hour >= 12 && hour < 18) greeting = "Goedemiddag! Welkom bij DAREMON Radio ETS!";
        else if (hour >= 18 && hour < 22) greeting = "Goedenavond! Welkom bij DAREMON Radio ETS!";
        else greeting = "Goedenacht! Welkom bij DAREMON Radio ETS!";
        
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
        try {
            if (value === undefined) {
                const item = localStorage.getItem(`daremon_${key}`);
                return item ? JSON.parse(item) : null;
            }
            localStorage.setItem(`daremon_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error(`localStorage fout voor sleutel "${key}":`, e);
            return null;
        }
    }
    
    function loadStateFromLocalStorage() {
        state.likes = safeLocalStorage('likes') || {};
        state.messages = safeLocalStorage('messages') || [];
        state.songDedications = safeLocalStorage('songDedications') || [];
        state.history = safeLocalStorage('history') || [];
        state.reviews = safeLocalStorage('reviews') || {};
        applyTheme(safeLocalStorage('theme') || 'arburg');
    }

    function saveHistory() { safeLocalStorage('history', state.history); }
    function saveTheme(theme) { safeLocalStorage('theme', theme); }
    function saveLikes() { safeLocalStorage('likes', state.likes); }
    function saveMessages() { safeLocalStorage('messages', state.messages); }
    function saveSongDedications() { safeLocalStorage('songDedications', state.songDedications); }
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

        const keywords = { 'cleanroom': 'plasdan', 'plasdan': 'plasdan', 'bmw': 'bmw-kut' };
        Object.keys(keywords).forEach(key => {
            if (message.toLowerCase().includes(key)) {
                const trackId = keywords[key];
                state.tempBoosts[trackId] = (state.tempBoosts[trackId] || 0) + 5;
                setTimeout(() => {
                    state.tempBoosts[trackId] -= 5;
                }, 10 * 60 * 1000);
            }
        });
        
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

    function setSongDedicationFeedback(key, isError = false) {
        if (!dom.sidePanel.songDedicationFeedback) return;
        dom.sidePanel.songDedicationFeedback.textContent = key ? t(key) : '';
        dom.sidePanel.songDedicationFeedback.classList.toggle('error', Boolean(isError));
    }

    function handleSongDedicationSubmit(event) {
        event.preventDefault();
        if (!dom.sidePanel.songWordsInput || !dom.sidePanel.songNameInput) return;

        setSongDedicationFeedback('', false);

        const now = Date.now();
        if (now - state.lastSongDedicationTimestamp < 60000) {
            setSongDedicationFeedback('songDedicationCooldown', true);
            return;
        }

        const words = dom.sidePanel.songWordsInput.value.trim();
        const name = dom.sidePanel.songNameInput.value.trim();

        if (!words || !name) {
            setSongDedicationFeedback('songDedicationMissing', true);
            return;
        }

        const entry = {
            words: sanitizeHTML(words),
            name: sanitizeHTML(name),
            timestamp: new Date().toLocaleString(state.language === 'nl' ? 'nl-NL' : 'pl-PL')
        };

        state.songDedications.push(entry);
        state.songDedications = state.songDedications.slice(-15);
        state.lastSongDedicationTimestamp = now;
        saveSongDedications();
        renderSongDedications();

        if (dom.sidePanel.songDedicationForm) dom.sidePanel.songDedicationForm.reset();
        setSongDedicationFeedback('songDedicationThanks', false);
    }

    function renderSongDedications() {
        if (!dom.sidePanel.songDedicationList) return;
        dom.sidePanel.songDedicationList.innerHTML = '';

        if (!state.songDedications.length) {
            const emptyItem = document.createElement('li');
            emptyItem.classList.add('empty-state');
            emptyItem.textContent = t('songDedicationEmpty');
            dom.sidePanel.songDedicationList.appendChild(emptyItem);
            return;
        }

        [...state.songDedications].reverse().forEach(entry => {
            const item = document.createElement('li');

            const nameEl = document.createElement('span');
            nameEl.classList.add('song-dedication-name');
            nameEl.innerHTML = entry.name;

            const wordsEl = document.createElement('span');
            wordsEl.classList.add('song-dedication-words');
            wordsEl.innerHTML = entry.words;

            const timeEl = document.createElement('span');
            timeEl.classList.add('song-dedication-time');
            timeEl.textContent = t('songDedicationTime', { timestamp: entry.timestamp });

            item.appendChild(nameEl);
            item.appendChild(wordsEl);
            item.appendChild(timeEl);
            dom.sidePanel.songDedicationList.appendChild(item);
        });
    }

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
        if (dom.sidePanel.songDedicationForm) dom.sidePanel.songDedicationForm.addEventListener('submit', handleSongDedicationSubmit);
        if (dom.errorCloseBtn) dom.errorCloseBtn.addEventListener('click', () => {
            if (dom.errorOverlay) dom.errorOverlay.classList.add('hidden');
        });
        if (dom.errorRetryBtn) dom.errorRetryBtn.addEventListener('click', retryLoad);

        if (dom.machineDocumentation.form) dom.machineDocumentation.form.addEventListener('submit', handleMachineDocSubmit);
        if (dom.machineDocumentation.whatsappButton) dom.machineDocumentation.whatsappButton.addEventListener('click', openWhatsAppGroup);

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
