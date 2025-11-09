# 🚀 Quick Start: Audio Player

Szybki start do dodania audio playerów do strony w 3 krokach.

## Krok 1: Dodaj plik .mp3

```bash
# Umieść swój plik audio w odpowiednim folderze:
audio/wiedza/moj-plik.mp3
```

## Krok 2: Dodaj do HTML

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Dodaj style -->
    <link rel="stylesheet" href="audio-player-styles.css">
</head>
<body>
    <!-- Dodaj container -->
    <div id="moj-player"></div>

    <!-- Dodaj skrypt -->
    <script type="module">
        import SectionAudioPlayer from './audio-player.js';

        new SectionAudioPlayer('moj-player', {
            sectionTitle: '🎵 Moja Sekcja',
            tracks: [{
                title: 'Mój Utwór',
                src: 'audio/wiedza/moj-plik.mp3'
            }]
        });
    </script>
</body>
</html>
```

## Krok 3: Otwórz w przeglądarce

Gotowe! 🎉

---

## Struktura Folderów

```
audio/
├── wiedza/          # 📚 Materiały edukacyjne
├── umiejetnosci/    # 🛠️ Tutoriale i poradniki
├── projekty/        # 💼 Prezentacje projektów
└── inne/            # 📁 Inne materiały
```

---

## Więcej Informacji

- Pełna dokumentacja: `AUDIO_PLAYER_INSTRUKCJA.md`
- Przykład: `audio-example.html`
- Readme folderów: `audio/README.md`

---

**Potrzebujesz pomocy?** Sprawdź `AUDIO_PLAYER_INSTRUKCJA.md` dla szczegółowych instrukcji!
