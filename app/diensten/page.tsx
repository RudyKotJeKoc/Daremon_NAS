import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Diensten – Daremon',
  description: 'Overzicht van onze analysetypen: technische systemen, instituties, narratieven en strategisch advies.',
}

export default function DienstenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main id="main-content" role="main">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100">Diensten</h1>
          <p className="text-lg sm:text-xl text-cyan-400 font-light leading-relaxed">
            Daremon analyseert complexe systemen op verschillende niveaus. Van technische installaties
            tot institutionele structuren en maatschappelijke verhalen.
          </p>
        </div>

        {/* Dienst 1 */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3 sm:mb-4">Analyse van technische systemen</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
              Technische systemen zijn vaak complex maar wel begrijpbaar. Een fabriek, een productielijm,
              een onderhoudsstrategie – het zijn allemaal machines met logica, zwakke punten en
              optimaliseringsmogelijkheden.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3">Wat wij doen:</h3>
            <ul className="space-y-2 sm:space-y-3 text-slate-200 text-sm sm:text-base mb-5 sm:mb-6">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Faalanalyse – waarom is iets misgegaan en hoe voorkomen we herhaling?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Onderhoudsstrategie – hoe houd je systemen draaiend zonder onnodig geld te verbranden?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Procesoptimalisatie – waar zitten de bottlenecks en hoe los je ze op?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Due diligence – is dit systeem wat het lijkt te zijn?</span>
              </li>
            </ul>

            <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                <strong className="text-cyan-400">Voorbeeld:</strong> Een fabrieksluiting dreigt omdat een machine steeds
                uitvalt. Wij ontdekken dat het niet aan de machine ligt, maar aan een gebrekkige
                onderhoudsprocedure die gebaseerd is op verouderde aannames.
              </p>
              <Link
                href="/diensten/technische-analyse"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition"
              >
                Lees meer over technische analyse
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Dienst 2 */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3 sm:mb-4">Analyse van instituties en procedures</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
              Organisaties zijn ook systemen. Ze hebben structuren, regels en logica. Maar vaak is die
              logica verborgen, verouderd of gebaseerd op verkeerde aannames. Wij maken zichtbaar hoe
              instituties echt werken.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3">Wat wij doen:</h3>
            <ul className="space-y-2 sm:space-y-3 text-slate-200 text-sm sm:text-base mb-5 sm:mb-6">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Procedureanalyse – waar lopen processen vast en waarom?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Besluitvormingsstructuren – wie beslist werkelijk en op basis waarvan?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Organisatiecultuur – welke ongeschreven regels bepalen het gedrag?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Implementatie-evaluatie – waarom werkt beleid niet zoals bedoeld?</span>
              </li>
            </ul>

            <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-cyan-400">Voorbeeld:</strong> Een gemeente krijgt klachten over trage vergunningverlening.
                Wij analyseren het proces en ontdekken drie overbodige controle-stappen die er 20 jaar
                geleden zijn ingevoegd voor een probleem dat niet meer bestaat.
              </p>
            </div>
          </div>
        </section>

        {/* Dienst 3 */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Narratieve en belangenanalyse</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
              Verhalen zijn machtsinstrumenten. Ze bepalen wat "logisch" lijkt, wie "geloofwaardig" is
              en welke oplossingen "realistisch" zijn. Wij ontleden die verhalen en laten zien wiens
              belangen ze dienen.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3">Wat wij doen:</h3>
            <ul className="space-y-2 sm:space-y-3 text-slate-200 text-sm sm:text-base mb-5 sm:mb-6">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Discoursanalyse – welke taal wordt gebruikt en wat betekent dat?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Belangenkaart – wie profiteert van welk verhaal?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Framing-onderzoek – hoe wordt een probleem gedefinieerd en wie bepaalt dat?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Mediastrategieën – hoe worden verhalen verspreid en versterkt?</span>
              </li>
            </ul>

            <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-cyan-400">Voorbeeld:</strong> Een nieuwe woonontwikkeling stuist op verzet. Wij analyseren
                de verhalen van bewoners, ontwikkelaar en gemeente en ontdekken dat alle partijen
                verschillende definities hanteren van "leefbaarheid" – elk met hun eigen agenda.
              </p>
            </div>
          </div>
        </section>

        {/* Dienst 4 */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Strategische adviesrapporten</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
              Analyse is nuttig, maar pas echt waardevol als het leidt tot actie. Wij leveren geen
              dikke rapporten vol jargon, maar heldere adviezen met concrete stappen.
            </p>

            <h3 className="text-xl font-semibold text-slate-100 mb-3">Wat u krijgt:</h3>
            <ul className="space-y-3 text-slate-200 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Een heldere analyse van het systeem en zijn zwakke punten</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Concrete aanbevelingen die daadwerkelijk uitvoerbaar zijn</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Risicoanalyse – wat kan er misgaan bij implementatie?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Een taal die managers, techneuten en uitvoerders allemaal begrijpen</span>
              </li>
            </ul>

            <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-cyan-400">Onze aanpak:</strong> Wij geloven niet in standaardoplossingen. Elk systeem is
                uniek en vraagt om maatwerk. Ons advies is gebaseerd op grondige analyse, praktijkervaring
                en een scherpe blik op wat werkelijk werkt.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="border border-cyan-500/30 rounded-lg p-6 sm:p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4">Wilt u meer weten?</h2>
            <p className="text-slate-300 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
              Neem contact op voor een vrijblijvend gesprek over uw situatie.
            </p>
            <Link
              href="/contact"
              className="inline-block px-5 sm:px-6 py-3 min-h-[44px] bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-sm sm:text-base rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
            >
              Neem contact op
            </Link>
          </div>
        </section>
      </div>
      </main>
    </div>
  )
}
