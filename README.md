# 📻 DAREMON Radio ETS

> Nowoczesna aplikacja webowa Progressive Web App (PWA) - oficjalne firmowe radio internetowe DAREMON ETS z bogatymi funkcjami interaktywnymi

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-enabled-brightgreen.svg)](manifest.json)
[![Service Worker](https://img.shields.io/badge/Service%20Worker-v9-orange.svg)](sw.js)

## 📋 Spis treści

- [O projekcie](#-o-projekcie)
- [Funkcje](#-funkcje)
- [Stack technologiczny](#-stack-technologiczny)
- [Instalacja](#-instalacja)
- [Struktura projektu](#-struktura-projektu)
- [Konfiguracja](#-konfiguracja)
- [Użytkowanie](#-użytkowanie)
- [Rozwój](#-rozwój)
- [Skróty klawiszowe](#-skróty-klawiszowe)
- [Wkład w projekt](#-wkład-w-projekt)

## 🎯 O projekcie

**DAREMON Radio ETS** to w pełni funkcjonalna aplikacja webowa symulująca profesjonalne radio firmowe. Projekt łączy nowoczesne technologie webowe z intuicyjnym interfejsem użytkownika, tworząc wciągające doświadczenie muzyczne dostępne zarówno online, jak i offline dzięki technologii PWA.

### Kluczowe cechy:
- 🎵 **Inteligentny odtwarzacz audio** z płynnym crossfade między utworami
- 🌐 **Wielojęzyczność** - obsługa języka polskiego i niderlandzkiego
- 📴 **Tryb offline** - pełna funkcjonalność bez połączenia z internetem
- 🎨 **Dynamiczne motywy** - zmienne motywy kolorystyczne (Arburg, Rave)
- 📊 **Wizualizacja audio** - efekty wizualne w czasie rzeczywistym
- ⭐ **System ocen** - możliwość oceniania i komentowania utworów
- 💬 **Czat DJ** - interaktywna komunikacja z automatycznymi odpowiedziami
- 🗳️ **Ankiety słuchaczy** - interaktywne głosowania reagujące na wydarzenia w radiu

## ✨ Funkcje

### Odtwarzacz audio
- Automatyczne odtwarzanie playlisty z konfigurowalnymi utworami
- Płynne przejścia między utworami (crossfade 2 sekundy)
- Inteligentne zarządzanie historią odtwarzania (15 ostatnio odtworzonych)
- Wsparcie dla różnych typów utworów (piosenki, jingle)
- System wag określających częstotliwość odtwarzania
- Automatyczne wstawianie jingle co 4 utwory lub co 15 minut
- Tryb cichych godzin (22:00 - 06:00)

### Interfejs użytkownika
- Responsywny design działający na wszystkich urządzeniach
- Sticky player - odtwarzacz zawsze widoczny podczas przewijania
- Progress bar z możliwością przeskakiwania w utworze
- Kontrola głośności z efektami wizualnymi
- Tryb pełnoekranowy (TV mode)
- Autoplay overlay z animowanym powitaniem

### Funkcje społecznościowe
- **Złote Płyty** - lista najcenniejszych utworów w playliście
- **Najwyżej ocenione** - rankingi utworów na podstawie ocen użytkowników
- **Ostatnio grane** - historia 10 ostatnio odtworzonych utworów
- **Wiadomości DJ** - możliwość wysyłania wiadomości z AI odpowiedziami
- **Ankiety słuchaczy** - dynamiczne głosowania z różnymi typami pytań

### Wizualizacje
- Canvas-based audio visualizer w czasie rzeczywistym
- Animowane efekty świetlne (glow, burst, rays)
- Dynamiczne logo z efektami GSAP
- Pulsujące animacje like i przycisków

### PWA Features
- Instalowalna jako aplikacja desktopowa/mobilna
- Service Worker z cache-first strategią
- Offline fallback dla zasobów
- Stale-while-revalidate dla playlisty i tłumaczeń
- Manifest skonfigurowany (wymaga dodania ikon)

**Uwaga**: Aby w pełni wykorzystać funkcje PWA, należy dodać ikony aplikacji:
- `./icons/icon-192.png` (192x192)
- `./icons/icon-512.png` (512x512)  
- `./icons/favicon.svg`

Lub zaktualizować ścieżki w `manifest.json` i `sw.js` do istniejących ikon.

## 🛠 Stack technologiczny

### Frontend
- **HTML5** - semantyczna struktura z ARIA accessibility
- **CSS3** - nowoczesny styling z CSS Variables, Grid, Flexbox
- **JavaScript (ES6+)** - moduły, async/await, Web Audio API

### Biblioteki i narzędzia
- **GSAP 3.12.2** - zaawansowane animacje (Draggable, MotionPath)
- **Vite 6.3.5** - szybki build tool i dev server
- **Vitest 1.6.0** - framework testowy
- **pnpm 10.10.0** - wydajny package manager

### API i technologie
- **Web Audio API** - przetwarzanie i analiza dźwięku
- **Canvas API** - wizualizacja audio
- **Service Workers** - offline functionality
- **IndexedDB** - lokalne przechowywanie danych (ratings, messages)
- **LocalStorage** - przechowywanie ustawień użytkownika
- **Fetch API** - asynchroniczne ładowanie zasobów

## 📦 Instalacja

### Wymagania wstępne
- Node.js >= 18.0.0
- pnpm >= 10.0.0 (lub npm/yarn)

### Kroki instalacji

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/RudyKotJeKoc/Daremon_NAS.git
cd Daremon_NAS
```

2. **Zainstaluj zależności**
```bash
pnpm install
```

3. **Uruchom serwer deweloperski**
```bash
pnpm dev
```

4. **Otwórz w przeglądarce**
```
http://localhost:5173
```

### Build produkcyjny

```bash
pnpm build
```

Zbudowane pliki znajdą się w katalogu `dist/`.

## 📁 Struktura projektu

```
Daremon_NAS/
├── index.html              # Główny plik HTML
├── app.js                  # Główna logika aplikacji
├── state.js                # Zarządzanie stanem aplikacji
├── media-utils.js          # Utilsy dla mediów
├── ui-utils.js             # UI utilities (track list items)
├── styles.css              # Style CSS
├── sw.js                   # Service Worker (v9)
├── script.js               # Dodatkowe skrypty
├── manifest.json           # PWA manifest
├── playlist.json           # Konfiguracja playlisty
├── template_config.json    # Template configuration
│
├── locales/                # Tłumaczenia
│   ├── pl.json            # Polski
│   └── nl.json            # Niderlandzki
│
├── tests/                  # Testy jednostkowe
│   ├── state.test.js              # Testy stanu aplikacji
│   ├── crossfade.test.js          # Testy crossfade
│   ├── ui-utils.test.js           # Testy UI utilities
│   └── now-playing-layout.test.js # Testy layoutu
│
├── video/                  # Katalog wideo (zarezerwowany)
│
├── package.json            # Zależności projektu
└── pnpm-lock.yaml         # Lock file dla pnpm
```

## ⚙️ Konfiguracja

### playlist.json

Główny plik konfiguracyjny dla odtwarzacza:

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
    "recent": {
      "count": 10,
      "trackIds": []
    },
    "recentMemory": 15,
    "crossfadeSeconds": 2.0
  },
  "tracks": [...]
}
```

#### Parametry konfiguracji:
- **quietHours** - godziny, w których nie odtwarzane są jingle
- **jingle.everySongs** - częstotliwość jingle (co X utworów)
- **jingle.orMinutes** - alternatywna częstotliwość (co Y minut)
- **recentMemory** - liczba utworów zapamiętanych jako "ostatnio grane"
- **crossfadeSeconds** - czas płynnego przejścia między utworami

### Struktura utworu:

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

### Tłumaczenia (locales/)

Pliki JSON z tłumaczeniami wszystkich tekstów w aplikacji:
- `pl.json` - język polski
- `nl.json` - język niderlandzki

Automatyczne wykrywanie języka przeglądarki z fallback na niderlandzki.

## 🎮 Użytkowanie

### Pierwsze uruchomienie

1. Kliknij **"Uruchom Radio"** na ekranie powitalnym
2. Aplikacja załaduje playlistę i rozpocznie odtwarzanie
3. Dostosuj głośność i ciesz się muzyką!

### Podstawowe kontrolki

- **Play/Pause** - Uruchom lub zatrzymaj odtwarzanie
- **Next** - Przejdź do następnego utworu
- **Like** - Oznacz utwór jako ulubiony
- **Volume** - Dostosuj poziom głośności (0-100%)
- **Progress Bar** - Kliknij aby przeskoczyć do wybranego momentu

### Ocenianie utworów

1. Kliknij na gwiazdki (1-5) podczas odtwarzania
2. Opcjonalnie dodaj komentarz
3. Kliknij "Wyślij Recenzję"
4. Oceny są przechowywane lokalnie w IndexedDB

### Ankiety słuchaczy

1. Wybierz ankietę w panelu bocznym
2. Odpowiedz zgodnie z typem pytania (pojedynczy wybór, wielokrotne odpowiedzi, skala lub tekst)
3. Kliknij "Wyślij odpowiedź"
4. Wyniki aktualizują się natychmiast po oddaniu głosu

### Wiadomości DJ

1. Napisz wiadomość w polu tekstowym
2. Kliknij "Wyślij Wiadomość"
3. Otrzymasz automatyczną odpowiedź od DJ Bot
4. Wszystkie wiadomości są tylko lokalne (demonstracja)

## 🔧 Rozwój

### Dostępne skrypty

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Uruchom testy
pnpm test

# Linting (placeholder)
pnpm lint
```

### Struktura kodu

#### app.js - Główne moduły:

1. **State Management** - zarządzanie stanem aplikacji
2. **Audio Engine** - obsługa odtwarzania i crossfade
3. **Playlist Manager** - logika kolejkowania utworów
4. **UI Controllers** - kontrolery interfejsu użytkownika
5. **i18n System** - system wielojęzyczności
6. **Storage Manager** - IndexedDB i LocalStorage
7. **Visualizer** - canvas-based wizualizacja

#### Service Worker (sw.js):

- **Cache Strategy**: Cache-first dla app shell
- **Stale-while-revalidate**: dla playlisty i tłumaczeń
- **Network-first**: dla audio files
- **Version**: v9 (automatyczne czyszczenie starych cache)

### Dodawanie nowych utworów

1. Umieść pliki audio w lokalizacji dostępnej dla aplikacji (np. katalog `music/`)
2. Dodaj wpis w `playlist.json`:

```json
{
  "id": "utwor-xxx",
  "title": "Tytuł",
  "artist": "Wykonawca",
  "src": "./music/Utwor (xxx).mp3",
  "cover": "url",
  "tags": ["tag1", "tag2"],
  "weight": 3,
  "type": "song",
  "golden": false
}
```

3. Jeśli dodajesz nowe zasoby do cache, zwiększ wersję cache w `sw.js`
4. Przebuduj aplikację

### Dodawanie obrazów i filmów do pokazu slajdów

Aplikacja automatycznie wykrywa i używa lokalnych plików multimedialnych dla pokazu slajdów:

1. **Dodaj pliki obrazów** do katalogu `images/`:
   - Obsługiwane formaty: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`, `.avif`

2. **Dodaj pliki wideo** do katalogu `video/`:
   - Obsługiwane formaty: `.mp4`, `.webm`, `.ogg`, `.mov`

3. **Wygeneruj manifest mediów**:
```bash
npm run generate:media
```

4. **Przebuduj aplikację**:
```bash
npm run build
```

Aplikacja automatycznie użyje lokalnych plików. Jeśli żadne lokalne pliki nie zostaną znalezione, system przełączy się na zewnętrzne źródła mediów.

### Dodawanie nowych motywów

1. Edytuj `styles.css` i dodaj nowy motyw:

```css
[data-theme="new-theme"] {
    --primary-accent: #color1;
    --secondary-accent: #color2;
    --tertiary-accent: #color3;
}
```

2. Dodaj przycisk w `index.html`:

```html
<button id="theme-new" data-i18n-aria-label="themeNewLabel"></button>
```

3. Dodaj tłumaczenia w `locales/*.json`
4. Dodaj event listener w `app.js`

## ⌨️ Skróty klawiszowe

| Klawisz | Akcja |
|---------|-------|
| `Spacja` | Play/Pause |
| `N` | Następny utwór |
| `L` | Like (polub utwór) |
| `↑` | Zwiększ głośność |
| `↓` | Zmniejsz głośność |

## 🧪 Testowanie

Projekt wykorzystuje Vitest do testów jednostkowych:

```bash
# Uruchom wszystkie testy
pnpm test

# Testy w trybie watch
pnpm test --watch

# Coverage
pnpm test --coverage
```

Przykładowe testy:
- `tests/state.test.js` - testy zarządzania stanem
- `tests/crossfade.test.js` - testy funkcji crossfade
- `tests/ui-utils.test.js` - testy UI utilities
- `tests/now-playing-layout.test.js` - testy layoutu odtwarzacza

## 🤝 Wkład w projekt

Wkład w projekt jest mile widziany! Aby przyczynić się do rozwoju:

1. Fork repozytorium
2. Utwórz branch dla swojej funkcji (`git checkout -b feature/amazing-feature`)
3. Commit zmian (`git commit -m 'Add amazing feature'`)
4. Push do brancha (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

### Wytyczne:
- Zachowaj spójny styl kodu
- Dodaj testy dla nowych funkcji
- Aktualizuj dokumentację
- Zwiększ wersję Service Worker po zmianach w cache

## 📄 Licencja

ISC License - szczegóły w pliku LICENSE

## 👥 Autorzy

- Zespół DAREMON Solutions

## 🙏 Podziękowania

- **GSAP** - za wspaniałą bibliotekę animacji
- **Vite** - za szybki i efektywny build tool
- **Społeczność Open Source** - za inspirację i narzędzia

## 📞 Kontakt

Projekt DAREMON Radio ETS - Aplikacja demonstracyjna

---

**Uwaga**: To jest aplikacja demonstracyjna stworzona do celów edukacyjnych. Wszystkie funkcje komunikacji (wiadomości DJ, ankiety) działają tylko lokalnie i nie są wysyłane do rzeczywistego serwera.
