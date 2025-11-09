# 🎵 Instrukcja: Dodawanie Audio/Video do Strony

Kompletna instrukcja dodawania odtwarzaczy audio/video do różnych sekcji strony Daremon.

## 📋 Spis treści

1. [Struktura plików](#struktura-plików)
2. [Gdzie dodać pliki .mp3](#gdzie-dodać-pliki-mp3)
3. [Jak dodać player do strony](#jak-dodać-player-do-strony)
4. [Konfiguracja playerów](#konfiguracja-playerów)
5. [Przykłady użycia](#przykłady-użycia)
6. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

---

## 📁 Struktura plików

Po implementacji, projekt ma następującą strukturę:

```
Daremon_NAS/
├── audio/                          # Folder główny dla plików audio
│   ├── wiedza/                     # Audio dla sekcji "Wiedza"
│   ├── umiejetnosci/              # Audio dla sekcji "Umiejętności"
│   ├── projekty/                   # Audio dla sekcji "Projekty"
│   ├── inne/                       # Inne pliki audio
│   └── README.md                   # Dokumentacja struktury
├── audio-player.js                 # Komponent JavaScript playera
├── audio-player-styles.css         # Style dla playera
├── audio-example.html              # Przykładowa strona demonstracyjna
└── AUDIO_PLAYER_INSTRUKCJA.md      # Ta instrukcja
```

---

## 🎵 Gdzie dodać pliki .mp3

### Nazewnictwo plików

Używaj opisowych nazw w formacie:

```
kategoria-numer-opis.mp3
```

**Przykłady:**
- `wiedza-01-wprowadzenie.mp3`
- `umiejetnosci-02-javascript.mp3`
- `projekty-03-daremon-opis.mp3`

### Lokalizacja plików

#### 1. Sekcja "Wiedza"
```
audio/wiedza/
├── wiedza-01-wprowadzenie.mp3
├── wiedza-02-podstawy.mp3
└── wiedza-03-zaawansowane.mp3
```

#### 2. Sekcja "Umiejętności"
```
audio/umiejetnosci/
├── umiejetnosci-01-tutorial.mp3
├── umiejetnosci-02-praktyka.mp3
└── umiejetnosci-03-zaawansowane.mp3
```

#### 3. Sekcja "Projekty"
```
audio/projekty/
├── projekty-01-radio-opis.mp3
├── projekty-02-analiza.mp3
└── projekty-03-prezentacja.mp3
```

#### 4. Inne materiały
```
audio/inne/
├── podcast-01.mp3
├── wywiad-02.mp3
└── materialy-dodatkowe.mp3
```

---

## 🚀 Jak dodać player do strony

### Krok 1: Dodaj pliki do HTML

W sekcji `<head>` dodaj style:

```html
<link rel="stylesheet" href="audio-player-styles.css">
```

Przed końcem `</body>` dodaj skrypt:

```html
<script type="module" src="audio-player.js"></script>
```

### Krok 2: Dodaj container dla playera

W miejscu gdzie chcesz wyświetlić player, dodaj:

```html
<div id="audio-player-wiedza"></div>
```

**Ważne:** ID musi być unikalne dla każdego playera!

### Krok 3: Inicjalizuj player w JavaScript

```html
<script type="module">
    import SectionAudioPlayer from './audio-player.js';

    // Konfiguracja
    const config = {
        sectionTitle: '📚 Wiedza',
        description: 'Materiały edukacyjne',
        tracks: [
            {
                title: 'Wprowadzenie',
                src: 'audio/wiedza/wprowadzenie.mp3',
                duration: '5:30'
            }
        ]
    };

    // Inicjalizacja
    document.addEventListener('DOMContentLoaded', () => {
        new SectionAudioPlayer('audio-player-wiedza', config);
    });
</script>
```

---

## ⚙️ Konfiguracja playerów

### Podstawowa konfiguracja

```javascript
const config = {
    sectionTitle: 'Tytuł sekcji',        // Wymagane
    description: 'Opis sekcji',           // Opcjonalne
    coverImage: '/path/to/image.jpg',     // Opcjonalne
    tracks: [                             // Wymagane - minimum 1 utwór
        {
            title: 'Tytuł utworu',        // Wymagane
            src: 'path/to/audio.mp3',     // Wymagane
            duration: '5:30',             // Opcjonalne
            coverImage: '/cover.jpg'      // Opcjonalne (nadpisuje główny cover)
        }
    ]
};
```

### Pełna konfiguracja z wieloma utworami

```javascript
const wiedzaConfig = {
    sectionTitle: '📚 Wiedza',
    description: 'Kompleksowe materiały edukacyjne i teoretyczne',
    coverImage: '/images/cover-wiedza.jpg',
    tracks: [
        {
            title: 'Wprowadzenie do programowania',
            src: 'audio/wiedza/wiedza-01-wprowadzenie.mp3',
            duration: '5:30'
        },
        {
            title: 'Podstawy JavaScript',
            src: 'audio/wiedza/wiedza-02-javascript.mp3',
            duration: '8:45'
        },
        {
            title: 'HTML i CSS',
            src: 'audio/wiedza/wiedza-03-html-css.mp3',
            duration: '6:20'
        }
    ]
};
```

---

## 💡 Przykłady użycia

### Przykład 1: Dodanie playera do istniejącej strony

**W pliku `index.html`:**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <!-- Twoje istniejące tagi head -->
    <link rel="stylesheet" href="audio-player-styles.css">
</head>
<body>
    <!-- Twoja istniejąca treść -->

    <!-- Nowa sekcja z audio -->
    <section class="content-box">
        <h2>📚 Wiedza</h2>
        <p>Materiały edukacyjne do przesłuchania</p>
        <div id="audio-player-wiedza"></div>
    </section>

    <!-- Twoje istniejące skrypty -->
    <script type="module">
        import SectionAudioPlayer from './audio-player.js';

        const wiedzaConfig = {
            sectionTitle: '📚 Wiedza',
            description: 'Materiały edukacyjne',
            tracks: [
                {
                    title: 'Wprowadzenie',
                    src: 'audio/wiedza/wprowadzenie.mp3',
                    duration: '5:30'
                }
            ]
        };

        document.addEventListener('DOMContentLoaded', () => {
            new SectionAudioPlayer('audio-player-wiedza', wiedzaConfig);
        });
    </script>
</body>
</html>
```

### Przykład 2: Wiele playerów na jednej stronie

```html
<!-- Container 1 -->
<div id="audio-player-wiedza"></div>

<!-- Container 2 -->
<div id="audio-player-umiejetnosci"></div>

<!-- Container 3 -->
<div id="audio-player-projekty"></div>

<script type="module">
    import SectionAudioPlayer from './audio-player.js';

    // Konfiguracje dla każdej sekcji
    const wiedzaConfig = { /* ... */ };
    const umiejetnosciConfig = { /* ... */ };
    const projektyConfig = { /* ... */ };

    document.addEventListener('DOMContentLoaded', () => {
        new SectionAudioPlayer('audio-player-wiedza', wiedzaConfig);
        new SectionAudioPlayer('audio-player-umiejetnosci', umiejetnosciConfig);
        new SectionAudioPlayer('audio-player-projekty', projektyConfig);
    });
</script>
```

### Przykład 3: Integracja z Daremon/index.html

Dodaj sekcję przed lub po istniejących sekcjach:

```html
<!-- Po sekcji "About" -->
<section class="content-box" style="margin-top: 3rem;">
    <h2>🎓 Materiały Edukacyjne</h2>
    <div id="audio-player-edukacja"></div>
</section>
```

---

## 🎨 Dostosowanie wyglądu

### Zmiana kolorów

W pliku `audio-player-styles.css` znajdź i zmień:

```css
/* Główny kolor akcentu */
.audio-section-title {
    color: #00d9ff;  /* <- Zmień ten kolor */
}

/* Gradient przycisków */
.audio-btn {
    background: linear-gradient(135deg, #00d9ff 0%, #0066ff 100%);
    /* ^ Zmień te kolory */
}
```

### Zmiana tła playera

```css
.section-audio-player {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    /* ^ Zmień gradient tła */
}
```

---

## 🔧 Rozwiązywanie problemów

### Problem: Player się nie wyświetla

**Rozwiązanie:**
1. Sprawdź czy dodałeś link do CSS w `<head>`
2. Sprawdź czy ID kontenera jest poprawne
3. Otwórz konsolę przeglądarki (F12) i sprawdź błędy

### Problem: Audio się nie odtwarza

**Rozwiązanie:**
1. Sprawdź czy ścieżka do pliku .mp3 jest poprawna
2. Sprawdź czy plik .mp3 istnieje w folderze
3. Sprawdź czy przeglądarka obsługuje format audio

**Testowanie ścieżki:**
```javascript
// Dodaj w konsoli przeglądarki:
fetch('audio/wiedza/plik.mp3')
    .then(r => console.log('Plik istnieje:', r.ok))
    .catch(e => console.log('Błąd:', e));
```

### Problem: Player działa ale bez stylu

**Rozwiązanie:**
1. Sprawdź czy ścieżka do `audio-player-styles.css` jest poprawna
2. Sprawdź czy plik CSS został załadowany (zakładka Network w narzędziach deweloperskich)

### Problem: Nie działa na urządzeniach mobilnych

**Rozwiązanie:**
1. Dodaj atrybut `playsinline` do elementu audio
2. Sprawdź czy format audio jest obsługiwany (MP3 jest najbardziej uniwersalny)

---

## 📱 Responsywność

Player jest w pełni responsywny i dostosowuje się do:
- Desktop (>768px)
- Tablet (768px - 480px)
- Mobile (<480px)

---

## 🎯 Szybki Start

### 1. Dodaj plik .mp3

```bash
# Umieść plik w odpowiednim folderze
cp mojplik.mp3 audio/wiedza/wiedza-01-intro.mp3
```

### 2. Edytuj stronę HTML

```html
<div id="moj-player"></div>

<script type="module">
    import SectionAudioPlayer from './audio-player.js';

    new SectionAudioPlayer('moj-player', {
        sectionTitle: 'Moja Sekcja',
        tracks: [{
            title: 'Mój Utwór',
            src: 'audio/wiedza/wiedza-01-intro.mp3'
        }]
    });
</script>
```

### 3. Otwórz w przeglądarce!

---

## 📞 Wsparcie

Jeśli masz pytania lub problemy:
1. Sprawdź sekcję "Rozwiązywanie problemów" powyżej
2. Zobacz `audio-example.html` dla pełnego przykładu
3. Sprawdź konsolę przeglądarki dla szczegółów błędów

---

## ✅ Checklist przed wdrożeniem

- [ ] Pliki .mp3 są w odpowiednich folderach
- [ ] CSS został dodany do `<head>`
- [ ] JavaScript został zaimportowany
- [ ] Kontenery mają unikalne ID
- [ ] Ścieżki do plików są poprawne
- [ ] Player działa na różnych przeglądarkach
- [ ] Player działa na urządzeniach mobilnych

---

**Autor:** Claude (Anthropic)
**Data:** 2025-11-09
**Wersja:** 1.0
