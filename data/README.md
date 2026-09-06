# `data/portfolio.json`

Źródło danych dla siatki Portfolio & Case Studies na stronie głównej
(`components/portfolio/portfolio-grid.tsx`).

## Dodawanie nowej pozycji

Dopisz kolejny obiekt do tablicy — nic więcej nie trzeba zmieniać w kodzie:

```json
{
  "id": "unikalny-slug",
  "youtubeId": "ID_FILMU_Z_YOUTUBE",
  "tytul": "Tytuł materiału",
  "kategoria": "analiza-mechaniczna",
  "format": "16:9",
  "branza": "mim",
  "opis": "Krótki opis (1-2 zdania).",
  "data": "2026-09"
}
```

## Wartości dozwolone

- `kategoria`: `analiza-mechaniczna` | `short` | `ai-wizualizacja`
- `format`: `16:9` | `9:16`
- `branza`: `plc` | `arburg` | `robotyka` | `mim` | `agro`

## Uwaga

Wpisy w repozytorium mają obecnie wartości `youtubeId` typu `PLACEHOLDER_0x` —
to dane przykładowe demonstrujące strukturę siatki. Podmień je na rzeczywiste
identyfikatory filmów z YouTube (fragment adresu po `v=`) przed publikacją.
