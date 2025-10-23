# Scripts Documentation

## Generate Playlist

Skrypt `generate-playlist.js` automatycznie skanuje katalog `music/` i generuje kompletny plik `playlist.json` ze wszystkimi utworami muzycznymi.

### Użycie

#### Na Synology NAS (przez SSH):

```bash
# 1. Zaloguj się przez SSH do Synology NAS
ssh admin@your-nas-ip

# 2. Przejdź do katalogu projektu
cd /volume1/web/daremon.nl

# 3. Uruchom skrypt
npm run generate:playlist
# lub
node scripts/generate-playlist.js
```

#### Lokalnie (dla testów):

```bash
# W katalogu projektu
npm run generate:playlist
```

### Co robi skrypt?

1. **Skanuje** katalog `./music/` i wszystkie podkatalogi
2. **Znajduje** wszystkie pliki audio (.mp3, .wav, .ogg, .m4a)
3. **Generuje** obiekt track dla każdego pliku:
   - ID: `track-1`, `track-2`, etc.
   - Title: wyciągnięty z nazwy pliku
   - Artist: "DAREMON Radio" (domyślnie)
   - Src: ścieżka zakodowana URL (spacje jako %20)
   - Cover: placeholder z kolorowym tłem
4. **Zapisuje** kompletny `playlist.json`

### Format wygenerowanego playlist.json

```json
{
  "config": {
    "quietHours": { "start": "22:00", "end": "06:00" },
    "jingle": {
      "enabled": true,
      "everySongs": 4,
      "orMinutes": 15
    },
    "recentMemory": 15,
    "crossfadeSeconds": 2
  },
  "tracks": [
    {
      "id": "track-1",
      "title": "Nazwa utworu",
      "artist": "DAREMON Radio",
      "src": "./music/Utwor%20(1).mp3",
      "cover": "https://placehold.co/120x120/4CAF50/ffffff?text=1",
      "tags": ["music"],
      "weight": 1,
      "type": "song",
      "golden": false
    }
    // ... więcej utworów
  ]
}
```

### Kodowanie ścieżek

Skrypt automatycznie koduje ścieżki do formatu URL:
- Spacje → `%20`
- Nawiasy → `%28` i `%29`
- Inne znaki specjalne → zakodowane wg RFC 3986

**Przykłady:**
- `./music/Utwor (1).mp3` → `./music/Utwor%20(1).mp3`
- `./music/My Song (2).mp3` → `./music/My%20Song%20(2).mp3`

### Wsparcie dla podkatalogów

Skrypt automatycznie skanuje wszystkie podkatalogi w `./music/`:

```
music/
├── Utwor (1).mp3
├── rock/
│   ├── Song (1).mp3
│   └── Song (2).mp3
└── pop/
    └── Hit (1).mp3
```

Wszystkie pliki zostaną znalezione i dodane do playlisty.

### Po wygenerowaniu playlisty

1. **Sprawdź** wygenerowany `playlist.json`
2. **Zbuduj** aplikację: `npm run build`
3. **Odśwież** stronę w przeglądarce

Aplikacja automatycznie załaduje nową playlistę ze wszystkimi utworami.

---

## Generate Media Manifest

Skrypt `generate-media-manifest.js` skanuje katalogi `images/` i `video/` i generuje plik `slideshow-media.js` z listą wszystkich plików multimedialnych.

### Użycie

```bash
npm run generate:media
# lub
node scripts/generate-media-manifest.js
```

Ten skrypt jest używany do slideshow i wizualizacji w aplikacji.
