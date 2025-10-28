# Instrukcja dodawania obrazów i filmów

## Jak działa system

System **automatycznie wykrywa** wszystkie pliki w folderach `images/` i `video/` - nie musisz ręcznie dodawać ich do żadnej listy!

## Krok po kroku

### 1. Dodaj pliki do odpowiednich folderów

Skopiuj swoje pliki do:
- **Obrazy**: `/home/user/Daremon_NAS/images/`
- **Filmy**: `/home/user/Daremon_NAS/video/`

Możesz używać dowolnych nazw plików, np.:
- `image (1).png`, `image (2).png`, ..., `image (100).png`
- `video (1).mp4`, `video (2).mp4`, ..., `video (94).mp4`

### 2. Wygeneruj manifest mediów

Po dodaniu plików uruchom:

```bash
npm run generate:media
```

Ten skrypt:
- Automatycznie przeskanuje foldery `images/` i `video/`
- Znajdzie wszystkie obsługiwane pliki
- Wygeneruje plik `slideshow-media.js` z pełną listą

### 3. Gotowe!

System automatycznie będzie:
- Co 10 sekund pokazywał losowy obraz lub film jako okładkę utworu
- Wykrywał wszystkie pliki bez względu na ich liczbę
- Obsługiwał nowe pliki po ponownym uruchomieniu `npm run generate:media`

## Obsługiwane formaty

### Obrazy:
- JPG/JPEG
- PNG
- GIF
- SVG
- WebP
- AVIF

### Filmy:
- MP4
- WebM
- OGG
- MOV

## Dodawanie kolejnych plików

Gdy dodasz nowe pliki (np. `image (101).png` do `image (200).png`):

1. Skopiuj je do odpowiedniego folderu
2. Uruchom ponownie: `npm run generate:media`
3. System automatycznie wykryje wszystkie pliki!

## Podfoldery

System również obsługuje podfoldery! Możesz organizować pliki np.:
```
images/
  ├── kategoria1/
  │   ├── obraz1.png
  │   └── obraz2.png
  └── kategoria2/
      └── obraz3.png
```

Wszystkie zostaną automatycznie wykryte.

## Sprawdzanie aktualnego stanu

Aby zobaczyć ile plików system wykrył:
```bash
npm run generate:media
```

Zobaczy wynik np.: `Generated slideshow-media.js with 194 entries.`

To oznacza że system znalazł 194 pliki (100 obrazów + 94 filmy).
