# Struktura Folderów Audio

Ta struktura folderów została stworzona do organizacji plików audio (.mp3, .ogg, .wav) dla różnych sekcji strony.

## Struktura

```
audio/
├── wiedza/          # Pliki audio dla sekcji "Wiedza"
├── umiejetnosci/    # Pliki audio dla sekcji "Umiejętności"
├── projekty/        # Pliki audio dla sekcji "Projekty"
└── inne/            # Inne pliki audio
```

## Konwencja Nazewnictwa

Zalecane jest używanie opisowych nazw plików:

- `wiedza-01-wprowadzenie.mp3`
- `umiejetnosci-02-javascript.mp3`
- `projekty-03-daremon-radio.mp3`

## Formaty Audio

Obsługiwane formaty:
- **MP3** (zalecany) - uniwersalna kompatybilność
- **OGG** - dobra jakość, mniejsze pliki
- **WAV** - najlepsza jakość, większe pliki

## Dodawanie Plików

1. Umieść plik audio w odpowiednim folderze
2. Zaktualizuj konfigurację w pliku HTML (zobacz przykłady w `audio-example.html`)
3. Odśwież stronę

## Przykłady Użycia

Zobacz plik `audio-example.html` w głównym folderze projektu.
