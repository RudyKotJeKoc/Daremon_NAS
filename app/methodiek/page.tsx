import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Methodiek & AI – Daremon',
  description: 'Hoe wij data, AI-modellen en praktijkervaring combineren om tot een helder beeld van een systeem te komen.',
}

export default function MethodiekPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Methodiek & AI</h1>
          <p className="text-xl text-cyan-400 font-light">
            Hoe wij data, AI-modellen en praktijkervaring combineren om tot een helder beeld van een
            systeem te komen.
          </p>
        </div>

        {/* Kernprincipes */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Onze aanpak
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              Elk complex systeem vraagt om een mix van technische kennis, kritische analyse en
              praktische ervaring. Wij werken niet met standaard-checklists, maar met een flexibele
              methodiek die zich aanpast aan de situatie.
            </p>

            <div className="space-y-6">
              <div className="border border-cyan-500/20 rounded-lg p-6 bg-slate-900/40">
                <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">1.</span>
                  Systeemdenken
                </h3>
                <p className="text-slate-300">
                  We benaderen problemen als onderdelen van grotere systemen. Een "simpele" storing
                  kan voortkomen uit organisatiecultuur, verouderde procedures of verkeerde prikkels.
                  We zoeken naar de werkelijke oorzaken, niet de symptomen.
                </p>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-6 bg-slate-900/40">
                <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">2.</span>
                  Data-gedreven maar niet data-blind
                </h3>
                <p className="text-slate-300">
                  Data is waardevol, maar vertelt niet het hele verhaal. We combineren kwantitatieve
                  analyses met kwalitatief onderzoek: interviews, observaties, documentanalyse.
                  Wat zeggen de cijfers? En wat zeggen de mensen die met het systeem werken?
                </p>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-6 bg-slate-900/40">
                <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">3.</span>
                  Kritische blik op macht en belangen
                </h3>
                <p className="text-slate-300">
                  Elk systeem heeft stakeholders met verschillende belangen. Wij vragen niet alleen
                  "hoe werkt dit?", maar ook "voor wie werkt dit?" en "wie profiteert van de huidige
                  situatie?". Dat maakt onze analyses scherper en realistischer.
                </p>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-6 bg-slate-900/40">
                <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">4.</span>
                  Praktische uitvoerbaarheid
                </h3>
                <p className="text-slate-300">
                  Een analyse is pas nuttig als hij leidt tot actie. Onze aanbevelingen zijn
                  realistisch, rekening houdend met organisatiecultuur, budgetten en politieke
                  realiteit. Geen utopische plannen, maar concrete stappen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI & Tools */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              De rol van AI
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              AI is een krachtig instrument, maar geen wondermiddel. Wij gebruiken AI-tools op
              specifieke punten in ons analyseproces – altijd onder menselijke controle en met
              een kritische blik.
            </p>

            <h3 className="text-xl font-semibold text-slate-100 mb-4">Waar wij AI inzetten:</h3>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">📊 Data-analyse en patroonherkenning</h4>
                <p className="text-slate-300">
                  Bij grote datasets (onderhoudslogboeken, processtappen, communicatie) gebruiken
                  we AI om patronen te ontdekken die anders niet opvallen. Bijvoorbeeld: "waarom
                  vallen machines vaker uit op dinsdagen?" of "welke combinatie van factoren leidt
                  tot vertraging?".
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">📝 Tekstanalyse en discoursonderzoek</h4>
                <p className="text-slate-300">
                  Bij narratieve analyses scannen we grote hoeveelheden tekst (beleidsdocumenten,
                  nieuwsartikelen, social media) om te zien welke frames en begrippen dominant zijn.
                  AI helpt bij de eerste scan, wij doen de interpretatie.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">🔍 Scenarioanalyse en simulatie</h4>
                <p className="text-slate-300">
                  Bij strategisch advies kunnen we AI gebruiken om te simuleren wat er gebeurt als
                  bepaalde variabelen veranderen. "Wat als we onderhoudsintervallen verdubbelen?"
                  of "Wat als dit beleid landelijk wordt uitgerold?".
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-cyan-400 mb-2">💡 Kennisassistentie en literatuuronderzoek</h4>
                <p className="text-slate-300">
                  AI-tools helpen ons snel relevante wetenschappelijke literatuur, technische normen
                  en best practices te vinden. Dit bespaart tijd en zorgt ervoor dat we geen
                  belangrijke bronnen missen.
                </p>
              </div>
            </div>

            <div className="border border-cyan-500/20 rounded-lg p-6 bg-slate-900/40">
              <h4 className="font-semibold text-slate-100 mb-2">⚠️ Wat AI niet doet</h4>
              <p className="text-slate-300 mb-3">
                AI levert geen kant-en-klare oplossingen. Het geeft signalen, suggesties en
                patronen – maar de interpretatie, afweging en uiteindelijke conclusies komen van
                menselijke analisten met domeinkennis en kritisch vermogen.
              </p>
              <p className="text-slate-300">
                Wij geloven niet in "black box" AI. Als we een AI-tool gebruiken, kunnen we
                uitleggen waarom en hoe, en we nemen de verantwoordelijkheid voor de conclusies.
              </p>
            </div>
          </div>
        </section>

        {/* AI Ecosysteem */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Ons AI-ecosysteem
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              We gebruiken verschillende AI-tools voor verschillende taken. Elk model heeft zijn eigen
              sterke punten en wordt ingezet waar het het meest effectief is. Hieronder een overzicht
              van ons volledige AI-ecosysteem.
            </p>

            <div className="space-y-6 mb-12">
              {/* ChatGPT */}
              <div className="border-2 border-cyan-500/50 rounded-lg p-6 bg-slate-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400">ChatGPT — Analyse, Logica, Documenten, Strategie</h3>
                    <p className="text-sm font-semibold text-slate-400">Rola: mózg główny</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-3">
                  <strong>Styl:</strong> racjonalny, precyzyjny, techniczny
                </p>
                <div>
                  <p className="font-semibold text-slate-100 mb-2">Zastosowania:</p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>
                      <span>Analiza prawna / psychologiczna / instytucjonalna</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>
                      <span>Raporty dla psychologa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>
                      <span>Dokumenty formalne, pisma, petycje, odwołania</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>
                      <span>Analiza absurdów w pracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>
                      <span>Spójność narracji w projektach (Daremon, Polana Kłamstw)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>
                      <span>Zaawansowana elektronika, automatyka, embedded (ESP, czujniki, roboty)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>
                      <span>Projektowanie systemów</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 flex-shrink-0">▸</span>
                      <span>Tworzenie promptów</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-3 text-sm italic text-cyan-400">
                  Cel: najważniejszy model do decyzji i analizy
                </p>
              </div>

              {/* Claude */}
              <div className="border-2 border-blue-500/50 rounded-lg p-6 bg-slate-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">✍️</span>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400">Claude — Redakcja, Humanistyczny Ton, Empatyczność</h3>
                    <p className="text-sm font-semibold text-slate-400">Rola: redaktor elegancki, dyplomata</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-3">
                  <strong>Styl:</strong> miękki, ludzki, inteligentny
                </p>
                <div>
                  <p className="font-semibold text-slate-100 mb-2">Zastosowania:</p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 flex-shrink-0">▸</span>
                      <span>Wygładzanie maili i tekstów społecznie wrażliwych</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 flex-shrink-0">▸</span>
                      <span>Dopisanie „ludzkiej" warstwy do twardego dokumentu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 flex-shrink-0">▸</span>
                      <span>Narracje symboliczne, psychologiczne, literackie</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 flex-shrink-0">▸</span>
                      <span>Dyplomatyczne wersje wiadomości</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 flex-shrink-0">▸</span>
                      <span>Upraszczanie treści dla odbiorców o niższej percepcji</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-3 text-sm italic text-blue-400">
                  Cel: PR wewnętrzny i zewnętrzny
                </p>
              </div>

              {/* Grok */}
              <div className="border-2 border-red-500/50 rounded-lg p-6 bg-slate-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="text-xl font-bold text-red-400">Grok — Ironia, Sarkazm, Detektor Absurdu</h3>
                    <p className="text-sm font-semibold text-slate-400">Rola: czarne lustro, analizator nonsensów</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-3">
                  <strong>Styl:</strong> cięty, dosadny, kontrolowana bezczelność
                </p>
                <div>
                  <p className="font-semibold text-slate-100 mb-2">Zastosowania:</p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">▸</span>
                      <span>Ostra analiza absurdów w pracy, instytucjach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">▸</span>
                      <span>„Druga wersja" maili — brutalnie szczera</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">▸</span>
                      <span>Memy, satyra, humor, alternatywne dramatyczne narracje</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">▸</span>
                      <span>Wyłapywanie logicznych fałszów, manipulacji</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">▸</span>
                      <span>Łamanie hipokryzji i narracji</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-3 text-sm italic text-red-400">
                  Cel: prawda bez filtra, wersje „B – tylko do wglądu"
                </p>
              </div>

              {/* Gemini */}
              <div className="border-2 border-purple-500/50 rounded-lg p-6 bg-slate-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">🔷</span>
                  <div>
                    <h3 className="text-xl font-bold text-purple-400">Gemini — Systemy, Warianty, Struktury, Plany</h3>
                    <p className="text-sm font-semibold text-slate-400">Rola: architekt alternatyw i szerokich analiz</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-3">
                  <strong>Styl:</strong> neutralny, syntetyczny, systemowy
                </p>
                <div>
                  <p className="font-semibold text-slate-100 mb-2">Zastosowania:</p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">▸</span>
                      <span>Generowanie wariantów projektów (A/B/C/D)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">▸</span>
                      <span>Mapowanie dużych zbiorów danych (czaty, projekty)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">▸</span>
                      <span>Budowa struktur, diagramów, workflow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">▸</span>
                      <span>Analiza szeroka (całe środowisko, przebiegi decyzji, scenariusze)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 flex-shrink-0">▸</span>
                      <span>Brainstorming techniczny i organizacyjny</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-3 text-sm italic text-purple-400">
                  Cel: architekt systemów i strategii
                </p>
              </div>

              {/* NotebookLM */}
              <div className="border-2 border-amber-500/50 rounded-lg p-6 bg-slate-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h3 className="text-xl font-bold text-amber-400">NotebookLM — Analiza Długich Dokumentów, Archiwum, Memory OS</h3>
                    <p className="text-sm font-semibold text-slate-400">Rola: narzędzie do przetwarzania dużych i wielu dokumentów naraz</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-3">
                  <strong>Styl:</strong> encyklopedyczno-analityczny
                </p>
                <div>
                  <p className="font-semibold text-slate-100 mb-2">Zastosowania:</p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 flex-shrink-0">▸</span>
                      <span>Analiza akt spraw (cywilna, karna, historia rodzinna)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 flex-shrink-0">▸</span>
                      <span>Analiza korespondencji, umów, plików PDF</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 flex-shrink-0">▸</span>
                      <span>„Repozytorium pamięci" — pliki i notatki</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 flex-shrink-0">▸</span>
                      <span>Generowanie spójnych podsumowań i powiązań</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 flex-shrink-0">▸</span>
                      <span>Odciążenie od przeglądania setek stron akt</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-3 text-sm italic text-amber-400">
                  Cel: czytnik pamięci i archiwum
                </p>
              </div>

              {/* GitHub Copilot */}
              <div className="border-2 border-slate-500/50 rounded-lg p-6 bg-slate-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">💻</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-300">GitHub Copilot — Kod, Algorytmy, Architektura Oprogramowania</h3>
                    <p className="text-sm font-semibold text-slate-400">Rola: współprogramista i generator kodu</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-3">
                  <strong>Styl:</strong> szybki, kod-centric
                </p>
                <div>
                  <p className="font-semibold text-slate-100 mb-2">Zastosowania:</p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 flex-shrink-0">▸</span>
                      <span>Kod do ESP/Arduino/ESPHome</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 flex-shrink-0">▸</span>
                      <span>Kod do Raspberry Pi (Python)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 flex-shrink-0">▸</span>
                      <span>Next.js / React / Node.js</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 flex-shrink-0">▸</span>
                      <span>Generowanie backendów, integracji API</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 flex-shrink-0">▸</span>
                      <span>Analiza błędów, linting, refaktoryzacja</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 flex-shrink-0">▸</span>
                      <span>Prototypy ML/AI</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-3 text-sm italic text-slate-400">
                  Cel: maszyna do pisania kodu i prototypów
                </p>
              </div>

              {/* ElevenLabs */}
              <div className="border-2 border-green-500/50 rounded-lg p-6 bg-slate-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <h3 className="text-xl font-bold text-green-400">ElevenLabs — Głos, Komunikaty, Narrator Systemu</h3>
                    <p className="text-sm font-semibold text-slate-400">Rola: generator audio i osobowości głosowych</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-3">
                  <strong>Styl:</strong> dowolny — naturalny, neutralny, dramatyczny, szeptany
                </p>
                <div>
                  <p className="font-semibold text-slate-100 mb-2">Zastosowania:</p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0">▸</span>
                      <span>Komunikaty dla systemów domowych (Home Assistant / Echo Unit)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0">▸</span>
                      <span>Dźwięki dla inteligentnego dzwonka</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0">▸</span>
                      <span>Głosy narracyjne do projektów</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0">▸</span>
                      <span>Synteza postaci AI (np. głos Daremon)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0">▸</span>
                      <span>Generowanie komunikatów "inteligentnych" do eksperymentów</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-3 text-sm italic text-green-400">
                  Cel: warstwa dźwiękowa ekosystemu
                </p>
              </div>

              {/* Suno */}
              <div className="border-2 border-pink-500/50 rounded-lg p-6 bg-slate-900/60">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">🎵</span>
                  <div>
                    <h3 className="text-xl font-bold text-pink-400">Suno — Muzyka, Podkłady, Efekty, Humor</h3>
                    <p className="text-sm font-semibold text-slate-400">Rola: kompozytor i generator audio kreatywnego</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-3">
                  <strong>Styl:</strong> muzyczny, dowolny gatunek
                </p>
                <div>
                  <p className="font-semibold text-slate-100 mb-2">Zastosowania:</p>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 flex-shrink-0">▸</span>
                      <span>Podkłady do filmów i systemów monitoringowych</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 flex-shrink-0">▸</span>
                      <span>Piosenki satyryczne</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 flex-shrink-0">▸</span>
                      <span>Melodie do projektów (Echo Unit, lampka, wibracje)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 flex-shrink-0">▸</span>
                      <span>Krótkie sygnały dźwiękowe (status maszyny: idle / error / run)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 flex-shrink-0">▸</span>
                      <span>Humorystyczne piosenki do memów</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-3 text-sm italic text-pink-400">
                  Cel: audio kreatywne i „podkłady świata Daremon"
                </p>
              </div>
            </div>

            {/* Szybka mapa */}
            <div className="border border-cyan-500/30 rounded-lg p-8 bg-slate-900/40 backdrop-blur-md">
              <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center">Zbiorcza mapa – „Kto do czego"</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex gap-3 items-start">
                  <span className="text-lg">🧠</span>
                  <div>
                    <strong className="text-cyan-400">ChatGPT:</strong> <span className="text-slate-300">analiza, dokumenty, logika, strategia</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-lg">✍️</span>
                  <div>
                    <strong className="text-blue-400">Claude:</strong> <span className="text-slate-300">redakcja, ludzki ton, dyplomacja</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-lg">⚡</span>
                  <div>
                    <strong className="text-red-400">Grok:</strong> <span className="text-slate-300">sarkazm, krytyka, demontaż absurdów</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-lg">🔷</span>
                  <div>
                    <strong className="text-purple-400">Gemini:</strong> <span className="text-slate-300">warianty, struktury, architektury</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-lg">📚</span>
                  <div>
                    <strong className="text-amber-400">NotebookLM:</strong> <span className="text-slate-300">analiza plików, akta, pamięć projektu</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-lg">💻</span>
                  <div>
                    <strong className="text-slate-400">Copilot:</strong> <span className="text-slate-300">kod, algorytmy, automatyka programistyczna</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-lg">🎙️</span>
                  <div>
                    <strong className="text-green-400">ElevenLabs:</strong> <span className="text-slate-300">głos, komunikaty</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-lg">🎵</span>
                  <div>
                    <strong className="text-pink-400">Suno:</strong> <span className="text-slate-300">muzyka, podkłady, humor, dźwięki systemowe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proces */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Ons proces
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              Elk project is anders, maar over het algemeen volgen we deze stappen:
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-600 text-black flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Intake en probleemdefiniëring</h3>
                  <p className="text-slate-300">
                    Wat is het probleem? Wat is de context? Wie zijn de stakeholders? We stellen
                    veel vragen om het werkelijke probleem te begrijpen.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-600 text-black flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Dataverzameling en verkenning</h3>
                  <p className="text-slate-300">
                    We verzamelen relevante data: documenten, datasets, interviews, observaties.
                    We kijken breed, want vaak zit de oplossing op een onverwachte plek.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-600 text-black flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Analyse en synthese</h3>
                  <p className="text-slate-300">
                    We analyseren de data, ontleden het systeem en zoeken naar patronen, zwakke
                    punten en kansen. Dit is waar AI-tools kunnen helpen, maar altijd onder
                    menselijke regie.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-600 text-black flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Rapportage en advies</h3>
                  <p className="text-slate-300">
                    We leveren een helder rapport met bevindingen en aanbevelingen. Geen jargon,
                    geen onnodige bulk. Alleen wat u nodig heeft om verder te komen.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-600 text-black flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Implementatieondersteuning (optioneel)</h3>
                  <p className="text-slate-300">
                    Op verzoek kunnen we helpen bij de implementatie van aanbevelingen, of
                    aanvullende analyses doen als de situatie verandert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="border border-cyan-500/30 rounded-lg p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Vragen over onze aanpak?</h2>
            <p className="text-slate-300 mb-6">
              Neem contact op voor meer informatie over hoe wij werken.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
            >
              Neem contact op
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
