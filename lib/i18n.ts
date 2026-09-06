'use client'

import { useLanguage, type Language } from '@/components/language-provider'

export const translations = {
  pl: {
    nav: {
      start: 'Start',
      diensten: 'Usługi',
      casussen: 'Case Studies',
      methodiek: 'Metodyka i AI',
      over: 'O mnie',
      contact: 'Kontakt',
      escHint: 'Naciśnij ESC, aby zamknąć',
    },
    footer: {
      rights: 'DAREMON Engineering',
      tagline: 'Specjalistyczny montaż wideo, analiza procesów i wizualizacje AI.',
      legal: 'Informacje prawne',
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
      statusBadge: 'SYSTEM AKTYWNY · DOSTĘPNY 24/7',
      title: 'DAREMON',
      subtitle: 'Engineering — Montaż Techniczny & Analiza Procesów',
      lead1: 'Specjalistyczny montaż wideo dla sektora mechanicznego, przemysłowego i agro.',
      lead2:
        'Analiza procesów, kinematyka maszyn, autorskie audio wolne od praw autorskich i wizualizacje AI — pełen zakres materiałów technicznych, jakie mogę dla Ciebie przygotować.',
      ctaQuote: 'Zapytaj o wycenę',
      ctaPortfolio: 'Zobacz portfolio',
      portfolioHeading: 'Portfolio & Case Studies',
      portfolioLink: 'Pełne case studies →',
      processHeading: 'Jak pracuję',
      processLink: 'Metodyka i rola AI →',
      process: [
        { krok: 'Analiza', opis: 'Rozbiór procesu, maszyny lub incydentu na podstawie materiału źródłowego i dokumentacji technicznej.' },
        { krok: 'Montaż', opis: 'Precyzyjny montaż wideo z autorską ścieżką dźwiękową wolną od Content ID i wizualizacjami AI.' },
        { krok: 'Dostawa', opis: 'Materiał w formacie dopasowanym do odbiorcy — 16:9 do dokumentacji, 9:16 do social media.' },
      ],
      contactHeading: 'Masz proces, maszynę lub incydent do udokumentowania?',
      contactText: 'Opisz projekt, a przygotuję wstępną wycenę montażu, analizy lub wizualizacji.',
      contactCta: 'Przejdź do kontaktu',
    },
    diensten: {
      heroTitle: 'Usługi',
      heroLead: 'Specjalistyczny montaż wideo i analiza procesów, dopasowane do formatu i odbiorcy.',
      items: [
        {
          tytul: 'Montaż analiz mechanicznych',
          opis: 'Rozbiór procesu, maszyny lub incydentu na materiale źródłowym — czytelny montaż 16:9 do dokumentacji technicznej i szkoleń.',
          bullets: [
            'Synchronizacja z dokumentacją techniczną',
            'Spowolnienia i adnotacje klatka po klatce',
            'Wersje do archiwizacji i szkoleń wewnętrznych',
          ],
        },
        {
          tytul: 'Shorts i Reels',
          opis: 'Skrócone, pionowe wersje materiałów technicznych — pod social media i szybką komunikację wewnętrzną.',
          bullets: [
            'Format 9:16',
            'Napisy i oznaczenia kluczowych momentów',
            'Wersje pod LinkedIn, Instagram i kanały wewnętrzne',
          ],
        },
        {
          tytul: 'Wizualizacje AI',
          opis: 'Renderowane komputerowo wizualizacje procesów trudnych do sfilmowania — przepływy, strefy robocze, symulacje.',
          bullets: [
            'Wizualizacja stref bezpieczeństwa i zasięgu robotów',
            'Symulacje przepływu materiału i granulatu',
            'Materiały poglądowe dla klientów i audytorów',
          ],
        },
        {
          tytul: 'Audio Lab — autorska ścieżka dźwiękowa',
          opis: 'Muzyka i udźwiękowienie tworzone od podstaw — zero ryzyka Content ID przy publikacji.',
          bullets: [
            'Ścieżki dopasowane do tempa montażu',
            'Pełne prawa do wykorzystania komercyjnego',
            'Wizualizacja 3D reagująca na dźwięk — zobacz w Audio Lab na stronie głównej',
          ],
        },
      ],
      ctaHeading: 'Masz projekt do wyceny?',
      ctaText: 'Opisz proces, maszynę lub format, który Cię interesuje — odezwę się z konkretną propozycją.',
      ctaButton: 'Przejdź do kontaktu',
    },
    casussen: {
      heroTitle: 'Case Studies',
      heroLead: 'Wybrane projekty montażowe i analityczne — sytuacja, ustalenia, rezultat.',
      situationLabel: 'Sytuacja',
      findingsLabel: 'Ustalenia',
      resultLabel: 'Rezultat',
      items: [
        {
          tytul: 'Diagnostyka przestojów linii MIM',
          kategoria: 'MIM',
          sytuacja:
            'Producent elementów MIM zgłosił powtarzające się, trudne do zdiagnozowania przestoje na jednym z etapów formowania.',
          ustalenia: [
            'Nagrania klatka po klatce ujawniły moment powstawania mikropęknięć w formie',
            'Zestawienie z parametrami procesu wskazało okno czasowe odpowiedzialne za większość usterek',
            'Materiał posłużył zespołowi utrzymania ruchu jako punkt odniesienia do korekty parametrów',
          ],
          rezultat: 'Skrócenie czasu diagnozowania kolejnych przestojów i gotowy materiał szkoleniowy dla nowych operatorów.',
        },
        {
          tytul: 'Dokumentacja wdrożenia komórki Yaskawa Motoman',
          kategoria: 'Robotyka',
          sytuacja:
            'Integrator robotyki potrzebował materiału dokumentującego uruchomienie nowej komórki zrobotyzowanej — do odbioru technicznego i szkolenia operatorów.',
          ustalenia: [
            'Nagranie pełnego cyklu z ujęciami synchronicznymi z dwóch kamer',
            'Nałożona telemetria osi ułatwiła odbiór techniczny',
            'Materiał wykorzystano też jako element oferty integratora dla kolejnych klientów',
          ],
          rezultat: 'Skrócony czas odbioru technicznego i gotowy materiał marketingowo-szkoleniowy w jednym.',
        },
        {
          tytul: 'Analiza cyklu wtrysku Arburg pod kątem wad powierzchniowych',
          kategoria: 'Arburg',
          sytuacja: 'Nawracające, mikroskopijne wady powierzchniowe na elementach wtryskiwanych, trudne do uchwycenia gołym okiem.',
          ustalenia: [
            'Makrorejestracja w zwolnionym tempie ujawniła moment powstawania defektu przy przełączeniu ciśnienia',
            'Zestawienie z logiem parametrów maszyny zawęziło listę przyczyn do dwóch parametrów',
            'Krótka wersja (short) posłużyła do szybkiego uzgodnienia zmian z zespołem zmianowym',
          ],
          rezultat: 'Ograniczenie liczby braków bez przestoju linii na dodatkowe testy.',
        },
        {
          tytul: 'Wizualizacja pracy zespołu wysiewającego',
          kategoria: 'Agro',
          sytuacja:
            'Producent maszyn rolniczych potrzebował poglądowego materiału tłumaczącego zasadę działania zespołu wysiewającego klientom i dystrybutorom.',
          ustalenia: [
            'Połączenie nagrania rzeczywistego z wizualizacją AI przekroju mechanizmu',
            'Materiał przygotowany w dwóch formatach — pełna wersja 16:9 i skrócony reel',
            'Dystrybutorzy wykorzystali materiał bez dodatkowego udziału producenta',
          ],
          rezultat: 'Jeden materiał wideo zastąpił wielostronicową instrukcję poglądową.',
        },
      ],
      ctaHeading: 'Masz podobny projekt?',
      ctaText: 'Opisz sytuację — powiem, jak podszedłbym do montażu lub analizy.',
      ctaButton: 'Przejdź do kontaktu',
    },
    over: {
      heroTitle: 'O mnie',
      heroLead: 'Inżynieria i montaż wideo pod jednym dachem.',
      sections: [
        {
          tytul: 'Kim jestem',
          body:
            'DAREMON Engineering łączy ponad 15 lat doświadczenia w elektryce i automatyce przemysłowej z montażem wideo i narzędziami AI. Powstałem z przekonania, że najlepiej o procesie technicznym opowie ktoś, kto sam go rozumie od strony inżynierskiej — nie tylko montażowej.',
        },
        {
          tytul: 'Skąd ta wiedza',
          body:
            'Programowanie sterowników PLC Siemens, diagnostyka wtryskarek Arburg, wdrożenia robotów Yaskawa Motoman i praca z technologią MIM — to moje zaplecze techniczne, które pozwala mi rozumieć materiał źródłowy zanim zacznę montaż, a nie tylko ładnie go poskładać.',
        },
        {
          tytul: 'Dlaczego wideo i AI',
          body:
            'Część procesów przemysłowych trudno opisać słowami albo pokazać gołym okiem — kinematyka robota, mikropęknięcie w formie, przepływ granulatu. Montaż wideo i wizualizacje AI pozwalają pokazać to, co inaczej zostałoby tylko w dokumentacji tekstowej.',
        },
        {
          tytul: 'Skąd nazwa DAREMON',
          body:
            'Nazwa nawiązuje do "daemon" — procesu działającego w tle, który utrzymuje system w ruchu. Dokładnie tak rozumiem swoją rolę: dokumentuję i analizuję procesy, które napędzają produkcję, nawet jeśli zwykle pozostają niewidoczne.',
        },
      ],
      ctaHeading: 'Chcesz porozmawiać o projekcie?',
      ctaText: 'Napisz, czym się zajmujesz i co chcesz pokazać — odpowiem z konkretami.',
      ctaButton: 'Przejdź do kontaktu',
    },
    methodiek: {
      heroTitle: 'Metodyka i AI',
      heroLead: 'Jak łączę analizę techniczną, montaż i narzędzia AI, żeby materiał był rzetelny i czytelny.',
      tabProcess: 'Mój proces',
      tabAi: 'Rola AI',
      processHeading: 'Jak pracuję',
      processSteps: [
        {
          tytul: 'Briefing i analiza źródeł',
          opis: 'Przeglądam materiał źródłowy i dokumentację techniczną, żeby zrozumieć proces zanim zacznę montaż.',
        },
        {
          tytul: 'Montaż i synchronizacja',
          opis: 'Montuję materiał z uwzględnieniem parametrów procesowych i dokumentacji — tak, by obraz zgadzał się z danymi.',
        },
        {
          tytul: 'Wizualizacja i udźwiękowienie',
          opis: 'Tam, gdzie to zasadne, dodaję wizualizacje AI i autorską ścieżkę dźwiękową wolną od Content ID.',
        },
        {
          tytul: 'Dostawa i wsparcie',
          opis: 'Materiał trafia w formacie dopasowanym do odbiorcy, z możliwością korekt po pierwszym przeglądzie.',
        },
      ],
      aiHeading: 'Gdzie realnie pomaga mi AI',
      aiIntro:
        'AI jest narzędziem, nie autorem materiału. Korzystam z niej w konkretnych, ograniczonych zadaniach — decyzje montażowe i interpretacja procesu zawsze pozostają po mojej stronie.',
      aiPoints: [
        {
          tytul: 'Wizualizacje 3D',
          opis: 'Silnik Three.js pomaga pokazać strefy robocze, trajektorie i przepływy, których nie da się łatwo sfilmować.',
        },
        {
          tytul: 'Autorskie audio',
          opis: 'Narzędzia generatywne wspierają komponowanie ścieżek dźwiękowych wolnych od roszczeń Content ID.',
        },
        {
          tytul: 'Wstępna selekcja materiału',
          opis: 'Przy długich nagraniach źródłowych AI pomaga wskazać momenty warte bliższej analizy — ostateczny wybór należy do montażysty.',
        },
      ],
      ctaHeading: 'Masz pytania o moją metodykę?',
      ctaText: 'Chętnie opowiem, jak podszedłbym do Twojego materiału.',
      ctaButton: 'Przejdź do kontaktu',
    },
    contact: {
      heroTitle: 'Kontakt',
      heroLead: 'Poproś o bezpłatną wycenę montażu, analizy lub wizualizacji.',
      aboutHeading: 'O tym kontakcie',
      aboutText:
        'Opisz swój projekt — maszynę, proces lub incydent, który wymaga udokumentowania lub przeanalizowania — a ja odezwę się z konkretną propozycją.',
      expectHeading: 'Czego możesz się spodziewać?',
      expectItems: [
        'Odpowiedź z pierwszą oceną podejścia i czasu realizacji',
        'Niezobowiązującą wycenę dopasowaną do Twojej branży (PLC, Arburg, robotyka, MIM, agro)',
        'Odpowiedź w ciągu kilku dni roboczych',
      ],
      emailHeading: 'E-mail',
      emailIntro: 'Do wycen i zapytań biznesowych:',
      emailLabel: 'E-mail:',
      formHeading: 'Wyślij zapytanie',
      faqHeading: 'Najczęściej zadawane pytania',
      faqWhatQ: 'Czym zajmuje się DAREMON Engineering?',
      faqWhatA:
        'Specjalistycznym montażem wideo technicznego, analizą procesów i wizualizacjami AI dla sektora mechanicznego, przemysłowego i agro.',
      faqProcessQ: 'Jak wygląda proces?',
      faqProcessABefore:
        'Analiza materiału źródłowego, montaż z autorską ścieżką dźwiękową i ewentualną wizualizacją AI oraz dostawa w formacie dopasowanym do zastosowania — zobacz sekcję ',
      faqProcessLinkText: 'Metodyka i AI',
      faqProcessAAfter: ' na stronie głównej.',
      faqWhyQ: 'W jakiej sprawie mogę się skontaktować?',
      faqWhyA:
        'W sprawie zapytań ofertowych, pytań o trwający projekt lub wstępnego rozeznania przed zleceniem.',
      form: {
        labelName: 'Imię i nazwisko *',
        placeholderName: 'Twoje imię i nazwisko',
        labelEmail: 'Adres e-mail *',
        placeholderEmail: 'twoj@email.pl',
        labelCompany: 'Firma',
        labelOptional: '(opcjonalnie)',
        placeholderCompany: 'Nazwa Twojej firmy',
        labelSubject: 'Temat *',
        placeholderSubject: 'Czego dotyczy zapytanie?',
        labelMessage: 'Twoje pytanie lub sytuacja *',
        placeholderMessage:
          'Opisz krótko sytuację lub pytanie. Im więcej kontekstu, tym lepiej mogę ocenić, czy i jak mogę pomóc.',
        charsCounter: 'znaków',
        submitButton: 'Wyślij wiadomość',
        submitting: 'Wysyłanie…',
        footerNote: '* Pola wymagane. Twoje dane są traktowane poufnie i nie są udostępniane osobom trzecim.',
        genericError: 'Coś poszło nie tak podczas wysyłania.',
        genericErrorRetry: 'Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na info@daremon.nl',
        defaultSuccess: 'Dziękuję za wiadomość! Odezwę się najszybciej, jak to możliwe.',
      },
    },
  },
  nl: {
    nav: {
      start: 'Start',
      diensten: 'Diensten',
      casussen: 'Case Studies',
      methodiek: 'Methodiek & AI',
      over: 'Over mij',
      contact: 'Contact',
      escHint: 'Druk op ESC om te sluiten',
    },
    footer: {
      rights: 'DAREMON Engineering',
      tagline: 'Gespecialiseerde videomontage, procesanalyse en AI-visualisaties.',
      legal: 'Juridische informatie',
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
      statusBadge: 'SYSTEEM ACTIEF · BESCHIKBAAR 24/7',
      title: 'DAREMON',
      subtitle: 'Engineering — Technische Montage & Procesanalyse',
      lead1: 'Gespecialiseerde videomontage voor de mechanische, industriële en agrarische sector.',
      lead2:
        'Procesanalyse, kinematica van machines, auteursrechtvrije audio en AI-visualisaties — het volledige scala aan technisch materiaal dat ik voor je kan voorbereiden.',
      ctaQuote: 'Vraag een offerte aan',
      ctaPortfolio: 'Bekijk portfolio',
      portfolioHeading: 'Portfolio & Case Studies',
      portfolioLink: 'Alle case studies →',
      processHeading: 'Mijn werkwijze',
      processLink: 'Methodiek en de rol van AI →',
      process: [
        { krok: 'Analyse', opis: 'Ontleding van proces, machine of incident op basis van bronmateriaal en technische documentatie.' },
        { krok: 'Montage', opis: 'Precieze videomontage met eigen soundtrack zonder Content ID-risico en AI-visualisaties.' },
        { krok: 'Levering', opis: 'Materiaal in het formaat dat past bij het gebruik — 16:9 voor documentatie, 9:16 voor social media.' },
      ],
      contactHeading: 'Heb je een proces, machine of incident dat gedocumenteerd moet worden?',
      contactText: 'Beschrijf je project en ik stel een eerste inschatting op voor montage, analyse of visualisatie.',
      contactCta: 'Naar contact',
    },
    diensten: {
      heroTitle: 'Diensten',
      heroLead: 'Gespecialiseerde videomontage en procesanalyse, afgestemd op formaat en doelgroep.',
      items: [
        {
          tytul: 'Montage van mechanische analyses',
          opis: 'Ontleding van een proces, machine of incident op basis van bronmateriaal — heldere 16:9-montage voor technische documentatie en training.',
          bullets: [
            'Synchronisatie met technische documentatie',
            'Vertragingen en annotaties per frame',
            'Versies voor archivering en interne trainingen',
          ],
        },
        {
          tytul: 'Shorts en Reels',
          opis: 'Verkorte, verticale versies van technisch materiaal — voor social media en snelle interne communicatie.',
          bullets: [
            'Formaat 9:16',
            'Ondertitels en markeringen van kernmomenten',
            'Versies voor LinkedIn, Instagram en interne kanalen',
          ],
        },
        {
          tytul: 'AI-visualisaties',
          opis: 'Computergerenderde visualisaties van processen die moeilijk te filmen zijn — stromen, werkzones, simulaties.',
          bullets: [
            'Visualisatie van veiligheidszones en robotbereik',
            'Simulaties van materiaal- en granulaatstroom',
            'Toelichtend materiaal voor klanten en auditors',
          ],
        },
        {
          tytul: 'Audio Lab — eigen soundtrack',
          opis: 'Muziek en geluid vanaf nul opgebouwd — geen Content ID-risico bij publicatie.',
          bullets: [
            'Soundtracks afgestemd op het montagetempo',
            'Volledige rechten voor commercieel gebruik',
            '3D-visualisatie die reageert op geluid — te zien in Audio Lab op de homepage',
          ],
        },
      ],
      ctaHeading: 'Heb je een project dat een offerte nodig heeft?',
      ctaText: 'Beschrijf het proces, de machine of het formaat dat je voor ogen hebt — ik kom met een concreet voorstel.',
      ctaButton: 'Naar contact',
    },
    casussen: {
      heroTitle: 'Case Studies',
      heroLead: 'Een selectie van montage- en analyseprojecten — situatie, bevindingen, resultaat.',
      situationLabel: 'Situatie',
      findingsLabel: 'Bevindingen',
      resultLabel: 'Resultaat',
      items: [
        {
          tytul: 'Diagnose van stilstanden op een MIM-lijn',
          kategoria: 'MIM',
          sytuacja:
            'Een producent van MIM-onderdelen meldde terugkerende, moeilijk te diagnosticeren stilstanden bij één van de vormstappen.',
          ustalenia: [
            'Frame-voor-frame opnames toonden het moment waarop microscheurtjes in de matrijs ontstonden',
            'Vergelijking met procesparameters wees een tijdvenster aan dat verantwoordelijk was voor de meeste storingen',
            'Het materiaal diende het onderhoudsteam als referentie voor het bijstellen van parameters',
          ],
          rezultat: 'Kortere diagnosetijd bij volgende stilstanden en direct bruikbaar trainingsmateriaal voor nieuwe operators.',
        },
        {
          tytul: 'Documentatie van de inbedrijfstelling van een Yaskawa Motoman-cel',
          kategoria: 'Robotica',
          sytuacja:
            'Een systeemintegrator had materiaal nodig om de inbedrijfstelling van een nieuwe robotcel te documenteren — voor technische oplevering en operatorstraining.',
          ustalenia: [
            'Opname van de volledige cyclus met gesynchroniseerde beelden vanuit twee camera\'s',
            'Overgelegde astelemetrie vereenvoudigde de technische oplevering',
            'Het materiaal werd ook gebruikt als onderdeel van het aanbod van de integrator naar andere klanten',
          ],
          rezultat: 'Kortere opleveringstijd en in één keer bruikbaar marketing- en trainingsmateriaal.',
        },
        {
          tytul: 'Analyse van een Arburg-spuitgietcyclus op oppervlaktedefecten',
          kategoria: 'Arburg',
          sytuacja: 'Terugkerende, microscopisch kleine oppervlaktedefecten op spuitgegoten onderdelen, met het blote oog nauwelijks te zien.',
          ustalenia: [
            'Vertraagde macro-opnames toonden het moment waarop het defect ontstond bij de drukomschakeling',
            'Vergelijking met het machineparameterlog beperkte de mogelijke oorzaken tot twee parameters',
            'Een korte versie (short) werd gebruikt om wijzigingen snel af te stemmen met de ploeg',
          ],
          rezultat: 'Minder uitval zonder de lijn stil te leggen voor extra tests.',
        },
        {
          tytul: 'Visualisatie van de werking van een zaai-unit',
          kategoria: 'Agro',
          sytuacja:
            'Een fabrikant van landbouwmachines had toelichtend materiaal nodig om de werking van een zaai-unit uit te leggen aan klanten en distributeurs.',
          ustalenia: [
            'Combinatie van echte beelden met een AI-visualisatie van de doorsnede van het mechanisme',
            'Materiaal geleverd in twee formaten — volledige 16:9-versie en verkorte reel',
            'Distributeurs konden het materiaal zelfstandig gebruiken, zonder extra inzet van de fabrikant',
          ],
          rezultat: 'Eén video verving een meerpagina toelichtende handleiding.',
        },
      ],
      ctaHeading: 'Heb je een vergelijkbaar project?',
      ctaText: 'Beschrijf de situatie — ik laat weten hoe ik de montage of analyse zou aanpakken.',
      ctaButton: 'Naar contact',
    },
    over: {
      heroTitle: 'Over mij',
      heroLead: 'Engineering en videomontage onder één dak.',
      sections: [
        {
          tytul: 'Wie ik ben',
          body:
            'DAREMON Engineering combineert meer dan 15 jaar ervaring in elektrotechniek en industriële automatisering met videomontage en AI-tools. Ik ben begonnen vanuit de overtuiging dat een technisch proces het best wordt verteld door iemand die het ook vanuit technisch oogpunt begrijpt — niet alleen als monteur van beeldmateriaal.',
        },
        {
          tytul: 'Waar die kennis vandaan komt',
          body:
            'Programmeren van Siemens PLC-besturingen, diagnose van Arburg-spuitgietmachines, inbedrijfstelling van Yaskawa Motoman-robots en werken met MIM-technologie — dat technische fundament stelt mij in staat het bronmateriaal te begrijpen voordat ik begin te monteren, niet alleen het mooi aan elkaar te knippen.',
        },
        {
          tytul: 'Waarom video en AI',
          body:
            'Sommige industriële processen zijn moeilijk in woorden te vatten of met het blote oog te zien — de kinematica van een robot, een microscheurtje in een matrijs, de stroom van granulaat. Videomontage en AI-visualisaties tonen wat anders alleen in tekstuele documentatie zou blijven staan.',
        },
        {
          tytul: 'Waar de naam DAREMON vandaan komt',
          body:
            'De naam verwijst naar "daemon" — een achtergrondproces dat een systeem draaiende houdt. Precies zo zie ik mijn rol: ik documenteer en analyseer de processen die de productie aandrijven, ook als die meestal onzichtbaar blijven.',
        },
      ],
      ctaHeading: 'Wil je over een project praten?',
      ctaText: 'Laat weten waar je mee bezig bent en wat je wilt laten zien — ik reageer met concrete opties.',
      ctaButton: 'Naar contact',
    },
    methodiek: {
      heroTitle: 'Methodiek & AI',
      heroLead: 'Hoe ik technische analyse, montage en AI-tools combineer tot betrouwbaar en helder materiaal.',
      tabProcess: 'Mijn werkwijze',
      tabAi: 'Rol van AI',
      processHeading: 'Hoe ik werk',
      processSteps: [
        {
          tytul: 'Briefing en analyse van bronmateriaal',
          opis: 'Ik bekijk het bronmateriaal en de technische documentatie om het proces te begrijpen voordat ik ga monteren.',
        },
        {
          tytul: 'Montage en synchronisatie',
          opis: 'Ik monteer met oog voor procesparameters en documentatie — zodat beeld en data kloppen.',
        },
        {
          tytul: 'Visualisatie en geluid',
          opis: 'Waar zinvol voeg ik AI-visualisaties toe en een eigen soundtrack zonder Content ID-risico.',
        },
        {
          tytul: 'Levering en nazorg',
          opis: 'Het materiaal wordt geleverd in het gewenste formaat, met ruimte voor correcties na de eerste review.',
        },
      ],
      aiHeading: 'Waar AI mij echt helpt',
      aiIntro:
        'AI is een hulpmiddel, geen auteur van het materiaal. Ik zet het in voor specifieke, afgebakende taken — montagebeslissingen en interpretatie van het proces blijven altijd bij mij.',
      aiPoints: [
        {
          tytul: '3D-visualisaties',
          opis: 'De Three.js-engine helpt werkzones, trajecten en stromen te tonen die lastig te filmen zijn.',
        },
        {
          tytul: 'Eigen audio',
          opis: 'Generatieve tools ondersteunen het componeren van soundtracks zonder Content ID-claims.',
        },
        {
          tytul: 'Eerste selectie van materiaal',
          opis: 'Bij lange bronopnames helpt AI momenten aan te wijzen die nadere analyse verdienen — de uiteindelijke keuze blijft aan de monteur.',
        },
      ],
      ctaHeading: 'Vragen over mijn methodiek?',
      ctaText: 'Ik licht graag toe hoe ik jouw materiaal zou aanpakken.',
      ctaButton: 'Naar contact',
    },
    contact: {
      heroTitle: 'Contact',
      heroLead: 'Vraag een vrijblijvende offerte aan voor montage, analyse of visualisatie.',
      aboutHeading: 'Over dit contact',
      aboutText:
        'Beschrijf je project — een machine, proces of incident dat gedocumenteerd of geanalyseerd moet worden — en ik neem contact op met een concreet voorstel.',
      expectHeading: 'Wat kun je verwachten?',
      expectItems: [
        'Een reactie met een eerste inschatting van aanpak en levertijd',
        'Een vrijblijvende offerte op maat van je sector (PLC, Arburg, robotica, MIM, agro)',
        'Reactie binnen enkele werkdagen',
      ],
      emailHeading: 'E-mail',
      emailIntro: 'Voor offertes en zakelijke vragen:',
      emailLabel: 'E-mail:',
      formHeading: 'Stuur een aanvraag',
      faqHeading: 'Veelgestelde vragen',
      faqWhatQ: 'Wat doet DAREMON Engineering?',
      faqWhatA:
        'Gespecialiseerde technische videomontage, procesanalyse en AI-visualisaties voor de mechanische, industriële en agrarische sector.',
      faqProcessQ: 'Hoe ziet het proces eruit?',
      faqProcessABefore:
        'Analyse van het bronmateriaal, montage met eigen audio en eventuele AI-visualisatie, en levering in het formaat dat past bij het gebruik — zie de sectie ',
      faqProcessLinkText: 'Methodiek & AI',
      faqProcessAAfter: ' op de homepage.',
      faqWhyQ: 'Waarvoor kan ik contact opnemen?',
      faqWhyA:
        'Voor offerteaanvragen, vragen over een lopend project, of een eerste kennismaking voordat je een opdracht vastlegt.',
      form: {
        labelName: 'Naam *',
        placeholderName: 'Uw naam',
        labelEmail: 'E-mailadres *',
        placeholderEmail: 'uw@email.nl',
        labelCompany: 'Bedrijf',
        labelOptional: '(optioneel)',
        placeholderCompany: 'Naam van uw bedrijf',
        labelSubject: 'Onderwerp *',
        placeholderSubject: 'Waar gaat het over?',
        labelMessage: 'Uw vraag of situatie *',
        placeholderMessage:
          'Beschrijf kort uw situatie of vraag. Hoe meer context, hoe beter ik kan inschatten of en hoe ik kan helpen.',
        charsCounter: 'tekens',
        submitButton: 'Verstuur bericht',
        submitting: 'Bezig met verzenden…',
        footerNote: '* Verplichte velden. Uw gegevens worden vertrouwelijk behandeld en niet gedeeld met derden.',
        genericError: 'Er is iets misgegaan bij het verzenden.',
        genericErrorRetry: 'Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via info@daremon.nl',
        defaultSuccess: 'Bedankt voor uw bericht! Ik neem zo snel mogelijk contact met u op.',
      },
    },
  },
} as const satisfies Record<Language, unknown>

export type Translations = (typeof translations)[Language]

export function useT(): Translations {
  const { language } = useLanguage()
  return translations[language]
}
