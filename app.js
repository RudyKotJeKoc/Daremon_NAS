import { waitForMediaReady } from './media-utils.js';

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

    let state = {
        // Radio State
        playlist: [],
        config: {},
        history: [],
        messages: [],
        songDedications: [],
        reviews: {},
        currentTrack: null,
        nextTrack: null,
        nextTrackReady: false,
        isPlaying: false,
        isInitialized: false,
        lastMessageTimestamp: 0,
        lastSongDedicationTimestamp: 0,
        songsSinceJingle: 0,
        likes: {},
        tempBoosts: {},
        failedTracks: [],
        introSequenceFinished: false,
        // App State
        language: 'nl',
        translations: {},
    };

    // --- INTERNATIONALISATIE (i18n) ---
    async function i18n_init() {
        const userLang = navigator.language.split('-')[0];
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

    // --- Initialisatie ---
    async function initialize() {
        await i18n_init();

        try {
            await loadPlaylist();
            loadStateFromLocalStorage();
            setupEventListeners();
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

    function prepareIntroSequence() {
        if (!dom.autoplayOverlay) {
            startRadio();
            return;
        }

        dom.autoplayOverlay.style.display = 'flex';
        dom.autoplayOverlay.classList.remove('is-hidden');

        const introVideo = dom.introVideo;
        let fallbackTimer;

        const finalizeIntro = () => {
            if (state.introSequenceFinished) return;
            state.introSequenceFinished = true;
            if (fallbackTimer) clearTimeout(fallbackTimer);
            startRadio();
        };

        fallbackTimer = setTimeout(finalizeIntro, 6500);

        if (!introVideo) {
            finalizeIntro();
            return;
        }

        const flagReady = () => dom.autoplayOverlay.classList.add('is-ready');
        introVideo.addEventListener('canplaythrough', flagReady, { once: true });
        introVideo.addEventListener('loadeddata', flagReady, { once: true });
        introVideo.addEventListener('ended', finalizeIntro, { once: true });
        introVideo.addEventListener('error', finalizeIntro, { once: true });
        introVideo.addEventListener('abort', finalizeIntro, { once: true });

        const playPromise = introVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => finalizeIntro());
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
            drawVisualizer();
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

        const weightedPool = [];
        trackPool.forEach(track => {
            const boost = state.tempBoosts[track.id] || 0;
            const avgRating = calculateAverageRating(track.id);
            const ratingBoost = avgRating ? avgRating / 2 : 0;
            const weight = (track.weight || 1) + boost + ratingBoost;
            for (let i = 0; i < Math.ceil(weight); i++) {
                weightedPool.push(track);
            }
        });
        
        const nextTrack = weightedPool[Math.floor(Math.random() * weightedPool.length)];

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
            };

            inactivePlayer.addEventListener('canplaythrough', markReady, { once: true });
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
        const icon = state.isPlaying ? '⏸️' : '▶️';
        if (dom.player.playPauseBtn) dom.player.playPauseBtn.textContent = icon;
        if (dom.stickyPlayer.playPauseBtn) dom.stickyPlayer.playPauseBtn.textContent = icon;
        
        const label = t(state.isPlaying ? 'playPauseLabel_pause' : 'playPauseLabel_play');
        if (dom.player.playPauseBtn) dom.player.playPauseBtn.setAttribute("aria-label", label);
        if (dom.stickyPlayer.playPauseBtn) dom.stickyPlayer.playPauseBtn.setAttribute("aria-label", label);
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
        
        if (dom.sidePanel.historyList) {
            dom.sidePanel.historyList.innerHTML = '';
            state.history.forEach(trackId => {
                const track = state.playlist.find(t => t.id === trackId);
                if (track) {
                    const li = document.createElement('li');
                    li.textContent = `${track.artist} - ${track.title}`;
                    dom.sidePanel.historyList.appendChild(li);
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
            dom.offlineIndicator.classList.toggle('hidden', navigator.onLine);
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
            const li = document.createElement('li');
            li.textContent = `${track.artist} - ${track.title} (${track.avgRating.toFixed(1)} ⭐)`;
            li.dataset.trackId = track.id;
            li.addEventListener('click', () => playTrackNow(track));
            dom.sidePanel.topRatedList.appendChild(li);
        });
    }

    // --- Luisteraarstelsimulatie ---
    function updateListenerCount() {
        if (!dom.header.listenerCount) return;
        if (!navigator.onLine) {
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
            const li = document.createElement('li'); 
            li.textContent = `${track.artist} - ${track.title}`; 
            li.dataset.trackId = track.id; 
            li.addEventListener('click', () => { 
                const trackToPlay = state.playlist.find(t => t.id === li.dataset.trackId); 
                playTrackNow(trackToPlay); 
            }); 
            dom.sidePanel.goldenRecordsList.appendChild(li); 
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
    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        if (!analyser || !state.isPlaying || !dom.visualizerCanvas) return;

        if (!dom.visualizerCanvas || typeof dom.visualizerCanvas.getContext !== 'function') {
            return;
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const canvas = dom.visualizerCanvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(4, 19, 43, 0.14)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.28;

        ctx.lineCap = 'round';
        ctx.shadowBlur = 24;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';

        for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i];
            const amplitude = value / 255;
            const angle = (i / bufferLength) * Math.PI * 2;
            const radius = baseRadius + amplitude * Math.min(centerX, centerY) * 0.75;
            const targetX = centerX + Math.cos(angle) * radius;
            const targetY = centerY + Math.sin(angle) * radius;

            ctx.lineWidth = 1.2 + amplitude * 3.4;
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.35 + amplitude * 0.55})`;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
        }
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
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker geregistreerd:', reg.scope))
                .catch(err => console.error('Service Worker registratie mislukt:', err));
        });
    }

    initialize();
});