'use client'

import { useLanguage, type Language } from '@/components/language-provider'

export const translations = {
  pl: {
    nav: {
      start: 'Start',
      diensten: 'Usługi',
      casussen: 'Case Studies',
      methodiek: 'Metodyka i AI',
      over: 'O nas',
      contact: 'Kontakt',
      etsRadio: 'Radio ETS',
      escHint: 'Naciśnij ESC, aby zamknąć',
    },
    footer: {
      rights: 'DAREMON Engineering',
      tagline: 'Specjalistyczny montaż wideo, analiza procesów i wizualizacje AI.',
      legal: 'Informacje prawne',
    },
    radioDock: {
      live: 'RADIO ETS · NA ŻYWO',
      fullscreen: 'Pełny ekran ↗',
      openLabel: 'Otwórz panel Radia ETS',
      closeLabel: 'Zwiń panel Radia ETS',
      button: 'Radio ETS',
    },
    audioLab: {
      loading: 'Ładowanie wizualizacji 3D…',
      unavailable:
        'Wizualizacja 3D jest wyłączona w tej przeglądarce (brak WebGL lub włączone ograniczenie animacji).',
    },
    portfolio: {
      filters: {
        wszystkie: 'Wszystkie',
        'analiza-mechaniczna': 'Analizy mechaniczne',
        short: 'Shorts / Reels',
        'ai-wizualizacja': 'Wizualizacje AI',
      },
      empty: 'Brak pozycji w tej kategorii.',
      kategoria: {
        'analiza-mechaniczna': 'Analiza mechaniczna',
        short: 'Short / Reel',
        'ai-wizualizacja': 'Wizualizacja AI',
      },
      branza: {
        plc: 'PLC',
        arburg: 'Arburg',
        robotyka: 'Robotyka',
        mim: 'MIM',
        agro: 'Agro',
      },
    },
    home: {
      statusBadge: 'SYSTEM AKTYWNY · RADIO ETS 24/7',
      title: 'DAREMON',
      subtitle: 'Engineering — Montaż Techniczny & Analiza Procesów',
      lead1: 'Specjalistyczny montaż wideo dla sektora mechanicznego, przemysłowego i agro.',
      lead2:
        'Analiza procesów, kinematyka maszyn, autorskie audio wolne od praw autorskich i wizualizacje AI — zbudowane na tej samej technologii, którą widzisz na tej stronie.',
      ctaQuote: 'Zapytaj o wycenę',
      ctaPortfolio: 'Zobacz portfolio',
      competenciesHeading: 'Zaplecze techniczne',
      competencies: [
        { tytul: 'PLC Siemens', opis: 'Programowanie, diagnostyka i dokumentacja logiki sterowników linii produkcyjnych.' },
        { tytul: 'Arburg', opis: 'Analiza cykli wtryskarek — parametry procesowe, wady powierzchniowe, optymalizacja.' },
        { tytul: 'Yaskawa Motoman', opis: 'Trajektorie i strefy robocze robotów przemysłowych w komórkach zrobotyzowanych.' },
        { tytul: 'MIM', opis: 'Metal Injection Molding — kinematyka wypełniania formy i przepływu granulatu.' },
      ],
      portfolioHeading: 'Portfolio & Case Studies',
      portfolioLink: 'Pełne case studies →',
      audioLabHeading: 'Audio Lab',
      audioLabText:
        'Ta sama wizualizacja 3D, która w Radiu ETS reaguje na muzykę na żywo, napędzana silnikiem Three.js — dowód, że materiały wideo, które montujemy, mogą wyglądać równie precyzyjnie jak proces, który dokumentują. Autorskie ścieżki dźwiękowe do wideo powstają bez ryzyka Content ID.',
      processHeading: 'Jak pracujemy',
      processLink: 'Metodyka i rola AI →',
      process: [
        { krok: 'Analiza', opis: 'Rozbiór procesu, maszyny lub incydentu na podstawie materiału źródłowego i dokumentacji technicznej.' },
        { krok: 'Montaż', opis: 'Precyzyjny montaż wideo z autorską ścieżką dźwiękową wolną od Content ID i wizualizacjami AI.' },
        { krok: 'Dostawa', opis: 'Materiał w formacie dopasowanym do odbiorcy — 16:9 do dokumentacji, 9:16 do social media.' },
      ],
      radioHeading: 'Radio ETS',
      radioText:
        'Nasze firmowe radio internetowe działa 24/7 w tle tej platformy — dokowalny panel w prawym dolnym rogu ekranu daje do niego dostęp z każdej podstrony. Pełny interfejs, wizualizacje i ankiety społecznościowe dostępne są też w trybie pełnoekranowym.',
      radioCta: 'Otwórz pełny ekran',
      contactHeading: 'Masz proces, maszynę lub incydent do udokumentowania?',
      contactText: 'Opisz projekt, a przygotujemy wstępną wycenę montażu, analizy lub wizualizacji.',
      contactCta: 'Przejdź do kontaktu',
    },
  },
  nl: {
    nav: {
      start: 'Start',
      diensten: 'Diensten',
      casussen: 'Case Studies',
      methodiek: 'Methodiek & AI',
      over: 'Over ons',
      contact: 'Contact',
      etsRadio: 'Radio ETS',
      escHint: 'Druk op ESC om te sluiten',
    },
    footer: {
      rights: 'DAREMON Engineering',
      tagline: 'Gespecialiseerde videomontage, procesanalyse en AI-visualisaties.',
      legal: 'Juridische informatie',
    },
    radioDock: {
      live: 'RADIO ETS · LIVE',
      fullscreen: 'Volledig scherm ↗',
      openLabel: 'Open het Radio ETS-paneel',
      closeLabel: 'Sluit het Radio ETS-paneel',
      button: 'Radio ETS',
    },
    audioLab: {
      loading: '3D-visualisatie wordt geladen…',
      unavailable:
        '3D-visualisatie is niet beschikbaar in deze browser (geen WebGL, of animaties zijn beperkt).',
    },
    portfolio: {
      filters: {
        wszystkie: 'Alles',
        'analiza-mechaniczna': 'Mechanische analyses',
        short: 'Shorts / Reels',
        'ai-wizualizacja': 'AI-visualisaties',
      },
      empty: 'Geen items in deze categorie.',
      kategoria: {
        'analiza-mechaniczna': 'Mechanische analyse',
        short: 'Short / Reel',
        'ai-wizualizacja': 'AI-visualisatie',
      },
      branza: {
        plc: 'PLC',
        arburg: 'Arburg',
        robotyka: 'Robotica',
        mim: 'MIM',
        agro: 'Agro',
      },
    },
    home: {
      statusBadge: 'SYSTEEM ACTIEF · RADIO ETS 24/7',
      title: 'DAREMON',
      subtitle: 'Engineering — Technische Montage & Procesanalyse',
      lead1: 'Gespecialiseerde videomontage voor de mechanische, industriële en agrarische sector.',
      lead2:
        'Procesanalyse, kinematica van machines, auteursrechtvrije audio en AI-visualisaties — gebouwd op dezelfde technologie die je op deze pagina ziet.',
      ctaQuote: 'Vraag een offerte aan',
      ctaPortfolio: 'Bekijk portfolio',
      competenciesHeading: 'Technisch fundament',
      competencies: [
        { tytul: 'PLC Siemens', opis: 'Programmeren, diagnose en documentatie van besturingslogica voor productielijnen.' },
        { tytul: 'Arburg', opis: 'Analyse van spuitgietcycli — procesparameters, oppervlaktedefecten, optimalisatie.' },
        { tytul: 'Yaskawa Motoman', opis: 'Trajecten en werkzones van industriële robots in geautomatiseerde cellen.' },
        { tytul: 'MIM', opis: 'Metal Injection Molding — kinematica van matrijsvulling en granulaatstroom.' },
      ],
      portfolioHeading: 'Portfolio & Case Studies',
      portfolioLink: 'Alle case studies →',
      audioLabHeading: 'Audio Lab',
      audioLabText:
        'Dezelfde 3D-visualisatie die bij Radio ETS live reageert op muziek, aangedreven door Three.js — het bewijs dat het videomateriaal dat wij monteren er net zo precies uit kan zien als het proces dat het documenteert. Eigen soundtracks voor video, zonder Content ID-risico.',
      processHeading: 'Onze werkwijze',
      processLink: 'Methodiek en de rol van AI →',
      process: [
        { krok: 'Analyse', opis: 'Ontleding van proces, machine of incident op basis van bronmateriaal en technische documentatie.' },
        { krok: 'Montage', opis: 'Precieze videomontage met eigen soundtrack zonder Content ID-risico en AI-visualisaties.' },
        { krok: 'Levering', opis: 'Materiaal in het formaat dat past bij het gebruik — 16:9 voor documentatie, 9:16 voor social media.' },
      ],
      radioHeading: 'Radio ETS',
      radioText:
        'Ons bedrijfsradiostation draait 24/7 op de achtergrond van dit platform — het dokbare paneel rechtsonder geeft er op elke pagina toegang toe. De volledige interface, visualisaties en community-polls zijn ook in volledig scherm beschikbaar.',
      radioCta: 'Open volledig scherm',
      contactHeading: 'Heb je een proces, machine of incident dat gedocumenteerd moet worden?',
      contactText: 'Beschrijf je project en we stellen een eerste inschatting op voor montage, analyse of visualisatie.',
      contactCta: 'Naar contact',
    },
  },
} as const satisfies Record<Language, unknown>

export type Translations = (typeof translations)[Language]

export function useT(): Translations {
  const { language } = useLanguage()
  return translations[language]
}
