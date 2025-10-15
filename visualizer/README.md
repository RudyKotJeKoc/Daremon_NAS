# 3D Audio Visualizer

Implementacja wizualizacji audio 3D z wykorzystaniem Three.js, zgodnie z planem wdrożenia.

## Struktura

### Visualizer3D.js
Główna klasa wizualizatora 3D. Zawiera:
- **Scenę Three.js** z kamerą perspektywiczną i oświetleniem
- **Centralną kulę** reagującą na niskie częstotliwości (bass)
- **System cząsteczek** (300 cząsteczek) reprezentujący różne zakresy:
  - Bas (czerwone/pomarańczowe) - 0-33% częstotliwości
  - Środkowy zakres (żółte/pomarańczowe) - 33-66% częstotliwości
  - Wysokie (niebieskie/cyjan) - 66-100% częstotliwości
- **OrbitControls** dla interaktywnej kontroli kamery
- **Automatyczną rotację** kamery po 5 sekundach bezczynności

### AudioVisualizerSwitch.js
Komponent przełączający między wizualizatorem 2D a 3D. Zawiera:
- **Progressive enhancement** - sprawdzanie dostępności WebGL
- **Fallback do 2D** gdy WebGL niedostępny
- **Przycisk przełączania** wstrzyknięty do kontrolek odtwarzacza
- **Zapisywanie preferencji** użytkownika w localStorage
- **Kontrolę cyklu życia** wizualizatorów (start/stop)

## Funkcje

### Wizualizacja 3D
- Kula centralna skaluje się i pulsuje w rytm muzyki
- Intensywność świecenia zmienia się z głośnością
- Cząsteczki poruszają się i zmieniają rozmiar według amplitudy
- Automatyczna rotacja sceny i obiektów

### Interaktywność
- **Mysz/Touch**: obracanie kamery, zoom (scroll/pinch)
- **Auto-rotate**: włącza się po 5 sekundach bezczynności
- **Przełącznik 2D/3D**: przycisk w kontrolkach odtwarzacza

### Optymalizacja
- `devicePixelRatio` ograniczony do 2 dla lepszej wydajności
- Antyaliasing włączony dla lepszej jakości
- Mgła sceny dla efektu głębi

## Integracja

Wizualizator jest automatycznie inicjalizowany w `app.js` po utworzeniu AudioContext:

```javascript
// W setupAudioContext()
if (!visualizerSwitch && dom.visualizerCanvas && dom.visualizer3DCanvas) {
    visualizerSwitch = new AudioVisualizerSwitch(
        dom.visualizerCanvas,
        dom.visualizer3DCanvas,
        analyser,
        drawVisualizer
    );
}
```

Kontrola wizualizatora jest zsynchronizowana z odtwarzaniem:
- **Play** → wizualizator startuje
- **Pause** → wizualizator zatrzymuje się

## Testowanie

Testy znajdują się w `tests/visualizer-3d.test.js` i sprawdzają:
- Dostępność metod statycznych (isWebGLAvailable)
- Strukturę klas i metod
- Obsługę localStorage

## Zależności

- **three**: ^0.170.0 - biblioteka 3D
- **three/examples/jsm/controls/OrbitControls.js** - kontrola kamery

## Następne kroki (opcjonalne rozszerzenia)

1. **Bloom effect** - dodanie UnrealBloomPass dla efektu świecenia
2. **ShaderMaterial** - niestandardowe shadery dla neonowych efektów
3. **Więcej geometrii** - dodatkowe obiekty 3D reagujące na muzykę
4. **Parametry jakości** - dostosowanie liczby cząsteczek na podstawie wydajności urządzenia
5. **Gesture Control** - integracja z MediaPipe Hands (następna faza)
6. **Voice Commands** - integracja z Web Speech API (następna faza)
