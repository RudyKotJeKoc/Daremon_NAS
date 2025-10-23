# 3D Audio Visualizer - Quick Start Guide

## 🚀 Jak Używać

### 1. Uruchomienie Aplikacji

```bash
npm install
npm run dev
```

### 2. Włączenie Wizualizatora 3D

1. Otwórz aplikację w przeglądarce
2. Kliknij przycisk odtwarzania (▶️)
3. W kontrolkach odtwarzacza znajdź przycisk **"🎨 2D"**
4. Kliknij, aby przełączyć na **"🌐 3D"**

### 3. Kontrola Kamery (Tryb 3D)

| Akcja | Efekt |
|-------|-------|
| Lewy przycisk myszy + przeciągnięcie | Obrót kamery wokół sceny |
| Scroll / Scroll na touchpadzie | Przybliżanie/oddalanie |
| Touch (2 palce) | Pinch to zoom |
| Brak interakcji przez 5 sekund | Automatyczna rotacja |

### 4. Wizualizacja Audio

**Centralna kula:**
- Pulsuje w rytm basu (niskich częstotliwości)
- Im głośniejsza muzyka, tym jaśniejsze świecenie

**Cząsteczki:**
- 🔴 Czerwone/pomarańczowe = bas
- 🟡 Żółte/pomarańczowe = środkowy zakres
- 🔵 Niebieskie/cyjan = wysokie częstotliwości

Każda cząsteczka zmienia rozmiar i pozycję w zależności od amplitudy w swoim zakresie częstotliwości.

## 🔧 Wymagania Systemowe

- **Przeglądarka z WebGL**: Chrome 56+, Firefox 51+, Safari 11+, Edge 79+
- **Zalecane**: GPU z obsługą hardware acceleration
- **Minimalne**: Procesor dual-core, 4GB RAM

## ❓ Rozwiązywanie Problemów

### Przycisk 3D jest wyszarzony
- **Przyczyna**: Twoja przeglądarka nie obsługuje WebGL
- **Rozwiązanie**: Użyj nowszej przeglądarki lub włącz hardware acceleration w ustawieniach przeglądarki

### Wizualizator 3D jest wolny/laguje
- **Rozwiązanie 1**: Przełącz z powrotem na tryb 2D (kliknij przycisk "🌐 3D")
- **Rozwiązanie 2**: Zamknij inne karty przeglądarki
- **Rozwiązanie 3**: Sprawdź, czy hardware acceleration jest włączona

### Wizualizator się nie uruchamia
- **Sprawdź**: Czy muzyka jest odtwarzana (przycisk play)
- **Sprawdź**: Czy nie ma błędów w konsoli przeglądarki (F12)

## 🎯 Najlepsze Praktyki

1. **Pierwsza wizyta**: Wypróbuj najpierw tryb 2D, potem przełącz na 3D
2. **Oszczędzanie baterii**: Używaj trybu 2D na urządzeniach mobilnych
3. **Najlepsza jakość**: Tryb 3D na komputerze stacjonarnym z GPU
4. **Eksperymentuj**: Obracaj kamerą podczas różnych typów muzyki!

## 🔮 Co Dalej?

W przyszłych wersjach planujemy dodać:
- Bloom effect (efekt świecenia)
- Niestandardowe shadery i kolory neonowe
- Więcej typów geometrii 3D
- Adaptive quality (automatyczne dostosowanie jakości)
- Gesture control (sterowanie gestami)
- Voice commands (komendy głosowe)

## 📖 Więcej Informacji

- Szczegóły techniczne: `visualizer/README.md`
- Pełny raport wdrożenia: `IMPLEMENTATION-REPORT.md`
- Dokumentacja główna: `README.md`

---

**Miłego słuchania i oglądania! 🎵✨**
