# 📻 DAREMON Radio ETS

> Nowoczesna Progressive Web App (PWA) - oficjalne firmowe radio internetowe z zaawansowanymi funkcjami interaktywnymi, wizualizacjami 3D i systemem ankiet

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-enabled-brightgreen.svg)](manifest.json)
[![Service Worker](https://img.shields.io/badge/Service%20Worker-v11-orange.svg)](sw.js)
[![Tests](https://img.shields.io/badge/tests-23_suites-success.svg)](tests/)
[![Build Tool](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.170.0-000000.svg)](https://threejs.org/)
[![i18n](https://img.shields.io/badge/languages-4-success.svg)](#)

---

## 📋 Spis treści

- [O Projekcie](#-o-projekcie)
- [Główne Funkcje](#-główne-funkcje)
- [Wykryty Stos Technologiczny](#-wykryty-stos-technologiczny)
- [Uruchomienie Lokalne (Quick Start)](#-uruchomienie-lokalne-quick-start)
- [Struktura Projektu](#-struktura-projektu)
- [Przegląd API](#-przegląd-api)
- [Konfiguracja](#-konfiguracja)
- [Testowanie](#-testowanie)
- [Dokumentacja](#-dokumentacja)
- [Licencja](#-licencja)

---

## 🎯 O Projekcie

**DAREMON Radio ETS** to w pełni funkcjonalna aplikacja webowa typu **Progressive Web App (PWA)** stworzona jako oficjalne radio internetowe dla zespołu DAREMON ETS. Projekt łączy nowoczesne technologie webowe z intuicyjnym interfejsem użytkownika, oferując wciągające doświadczenie muzyczne dostępne zarówno **online, jak i offline**.

### 🏢 Cel i Kontekst

Aplikacja powstała jako wewnętrzne narzędzie dla zespołu DAREMON ETS, mające na celu:
- **Integrację zespołu** poprzez wspólne słuchanie muzyki i interakcje społecznościowe
- **Zwiększenie motywacji** i poprawę atmosfery w miejscu pracy
- **Demonstrację umiejętności technicznych** zespołu w zakresie nowoczesnych technologii webowych
- **Platformę komunikacji wewnętrznej** - ankiety, wiadomości, feedback

### 🎨 Architektura

- **Typ aplikacji:** Multi-Page Application (MPA) z Progressive Web App
- **Model:** Frontend-only z opcjonalną integracją backendu
- **Strategia:** Offline-first approach z Service Worker
- **Internacjonalizacja:** Pełna obsługa 4 języków (Polski, Niderlandzki, Angielski, Czeski)

---

## ✨ Główne Funkcje

### 🎵 Zaawansowany Odtwarzacz Audio
- Inteligentny odtwarzacz z płynnym **crossfade** między utworami (2s)
- Automatyczne zarządzanie playlistą z konfigurowalnymi utworami (500+ utworów)
- System **wag** określających częstotliwość odtwarzania
- Automatyczne wstawianie jingle co 4 utwory lub co 15 minut
- Historia odtwarzania (15 ostatnio odtworzonych)
- Wsparcie dla różnych formatów audio (MP3, OGG, WAV)
- Sticky player - odtwarzacz zawsze widoczny podczas przewijania
- Kontrola głośności z efektami wizualnymi
- Progress bar z możliwością przeskakiwania w utworze

### 🎨 Wizualizacja Audio 2D/3D
- **2D Canvas Visualizer** - wizualizacja audio w czasie rzeczywistym:
  - Promienie sunburst z centrum
  - Słupki equalizera
  - Spadające cząsteczki
- **3D Three.js Visualizer** - zaawansowana wizualizacja 3D:
  - Centralna kula reagująca na bas
  - 300 interaktywnych cząsteczek reprezentujących zakresy częstotliwości
  - OrbitControls dla interaktywnej kontroli kamery
  - Automatyczna rotacja po bezczynności
  - Progressive enhancement z fallback do 2D
- Przełącznik 2D/3D w kontrolkach odtwarzacza
- Animowane efekty świetlne (glow, burst, rays)

### 🗳️ System Ankiet i Feedback
- **Ankiety społecznościowe** - dynamiczne głosowania z różnymi typami pytań
- **Ankieta pracownicza** - dedykowana ankieta dla zespołu DAREMON zbierająca opinie o:
  - Kontynuacji pracy w zespole
  - Najbardziej przydatnych funkcjach
  - Pomysłach na nowe funkcje
  - Obszarach wsparcia i pomocy
- **Ankieta Granulate** - specjalistyczna ankieta systemu transportu granulatu:
  - 6 sekcji tematycznych
  - Różnorodne typy pytań (skale, wielokrotny wybór, tekst)
  - Dedykowana strona z własnym designem
- Offline-first approach - ankiety działają bez internetu
- Przechowywanie wyników w IndexedDB

### ⭐ System Ocen i Interakcji
- Ocenianie utworów gwiazdkami (1-5)
- Komentowanie utworów
- System like/dislike
- Dynamiczny wpływ ocen na częstotliwość odtwarzania
- Rankingi utworów:
  - Złote Płyty (najbardziej wartościowe)
  - Najwyżej ocenione
  - Ostatnio grane

### 💬 Funkcje Społecznościowe
- **Wiadomości DJ** - możliwość wysyłania wiadomości z AI odpowiedziami
- **Live Talk** - symulacja funkcji "mów do radia"
- **Licznik słuchaczy** - dynamiczny licznik pokazujący liczbę aktywnych słuchaczy:
  - Symulacja uwzględniająca porę dnia i dzień tygodnia
  - Możliwość integracji z rzeczywistym API
  - Wsparcie dla WebSocket w celu aktualizacji na żywo
  - Automatyczne pauzowanie gdy strona jest ukryta

### 🌐 Wielojęzyczność (i18n)
- Pełna obsługa **4 języków**: Polski, Niderlandzki, Angielski, Czeski
- Automatyczne wykrywanie języka przeglądarki
- Dynamiczne przełączanie języków bez przeładowania strony
- Kompletne tłumaczenia wszystkich interfejsów

### 📴 Progressive Web App (PWA)
- Instalowalna jako aplikacja desktopowa/mobilna
- Service Worker v11 z cache-first strategią
- Offline fallback dla wszystkich zasobów
- Stale-while-revalidate dla playlisty i tłumaczeń
- Manifest skonfigurowany z ikonami SVG
- Wsparcie dla MediaSession API (kontrolki systemowe)

### 🎯 Dodatkowe Narzędzia
- **Widget pogodowy** - wyświetlanie aktualnych warunków atmosferycznych
- **Timery odliczające** - wizualne odliczanie do ważnych terminów firmowych
- **Kalkulator VSO** - dedykowane narzędzie dla pracowników
- **Platforma DAREMON.NL** - analiza polityki lokalnej z filtrowaniem i wyszukiwaniem
- **Dynamiczne motywy** - zmienne motywy kolorystyczne (Arburg, Rave) z animacjami
- **Tryb pełnoekranowy** (TV mode)

---

## 🛠 Wykryty Stos Technologiczny

### Języki Programowania
- **JavaScript (ES Modules)** - główny język projektu (50+ plików, ~8100 linii kodu)
- **HTML5** - semantyczna struktura z ARIA accessibility
- **CSS3** - nowoczesny styling z CSS Variables, Grid, Flexbox, animacjami (3500+ linii)
- **Python** - skrypty pomocnicze (normalizacja nazw plików)

### Build Tools & Package Managers
- **Vite 6.3.5** - ultraszybki build tool i dev server z HMR
- **pnpm 10.10.0** - wydajny package manager
- **ES Modules** - natywne moduły JavaScript (type: "module")

### Biblioteki i Frameworks
- **Three.js 0.170.0** - renderowanie 3D i wizualizacje audio
- **GSAP 3.12.2** - profesjonalna biblioteka animacji (Draggable, MotionPath)

### Testing Framework
- **Vitest 1.6.0** - nowoczesny framework testowy
- **jsdom 27.1.0** - symulacja DOM dla testów
- **23 pliki testowe** - kompleksowe pokrycie testami

### Web APIs & Technologie
- **Web Audio API** - zaawansowane przetwarzanie dźwięku w czasie rzeczywistym
- **Canvas API** - renderowanie wizualizacji 2D
- **WebGL** - renderowanie 3D poprzez Three.js
- **Service Workers** - offline functionality i cache management
- **IndexedDB** - strukturalne przechowywanie danych (ratings, messages, surveys)
- **LocalStorage** - przechowywanie ustawień użytkownika
- **Fetch API** - asynchroniczne ładowanie zasobów
- **Intersection Observer API** - optymalizacja renderowania i lazy loading
- **MediaSession API** - integracja z systemowymi kontrolkami multimedialnymi

### Serwer & Deployment
- **Apache** - konfiguracja w `.htaccess`:
  - Security headers (CSP, X-Frame-Options, HSTS)
  - Caching strategies (HTML: no-cache, assets: 1 rok)
  - Gzip/Brotli compression
  - Hotlink protection dla domeny daremon.nl

### Statystyki Projektu
| Metryka | Wartość |
|---------|---------|
| **Linie kodu JavaScript** | ~8100+ |
| **Pliki JavaScript** | 50+ modułów |
| **Pliki testowe** | 23 suity testowe |
| **Języki interfejsu** | 4 (PL, NL, EN, CS) |
| **Utwory w playliście** | ~500 (180KB JSON) |
| **Pliki dokumentacji** | 15+ plików Markdown |

---

## 🚀 Uruchomienie Lokalne (Quick Start)

### Wymagania Wstępne
- **Node.js** >= 18.0.0
- **pnpm** >= 10.0.0 (lub npm/yarn jako alternatywa)
- **Przeglądarka** z obsługą Web Audio API, Canvas API i ES6+ (Chrome, Firefox, Edge, Safari)

### Kroki Instalacji

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/RudyKotJeKoc/Daremon_NAS.git
cd Daremon_NAS

# 2. Zainstaluj zależności
pnpm install

# 3. Uruchom serwer deweloperski
pnpm dev

# 4. Otwórz w przeglądarce
# http://localhost:5173
```

### Build Produkcyjny

```bash
# Zbuduj aplikację dla produkcji
pnpm build

# Wynik będzie w katalogu dist/
```

### Dostępne Skrypty

```bash
# Development server z hot reload
pnpm dev

# Production build
pnpm build

# Uruchom testy
pnpm test

# Generuj manifest mediów dla pokazu slajdów
pnpm run generate:media

# Linting (placeholder)
pnpm lint
```

### Wykryte Zależności

#### Dependencies (package.json)
```json
{
  "three": "^0.170.0"
}
```

#### DevDependencies (package.json)
```json
{
  "jsdom": "^27.1.0",
  "vite": "^6.3.5",
  "vitest": "^1.6.0"
}
```

### Pierwsze Uruchomienie

1. Kliknij **"Uruchom Radio"** na ekranie powitalnym
2. Aplikacja załaduje playlistę i rozpocznie odtwarzanie
3. Dostosuj głośność i ciesz się muzyką!
4. Przełącz wizualizator między 2D/3D
5. Oceń utwory, dodaj komentarze i weź udział w ankietach

---

## 📁 Struktura Projektu

### Przegląd Najważniejszych Katalogów

```
Daremon_NAS/
├── 📄 index.html              # Główna strona aplikacji (744 linie)
├── 📄 app.js                  # Główna logika aplikacji (2097 linii)
├── 📄 config.js               # Konfiguracja globalna (strategie, endpointy)
├── 📄 state.js                # Zarządzanie stanem aplikacji
├── 📄 playlist.json           # Konfiguracja playlisty (180KB, ~500 utworów)
├── 📄 manifest.json           # PWA manifest
├── 📄 sw.js                   # Service Worker v11 (offline support)
├── 📄 vite.config.js          # Konfiguracja Vite (Multi-Page App)
│
├── 📂 locales/                # Tłumaczenia i18n (4 języki)
│   ├── pl.json               # Polski
│   ├── nl.json               # Niderlandzki
│   ├── en.json               # Angielski
│   └── cs.json               # Czeski
│
├── 📂 visualizer/             # Wizualizacje audio 3D
│   ├── Visualizer3D.js       # Wizualizator 3D z Three.js
│   ├── AudioVisualizerSwitch.js  # Przełącznik 2D/3D
│   └── README.md             # Dokumentacja techniczna
│
├── 📂 tests/                  # Testy jednostkowe (23 pliki)
│   ├── config.test.js
│   ├── crossfade.test.js
│   ├── listener-count.test.js
│   ├── media-availability.test.js
│   ├── playlist-service.test.js
│   ├── poll-system.test.js
│   ├── visualizer-3d.test.js
│   └── ... (17 więcej)
│
├── 📂 scripts/                # Skrypty pomocnicze
│   └── generate-media-manifest.js
│
├── 📂 docs/                   # Dokumentacja techniczna
│   ├── API_DOCUMENTATION.md
│   ├── BACKEND_INTEGRATION.md
│   ├── PERFORMANCE.md
│   ├── SECURITY.md
│   └── WEBSITE_IMPROVEMENTS.md
│
├── 📂 daremon/                # Platforma analiz DAREMON.NL
│   ├── index.html
│   ├── analizy.html
│   └── styles.css
│
├── 📂 audio/                  # Pliki audio (kategorie)
│   ├── projekty/
│   ├── umiejetnosci/
│   ├── wiedza/
│   └── inne/
│
├── 📂 music/                  # Katalog muzyki (MP3)
├── 📂 video/                  # Pliki wideo
├── 📂 images/                 # Obrazy dla pokazu slajdów
└── 📂 icons/                  # Ikony PWA (SVG)
```

### Kluczowe Moduły JavaScript

| Plik | Przeznaczenie | Linie |
|------|---------------|-------|
| `app.js` | Główna logika aplikacji | 2097 |
| `audio-player.js` | Odtwarzacz audio/video | - |
| `playlist-service.js` | Zarządzanie playlistą | 159 |
| `music-scanner.js` | Automatyczne skanowanie muzyki | - |
| `media-availability.js` | Sprawdzanie dostępności mediów | - |
| `track-metadata.js` | Metadane utworów | - |
| `listener-count.js` | Licznik słuchaczy (symulacja) | - |
| `poll-system.js` | System ankiet społecznościowych | - |
| `strategic-polls.js` | Ankiety strategiczne | - |
| `survey.js` | Ogólny system ankiet | - |
| `employee-survey.js` | Ankieta pracownicza | - |
| `granulate-survey.js` | Ankieta Granulate | - |
| `weather-widget.js` | Widget pogodowy | - |
| `countdown-timers.js` | Timery odliczające | - |
| `language-switcher.js` | Przełącznik języków | - |
| `offline-queue.js` | Kolejka offline | - |

### Dodatkowe Strony HTML

| Plik | Opis |
|------|------|
| `index.html` | Główna aplikacja radiowa |
| `polls.html` | Dedykowana strona ankiet społecznościowych |
| `granulate-survey.html` | Ankieta systemu transportu granulatu |
| `vso-calculator.html` | Kalkulator VSO dla pracowników |
| `audio-example.html` | Przykładowa strona odtwarzacza audio |
| `daremon/index.html` | Platforma analiz DAREMON.NL |
| `daremon/analizy.html` | Strona z analizami |

---

## 🔌 Przegląd API

Aplikacja jest zaprojektowana jako **frontend-only** z opcjonalną integracją backendu. Poniżej wykryte endpointy API dostępne dla integracji.

### Base URL
```
https://api.daremon.nl/api/v1
```

### Konfiguracja API (config.js)

```javascript
const DEFAULT_CONFIG = {
  MUSIC_TRACKS_ENDPOINT: null,       // GET - Lista utworów (opcjonalne)
  LISTENER_COUNT_ENDPOINT: null,     // GET - Licznik słuchaczy (opcjonalne)
  LISTENER_COUNT_WS: null,           // WebSocket - Real-time licznik (opcjonalne)
  // ... inne ustawienia
};
```

### API Endpoints

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| `GET` | `/health` | Health check - sprawdzenie dostępności API |
| `GET` | `/csrf-token` | Pobranie tokenu CSRF dla bezpiecznych formularzy |
| `POST` | `/surveys/granulate` | Wysłanie ankiety systemu transportu granulatu |
| `POST` | `/surveys/employee` | Wysłanie ankiety pracowniczej |
| `GET` | `/api/music/tracks` | Pobranie listy utworów (opcjonalne) |
| `GET` | `/api/listener-count` | Pobranie liczby słuchaczy (opcjonalne) |
| `WebSocket` | `/ws/listener-count` | Real-time aktualizacja licznika słuchaczy |

### 1. Health Check

**Endpoint:** `GET /health`

**Opis:** Sprawdzenie czy API jest dostępne

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-01-14T12:00:00Z"
}
```

### 2. Get CSRF Token

**Endpoint:** `GET /csrf-token`

**Opis:** Pobranie tokenu CSRF dla bezpiecznych formularzy

**Headers:**
```
Cookie: sessionId=<session-cookie>
```

**Response:**
```json
{
  "token": "abc123xyz789",
  "expiresAt": "2025-01-14T13:00:00Z"
}
```

### 3. Submit Granulate Survey

**Endpoint:** `POST /surveys/granulate`

**Opis:** Wysłanie ankiety systemu transportu granulatu

**Headers:**
```
Content-Type: application/json
X-CSRF-Token: <csrf-token>
X-Client-Version: 1.0.0
```

**Request Body:**
```json
{
  "timestamp": "2025-01-14T12:00:00Z",
  "csrfToken": "abc123xyz789",
  "experience": "6-12m",
  "factory": "boxtel",
  "role": "operator",
  "interruptionFrequency": "several-week",
  "systemProblems": ["blockage", "sensor-problems"],
  "sensorsFunction": "mostly-yes",
  "supplyContinuity": "good",
  "trainingReceived": "yes-short",
  "improvements": "Better sensor calibration needed",
  "stressLevel": "sometimes"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Survey submitted successfully",
  "data": {
    "id": "survey-12345",
    "submittedAt": "2025-01-14T12:00:05Z"
  }
}
```

### 4. Submit Employee Survey

**Endpoint:** `POST /surveys/employee`

**Opis:** Wysłanie ankiety pracowniczej

**Request Body:**
```json
{
  "timestamp": "2025-01-14T12:00:00Z",
  "csrfToken": "abc123xyz789",
  "name": "Jan Kowalski",
  "teamContinuation": "yes",
  "daremonFeatures": ["radio", "visualizer", "surveys"],
  "newFeatures": ["playlist-editor", "podcast"],
  "helpAreas": ["testing", "ideas"],
  "additionalIdeas": "Integracja ze Spotify"
}
```

### 5. Get Music Tracks (Optional)

**Endpoint:** `GET /api/music/tracks`

**Opis:** Pobranie listy utworów z serwera (opcjonalne, fallback na lokalny playlist.json)

**Response:**
```json
{
  "tracks": [
    {
      "id": "track-1",
      "title": "Tytuł utworu",
      "artist": "Wykonawca",
      "src": "/music/file.mp3",
      "cover": "url-do-okładki",
      "weight": 3,
      "type": "song"
    }
  ]
}
```

### 6. Get Listener Count (Optional)

**Endpoint:** `GET /api/listener-count`

**Opis:** Pobranie aktualnej liczby słuchaczy

**Response:**
```json
{
  "count": 42,
  "timestamp": "2025-01-14T12:00:00Z"
}
```

### 7. WebSocket: Listener Count (Optional)

**Endpoint:** `WebSocket /ws/listener-count`

**Opis:** Real-time aktualizacja licznika słuchaczy

**Message format:**
```json
{
  "type": "listener_count",
  "count": 42,
  "timestamp": "2025-01-14T12:00:00Z"
}
```

### Offline-First Approach

Aplikacja działa **w pełni offline** z wykorzystaniem:
- **IndexedDB** - przechowywanie ocen, komentarzy, wyników ankiet
- **LocalStorage** - ustawienia użytkownika, preferencje
- **Service Worker** - cache zasobów, offline fallback
- **Offline Queue** - kolejkowanie zapytań podczas braku internetu

Wszystkie zapytania API są **opcjonalne** - aplikacja działa bez backendu, używając lokalnych danych.

---

## ⚙️ Konfiguracja

### config.js - Konfiguracja Globalna

```javascript
const DEFAULT_CONFIG = {
  PROJECT_NAME: 'DAREMON Radio ETS',
  COMPANY_NAME: 'Firma',
  STORAGE_PREFIX: 'daremon',

  // Endpointy API (opcjonalne)
  MUSIC_TRACKS_ENDPOINT: null,
  LISTENER_COUNT_ENDPOINT: null,
  LISTENER_COUNT_WS: null,

  // Strategia sprawdzania dostępności mediów
  // Opcje: 'lazy', 'skip', 'parallel', 'sequential'
  MEDIA_AVAILABILITY_STRATEGY: 'lazy',
  MEDIA_AVAILABILITY_CHUNK_SIZE: 50,
};
```

### Strategie Sprawdzania Dostępności Mediów

| Strategia | Opis | Wydajność | Zalecana dla |
|-----------|------|-----------|--------------|
| **`lazy`** | Sprawdzaj tylko przy odtwarzaniu | ~0s | Pliki lokalne, duże playlisty (domyślne) |
| **`skip`** | Pomiń pliki lokalne, sprawdzaj tylko zdalne | ~4s | Mieszanka lokalnych i zdalnych |
| **`parallel`** | Równoległe sprawdzanie w chunkach | ~20s | Playlisty ze zdalnych źródeł |
| **`sequential`** | Jeden po drugim (legacy) | ~1000s | Nie zalecane |

### playlist.json - Konfiguracja Playlisty

```json
{
  "config": {
    "quietHours": {
      "start": "22:00",
      "end": "06:00"
    },
    "jingle": {
      "everySongs": 4,
      "orMinutes": 15,
      "enabled": true
    },
    "recentMemory": 15,
    "crossfadeSeconds": 2.0
  },
  "tracks": [...]
}
```

### Struktura Utworu

```json
{
  "id": "unique-id",
  "title": "Tytuł utworu",
  "artist": "Wykonawca",
  "src": "./music/file.mp3",
  "cover": "url-do-okładki",
  "tags": ["tag1", "tag2"],
  "weight": 3,
  "type": "song|jingle",
  "golden": false
}
```

### Service Worker - Cache Strategy

```javascript
// sw.js
const CACHE_NAME = 'daremon-radio-v11';

// Cache-first dla app shell
// Stale-while-revalidate dla playlisty i tłumaczeń
// Network-first dla plików audio
```

---

## 🧪 Testowanie

### Uruchamianie Testów

```bash
# Uruchom wszystkie testy
pnpm test

# Testy w trybie watch
pnpm test --watch

# Coverage (raport pokrycia)
pnpm test --coverage
```

### Pokrycie Testami (23 suity testowe)

#### Podstawowa funkcjonalność
- `config.test.js` - Walidacja konfiguracji
- `state.test.js` - Zarządzanie stanem
- `localstorage.test.js` - Przechowywanie lokalne
- `locales-regression.test.js` - Testy tłumaczeń

#### Odtwarzacz audio
- `crossfade.test.js` - Płynne przejścia
- `listener-count.test.js` - Licznik słuchaczy
- `listener-count-display.test.js` - Wyświetlanie licznika

#### Playlista i media
- `playlist-service.test.js` - Serwis playlisty
- `playlist-integration.test.js` - Integracja playlisty
- `music-scanner.test.js` - Skanowanie muzyki
- `track-metadata.test.js` - Metadane utworów
- `media-availability.test.js` - Dostępność plików
- `media-files-loading.test.js` - Ładowanie mediów
- `url-encoding.test.js` - Kodowanie URL

#### Wizualizacje
- `visualizer-3d.test.js` - Wizualizator 3D
- `visualizer-regression.test.js` - Regresja wizualizatora
- `slideshow.test.js` - Pokaz slajdów

#### UI i interakcje
- `ui-utils.test.js` - Komponenty UI
- `poll-system.test.js` - System ankiet
- `polls.e2e.test.js` - End-to-end ankiety
- `strategic-polls.test.js` - Ankiety strategiczne
- `now-playing-layout.test.js` - Layout odtwarzacza

---

## 📚 Dokumentacja

Projekt zawiera obszerną dokumentację techniczną w osobnych plikach:

### Dokumentacja Główna
- **[README.md](README.md)** - Ten plik (przegląd projektu)
- **[IMPLEMENTATION-REPORT.md](IMPLEMENTATION-REPORT.md)** - Raport wdrożenia funkcji
- **[PERFORMANCE_AUDIT.md](PERFORMANCE_AUDIT.md)** - Audyt wydajności

### Dokumentacja Funkcji
- **[MEDIA-AVAILABILITY-OPTIMIZATION.md](MEDIA-AVAILABILITY-OPTIMIZATION.md)** - Optymalizacja sprawdzania dostępności plików
- **[MEDIA_INSTRUKCJA.md](MEDIA_INSTRUKCJA.md)** - Instrukcja dodawania obrazów i filmów
- **[AUDIO_PLAYER_INSTRUKCJA.md](AUDIO_PLAYER_INSTRUKCJA.md)** - Instrukcja odtwarzacza
- **[QUICK_START_AUDIO.md](QUICK_START_AUDIO.md)** - Szybki start z audio

### Dokumentacja Wizualizatora
- **[VISUALIZER-GUIDE.md](VISUALIZER-GUIDE.md)** - Quick Start Guide dla wizualizatora 3D
- **[visualizer/README.md](visualizer/README.md)** - Szczegółowa dokumentacja techniczna

### Dokumentacja Licznika Słuchaczy
- **[LISTENER-COUNT-FEATURE.md](LISTENER-COUNT-FEATURE.md)** - Dokumentacja funkcji licznika
- **[RAPORT-LICZNIKA-SLUCHACZY.md](RAPORT-LICZNIKA-SLUCHACZY.md)** - Raport weryfikacji

### Dokumentacja API i Backend
- **[docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - Pełna dokumentacja API
- **[docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)** - Integracja z backendem
- **[docs/SECURITY.md](docs/SECURITY.md)** - Bezpieczeństwo
- **[docs/PERFORMANCE.md](docs/PERFORMANCE.md)** - Wydajność
- **[docs/WEBSITE_IMPROVEMENTS.md](docs/WEBSITE_IMPROVEMENTS.md)** - Ulepszenia

### Dokumentacja Platformy
- **[daremon/README.md](daremon/README.md)** - Platforma DAREMON.NL

---

## ⌨️ Skróty Klawiszowe

| Klawisz | Akcja |
|---------|-------|
| `Spacja` | Play/Pause |
| `N` | Następny utwór |
| `L` | Like (polub utwór) |
| `↑` | Zwiększ głośność |
| `↓` | Zmniejsz głośność |

---

## 🤝 Wkład w Projekt

Wkład w projekt jest mile widziany! Aby przyczynić się do rozwoju:

1. Fork repozytorium
2. Utwórz branch dla swojej funkcji (`git checkout -b feature/amazing-feature`)
3. Commit zmian (`git commit -m 'Add amazing feature'`)
4. Push do brancha (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

### Wytyczne
- Zachowaj spójny styl kodu (ES6+, moduły)
- Dodaj testy dla nowych funkcji
- Aktualizuj dokumentację
- Zwiększ wersję Service Worker po zmianach w cache

---

## 📄 Licencja

Projekt na licencji **ISC** - szczegóły w pliku LICENSE

---

## 👥 Autorzy

- **Zespół DAREMON Solutions** - rozwój i utrzymanie
- **Projekt wewnętrzny** - stworzony dla zespołu DAREMON ETS

---

## 🎯 Zastosowania

Aplikacja może być używana jako:
- Firmowe radio internetowe
- Odtwarzacz muzyki z zaawansowanymi funkcjami społecznościowymi
- Szablon dla podobnych projektów webowych
- Materiał edukacyjny dotyczący PWA, Web Audio API i nowoczesnych technologii webowych
- Demo technologiczne - pokazanie umiejętności zespołu

---

## 🙏 Podziękowania

- **Three.js** - za potężną bibliotekę renderingu 3D
- **GSAP** - za wspaniałą bibliotekę animacji
- **Vite** - za szybki i efektywny build tool
- **Vitest** - za nowoczesny framework testowy
- **Społeczność Open Source** - za inspirację i narzędzia
- **Zespół DAREMON** - za wkład w rozwój projektu

---

## 📞 Kontakt

**DAREMON Radio ETS** - Projekt demonstracyjny i wewnętrzny dla zespołu DAREMON

**Repozytorium:** [https://github.com/RudyKotJeKoc/Daremon_NAS](https://github.com/RudyKotJeKoc/Daremon_NAS)

---

**Nota**: DAREMON Radio ETS to osobisty projekt demonstracyjny i eksperymentalny. Funkcje komunikacji (wiadomości DJ, ankiety) działają lokalnie.
