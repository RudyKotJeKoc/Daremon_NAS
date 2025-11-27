import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Methodiek & AI – Daremon',
  description: 'Hoe wij data, AI-modellen en praktijkervaring combineren om tot een helder beeld van een systeem te komen.',
}

export default function MethodiekPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Methodiek & AI</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Hoe wij data, AI-modellen en praktijkervaring combineren om tot een helder beeld van een
          systeem te komen.
        </p>

        {/* Kernprincipes */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-6">Onze aanpak</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Elk complex systeem vraagt om een mix van technische kennis, kritische analyse en
            praktische ervaring. Wij werken niet met standaard-checklists, maar met een flexibele
            methodiek die zich aanpast aan de situatie.
          </p>

          <div className="space-y-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">1. Systeemdenken</h3>
              <p className="text-muted-foreground">
                We benaderen problemen als onderdelen van grotere systemen. Een "simpele" storing
                kan voortkomen uit organisatiecultuur, verouderde procedures of verkeerde prikkels.
                We zoeken naar de werkelijke oorzaken, niet de symptomen.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">2. Data-gedreven maar niet data-blind</h3>
              <p className="text-muted-foreground">
                Data is waardevol, maar vertelt niet het hele verhaal. We combineren kwantitatieve
                analyses met kwalitatief onderzoek: interviews, observaties, documentanalyse.
                Wat zeggen de cijfers? En wat zeggen de mensen die met het systeem werken?
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">3. Kritische blik op macht en belangen</h3>
              <p className="text-muted-foreground">
                Elk systeem heeft stakeholders met verschillende belangen. Wij vragen niet alleen
                "hoe werkt dit?", maar ook "voor wie werkt dit?" en "wie profiteert van de huidige
                situatie?". Dat maakt onze analyses scherper en realistischer.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">4. Praktische uitvoerbaarheid</h3>
              <p className="text-muted-foreground">
                Een analyse is pas nuttig als hij leidt tot actie. Onze aanbevelingen zijn
                realistisch, rekening houdend met organisatiecultuur, budgetten en politieke
                realiteit. Geen utopische plannen, maar concrete stappen.
              </p>
            </div>
          </div>
        </section>

        {/* AI & Tools */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-6">De rol van AI</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            AI is een krachtig instrument, maar geen wondermiddel. Wij gebruiken AI-tools op
            specifieke punten in ons analyseproces – altijd onder menselijke controle en met
            een kritische blik.
          </p>

          <h3 className="text-xl font-semibold mb-4">Waar wij AI inzetten:</h3>

          <div className="space-y-6 mb-8">
            <div>
              <h4 className="font-semibold mb-2">📊 Data-analyse en patroonherkenning</h4>
              <p className="text-muted-foreground">
                Bij grote datasets (onderhoudslogboeken, processtappen, communicatie) gebruiken
                we AI om patronen te ontdekken die anders niet opvallen. Bijvoorbeeld: "waarom
                vallen machines vaker uit op dinsdagen?" of "welke combinatie van factoren leidt
                tot vertraging?".
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">📝 Tekstanalyse en discoursonderzoek</h4>
              <p className="text-muted-foreground">
                Bij narratieve analyses scannen we grote hoeveelheden tekst (beleidsdocumenten,
                nieuwsartikelen, social media) om te zien welke frames en begrippen dominant zijn.
                AI helpt bij de eerste scan, wij doen de interpretatie.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🔍 Scenarioanalyse en simulatie</h4>
              <p className="text-muted-foreground">
                Bij strategisch advies kunnen we AI gebruiken om te simuleren wat er gebeurt als
                bepaalde variabelen veranderen. "Wat als we onderhoudsintervallen verdubbelen?"
                of "Wat als dit beleid landelijk wordt uitgerold?".
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">💡 Kennisassistentie en literatuuronderzoek</h4>
              <p className="text-muted-foreground">
                AI-tools helpen ons snel relevante wetenschappelijke literatuur, technische normen
                en best practices te vinden. Dit bespaart tijd en zorgt ervoor dat we geen
                belangrijke bronnen missen.
              </p>
            </div>
          </div>

          <div className="p-6 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">⚠️ Wat AI niet doet</h4>
            <p className="text-muted-foreground mb-3">
              AI levert geen kant-en-klare oplossingen. Het geeft signalen, suggesties en
              patronen – maar de interpretatie, afweging en uiteindelijke conclusies komen van
              menselijke analisten met domeinkennis en kritisch vermogen.
            </p>
            <p className="text-muted-foreground">
              Wij geloven niet in "black box" AI. Als we een AI-tool gebruiken, kunnen we
              uitleggen waarom en hoe, en we nemen de verantwoordelijkheid voor de conclusies.
            </p>
          </div>
        </section>

        {/* AI Ecosysteem */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-6">Ons AI-ecosysteem</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            We gebruiken verschillende AI-tools voor verschillende taken. Elk model heeft zijn eigen
            sterke punten en wordt ingezet waar het het meest effectief is. Hieronder een overzicht
            van ons volledige AI-ecosysteem.
          </p>

          <div className="space-y-6 mb-12">
            {/* ChatGPT */}
            <div className="p-6 border-2 border-primary rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h3 className="text-xl font-bold text-primary">ChatGPT — Analyse, Logica, Documenten, Strategie</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rola: mózg główny</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                <strong>Styl:</strong> racjonalny, precyzyjny, technisch
              </p>
              <div>
                <p className="font-semibold mb-2">Zastosowania:</p>
                <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                  <li>Analiza prawna / psychologiczna / instytucjonalna</li>
                  <li>Raporty dla psychologa</li>
                  <li>Dokumenty formalne, pisma, petycje, odwołania</li>
                  <li>Analiza absurdów w pracy</li>
                  <li>Spójność narracji w projektach (Daremon, Polana Kłamstw)</li>
                  <li>Zaawansowana elektronika, automatyka, embedded (ESP, czujniki, roboty)</li>
                  <li>Projektowanie systemów</li>
                  <li>Tworzenie promptów</li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic text-primary">
                Cel: najważniejszy model do decyzji i analizy
              </p>
            </div>

            {/* Claude */}
            <div className="p-6 border-2 border-blue-500 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">✍️</span>
                <div>
                  <h3 className="text-xl font-bold text-blue-600">Claude — Redakcja, Humanistyczny Ton, Empatyczność</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rola: redaktor elegancki, dyplomata</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                <strong>Styl:</strong> miękki, ludzki, inteligentny
              </p>
              <div>
                <p className="font-semibold mb-2">Zastosowania:</p>
                <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                  <li>Wygładzanie maili i tekstów społecznie wrażliwych</li>
                  <li>Dopisanie „ludzkiej" warstwy do twardego dokumentu</li>
                  <li>Narracje symboliczne, psychologiczne, literackie</li>
                  <li>Dyplomatyczne wersje wiadomości</li>
                  <li>Upraszczanie treści dla odbiorców o niższej percepcji</li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic text-blue-600">
                Cel: PR wewnętrzny i zewnętrzny
              </p>
            </div>

            {/* Grok */}
            <div className="p-6 border-2 border-red-500 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="text-xl font-bold text-red-600">Grok — Ironia, Sarkazm, Detektor Absurdu</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rola: czarne lustro, analizator nonsensów</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                <strong>Styl:</strong> cięty, dosadny, kontrolowana bezczelność
              </p>
              <div>
                <p className="font-semibold mb-2">Zastosowania:</p>
                <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                  <li>Ostra analiza absurdów w pracy, instytucjach</li>
                  <li>„Druga wersja" maili — brutalnie szczera</li>
                  <li>Memy, satyra, humor, alternatywne dramatyczne narracje</li>
                  <li>Wyłapywanie logicznych fałszów, manipulacji</li>
                  <li>Łamanie hipokryzji i narracji</li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic text-red-600">
                Cel: prawda bez filtra, wersje „B – tylko do wglądu"
              </p>
            </div>

            {/* Gemini */}
            <div className="p-6 border-2 border-purple-500 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🔷</span>
                <div>
                  <h3 className="text-xl font-bold text-purple-600">Gemini — Systemy, Warianty, Struktury, Plany</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rola: architekt alternatyw i szerokich analiz</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                <strong>Styl:</strong> neutralny, syntetyczny, systemowy
              </p>
              <div>
                <p className="font-semibold mb-2">Zastosowania:</p>
                <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                  <li>Generowanie wariantów projektów (A/B/C/D)</li>
                  <li>Mapowanie dużych zbiorów danych (czaty, projekty)</li>
                  <li>Budowa struktur, diagramów, workflow</li>
                  <li>Analiza szeroka (całe środowisko, przebiegi decyzji, scenariusze)</li>
                  <li>Brainstorming techniczny i organizacyjny</li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic text-purple-600">
                Cel: architekt systemów i strategii
              </p>
            </div>

            {/* NotebookLM */}
            <div className="p-6 border-2 border-amber-500 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="text-xl font-bold text-amber-600">NotebookLM — Analiza Długich Dokumentów, Archiwum, Memory OS</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rola: narzędzie do przetwarzania dużych i wielu dokumentów naraz</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                <strong>Styl:</strong> encyklopedyczno-analityczny
              </p>
              <div>
                <p className="font-semibold mb-2">Zastosowania:</p>
                <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                  <li>Analiza akt spraw (cywilna, karna, historia rodzinna)</li>
                  <li>Analiza korespondencji, umów, plików PDF</li>
                  <li>„Repozytorium pamięci" — pliki i notatki</li>
                  <li>Generowanie spójnych podsumowań i powiązań</li>
                  <li>Odciążenie od przeglądania setek stron akt</li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic text-amber-600">
                Cel: czytnik pamięci i archiwum
              </p>
            </div>

            {/* GitHub Copilot */}
            <div className="p-6 border-2 border-slate-600 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">💻</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-700">GitHub Copilot — Kod, Algorytmy, Architektura Oprogramowania</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rola: współprogramista i generator kodu</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                <strong>Styl:</strong> szybki, kod-centric
              </p>
              <div>
                <p className="font-semibold mb-2">Zastosowania:</p>
                <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                  <li>Kod do ESP/Arduino/ESPHome</li>
                  <li>Kod do Raspberry Pi (Python)</li>
                  <li>Next.js / React / Node.js</li>
                  <li>Generowanie backendów, integracji API</li>
                  <li>Analiza błędów, linting, refaktoryzacja</li>
                  <li>Prototypy ML/AI</li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic text-slate-600">
                Cel: maszyna do pisania kodu i prototypów
              </p>
            </div>

            {/* ElevenLabs */}
            <div className="p-6 border-2 border-green-500 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🎙️</span>
                <div>
                  <h3 className="text-xl font-bold text-green-600">ElevenLabs — Głos, Komunikaty, Narrator Systemu</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rola: generator audio i osobowości głosowych</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                <strong>Styl:</strong> dowolny — naturalny, neutralny, dramatyczny, szeptany
              </p>
              <div>
                <p className="font-semibold mb-2">Zastosowania:</p>
                <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                  <li>Komunikaty dla systemów domowych (Home Assistant / Echo Unit)</li>
                  <li>Dźwięki dla inteligentnego dzwonka</li>
                  <li>Głosy narracyjne do projektów</li>
                  <li>Synteza postaci AI (np. głos Daremon)</li>
                  <li>Generowanie komunikatów "inteligentnych" do eksperymentów</li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic text-green-600">
                Cel: warstwa dźwiękowa ekosystemu
              </p>
            </div>

            {/* Suno */}
            <div className="p-6 border-2 border-pink-500 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🎵</span>
                <div>
                  <h3 className="text-xl font-bold text-pink-600">Suno — Muzyka, Podkłady, Efekty, Humor</h3>
                  <p className="text-sm font-semibold text-muted-foreground">Rola: kompozytor i generator audio kreatywnego</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-3">
                <strong>Styl:</strong> muzyczny, dowolny gatunek
              </p>
              <div>
                <p className="font-semibold mb-2">Zastosowania:</p>
                <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                  <li>Podkłady do filmów i systemów monitoringowych</li>
                  <li>Piosenki satyryczne</li>
                  <li>Melodie do projektów (Echo Unit, lampka, wibracje)</li>
                  <li>Krótkie sygnały dźwiękowe (status maszyny: idle / error / run)</li>
                  <li>Humorystyczne piosenki do memów</li>
                </ul>
              </div>
              <p className="mt-3 text-sm italic text-pink-600">
                Cel: audio kreatywne i „podkłady świata Daremon"
              </p>
            </div>
          </div>

          {/* Szybka mapa */}
          <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20">
            <h3 className="text-2xl font-bold mb-6 text-center">Zbiorcza mapa – „Kto do czego"</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3 items-start">
                <span className="text-lg">🧠</span>
                <div>
                  <strong className="text-primary">ChatGPT:</strong> analiza, dokumenty, logika, strategia
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg">✍️</span>
                <div>
                  <strong className="text-blue-600">Claude:</strong> redakcja, ludzki ton, dyplomacja
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg">⚡</span>
                <div>
                  <strong className="text-red-600">Grok:</strong> sarkazm, krytyka, demontaż absurdów
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg">🔷</span>
                <div>
                  <strong className="text-purple-600">Gemini:</strong> warianty, struktury, architektury
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg">📚</span>
                <div>
                  <strong className="text-amber-600">NotebookLM:</strong> analiza plików, akta, pamięć projektu
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg">💻</span>
                <div>
                  <strong className="text-slate-600">Copilot:</strong> kod, algorytmy, automatyka programistyczna
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg">🎙️</span>
                <div>
                  <strong className="text-green-600">ElevenLabs:</strong> głos, komunikaty
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg">🎵</span>
                <div>
                  <strong className="text-pink-600">Suno:</strong> muzyka, podkłady, humor, dźwięki systemowe
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proces */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Ons proces</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Elk project is anders, maar over het algemeen volgen we deze stappen:
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Intake en probleemdefiniëring</h3>
                <p className="text-muted-foreground">
                  Wat is het probleem? Wat is de context? Wie zijn de stakeholders? We stellen
                  veel vragen om het werkelijke probleem te begrijpen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Dataverzameling en verkenning</h3>
                <p className="text-muted-foreground">
                  We verzamelen relevante data: documenten, datasets, interviews, observaties.
                  We kijken breed, want vaak zit de oplossing op een onverwachte plek.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analyse en synthese</h3>
                <p className="text-muted-foreground">
                  We analyseren de data, ontleden het systeem en zoeken naar patronen, zwakke
                  punten en kansen. Dit is waar AI-tools kunnen helpen, maar altijd onder
                  menselijke regie.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Rapportage en advies</h3>
                <p className="text-muted-foreground">
                  We leveren een helder rapport met bevindingen en aanbevelingen. Geen jargon,
                  geen onnodige bulk. Alleen wat u nodig heeft om verder te komen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold mb-1">Implementatieondersteuning (optioneel)</h3>
                <p className="text-muted-foreground">
                  Op verzoek kunnen we helpen bij de implementatie van aanbevelingen, of
                  aanvullende analyses doen als de situatie verandert.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-12 border-t">
          <h2 className="text-2xl font-bold mb-4">Vragen over onze aanpak?</h2>
          <p className="text-muted-foreground mb-6">
            Neem contact op voor meer informatie over hoe wij werken.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Neem contact op
          </Link>
        </section>
      </div>
    </div>
  )
}
