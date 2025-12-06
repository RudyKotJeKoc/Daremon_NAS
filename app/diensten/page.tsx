import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Hypothetische scenario's – Daremon",
  description: "Fictieve scenario's gegenereerd door AI: technische systemen, instituties, narratieven en analyses. Geen echte diensten.",
}

export default function DienstenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Hypothetische scenario's</h1>
          <p className="text-xl text-cyan-400 font-light">
            AI-gegenereerde concepten en fictieve analysetypen. Dit zijn geen echte diensten.
          </p>
        </div>

        {/* DISCLAIMER */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-amber-950/40 border border-amber-500/50 rounded-lg p-6 shadow-[0_0_15px_rgba(255,191,0,0.2)]">
            <h2 className="text-2xl font-bold text-amber-300 mb-3 flex items-center gap-3">
              <span className="text-2xl">⚠</span>
              Fictief aanbod – Geen echte diensten
            </h2>
            <div className="space-y-2 text-slate-200 text-sm leading-relaxed">
              <p>
                De onderstaande beschrijvingen zijn <strong>hypothetische scenario's gegenereerd door AI</strong>.
                Ze vormen <strong className="text-amber-300">geen commercieel aanbod</strong> en zijn niet gebaseerd
                op echte expertise of bedrijfsactiviteiten.
              </p>
              <p>
                Behandel deze teksten als <strong>fictieve concepten</strong> en <strong>gedachte-experimenten</strong>,
                niet als diensten die je kunt afnemen. Er is geen team, geen organisatie en geen proces om deze
                "analyses" daadwerkelijk uit te voeren.
              </p>
            </div>
          </div>
        </section>

        {/* Scenario 1 */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Scenario: Analyse van technische systemen
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 italic text-sm border-l-2 border-slate-600 pl-4">
              Dit is een AI-gegenereerd hypothetisch scenario. Het beschrijft geen echte dienst.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              In dit fictieve scenario zou een "bureau" technische systemen analyseren – fabrieken,
              productielijnen, onderhoudsstrategieën. Het zou complexe machines bestuderen met hun
              logica, zwakke punten en hypothetische optimaliseringsmogelijkheden.
            </p>

            <h3 className="text-xl font-semibold text-slate-100 mb-3">Wat zo'n fictieve dienst zou omvatten:</h3>
            <ul className="space-y-3 text-slate-200 mb-6">
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

            <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
              <p className="text-sm text-slate-300">
                <strong className="text-cyan-400">Fictief voorbeeld:</strong> Een fabrieksluiting dreigt omdat een machine steeds
                uitvalt. In dit scenario zou een analist ontdekken dat het niet aan de machine ligt, maar aan een gebrekkige
                onderhoudsprocedure die gebaseerd is op verouderde aannames.
                <em className="text-slate-500 block mt-2">(Dit is een AI-gegenereerd verhaal, geen echte case.)</em>
              </p>
            </div>
          </div>
        </section>

        {/* Scenario 2 */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Scenario: Analyse van instituties en procedures
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 italic text-sm border-l-2 border-slate-600 pl-4">
              Dit is een AI-gegenereerd hypothetisch scenario. Het beschrijft geen echte dienst.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              In dit fictieve concept worden organisaties behandeld als systemen met structuren, regels en
              verborgen logica. Een hypothetische analyse zou zichtbaar maken hoe instituties "echt werken"
              – althans, in een fictief scenario.
            </p>

            <h3 className="text-xl font-semibold text-slate-100 mb-3">Wat zo'n fictieve analyse zou omvatten:</h3>
            <ul className="space-y-3 text-slate-200 mb-6">
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

            <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
              <p className="text-sm text-slate-300">
                <strong className="text-cyan-400">Fictief voorbeeld:</strong> Een gemeente krijgt klachten over trage vergunningverlening.
                In dit hypothetische scenario zou een analist het proces bestuderen en drie overbodige controle-stappen
                ontdekken die er 20 jaar geleden zijn ingevoegd voor een probleem dat niet meer bestaat.
                <em className="text-slate-500 block mt-2">(Dit is een AI-gegenereerd verhaal, geen echte case.)</em>
              </p>
            </div>
          </div>
        </section>

        {/* Scenario 3 */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Scenario: Narratieve en belangenanalyse
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 italic text-sm border-l-2 border-slate-600 pl-4">
              Dit is een AI-gegenereerd hypothetisch scenario. Het beschrijft geen echte dienst.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              In dit fictieve concept worden verhalen geanalyseerd als machtsinstrumenten. Een hypothetische
              analyse zou ontleden hoe verhalen bepalen wat "logisch" lijkt, wie "geloofwaardig" is en
              welke oplossingen "realistisch" zijn.
            </p>

            <h3 className="text-xl font-semibold text-slate-100 mb-3">Wat zo'n fictieve analyse zou omvatten:</h3>
            <ul className="space-y-3 text-slate-200 mb-6">
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

            <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
              <p className="text-sm text-slate-300">
                <strong className="text-cyan-400">Fictief voorbeeld:</strong> Een nieuwe woonontwikkeling stuit op verzet. In dit
                hypothetische scenario zou een analist de verhalen van bewoners, ontwikkelaar en gemeente bestuderen en
                ontdekken dat alle partijen verschillende definities hanteren van "leefbaarheid" – elk met hun eigen agenda.
                <em className="text-slate-500 block mt-2">(Dit is een AI-gegenereerd verhaal, geen echte case.)</em>
              </p>
            </div>
          </div>
        </section>

        {/* Scenario 4 */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Scenario: Strategische adviesrapporten
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 italic text-sm border-l-2 border-slate-600 pl-4">
              Dit is een AI-gegenereerd hypothetisch scenario. Het beschrijft geen echte dienst.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              In dit fictieve concept zou analyse leiden tot "concrete adviezen". Een hypothetisch rapport
              zou heldere aanbevelingen bevatten – althans, in theorie.
            </p>

            <h3 className="text-xl font-semibold text-slate-100 mb-3">Wat zo'n fictief rapport zou bevatten:</h3>
            <ul className="space-y-3 text-slate-200 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Een hypothetische analyse van een systeem en zijn zwakke punten</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Fictieve aanbevelingen die in theorie uitvoerbaar zouden zijn</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Speculatieve risicoanalyse – wat zou er mis kunnen gaan?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Taal die AI denkt dat managers en techneuten begrijpen</span>
              </li>
            </ul>

            <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
              <p className="text-sm text-slate-300">
                <strong className="text-cyan-400">Fictieve aanpak:</strong> In dit scenario zou er geen geloof zijn in
                standaardoplossingen. Elk systeem zou uniek zijn en om maatwerk vragen. Het advies zou gebaseerd zijn
                op... fictieve expertise.
                <em className="text-slate-500 block mt-2">(Dit is een AI-gegenereerd concept, geen echte methodologie.)</em>
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="border border-cyan-500/30 rounded-lg p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Nieuwsgierig naar dit project?</h2>
            <p className="text-slate-300 mb-6">
              Als je vragen hebt over dit AI-experiment of gewoon wilt praten over ideeën, kun je contact opnemen.
              Maar dit is geen commercieel aanbod en er zijn geen diensten te "bestellen".
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
