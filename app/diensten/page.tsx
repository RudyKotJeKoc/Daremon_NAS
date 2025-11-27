import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Diensten – Daremon',
  description: 'Overzicht van onze analysetypen: technische systemen, instituties, narratieven en strategisch advies.',
}

export default function DienstenPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Diensten</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Daremon analyseert complexe systemen op verschillende niveaus. Van technische installaties
          tot institutionele structuren en maatschappelijke verhalen.
        </p>

        {/* Dienst 1 */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-4">Analyse van technische systemen</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Technische systemen zijn vaak complex maar wel begrijpbaar. Een fabriek, een productielijm,
            een onderhoudsstrategie – het zijn allemaal machines met logica, zwakke punten en
            optimaliseringsmogelijkheden.
          </p>

          <h3 className="text-xl font-semibold mb-3">Wat wij doen:</h3>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Faalanalyse – waarom is iets misgegaan en hoe voorkomen we herhaling?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Onderhoudsstrategie – hoe houd je systemen draaiend zonder onnodig geld te verbranden?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Procesoptimalisatie – waar zitten de bottlenecks en hoe los je ze op?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Due diligence – is dit systeem wat het lijkt te zijn?</span>
            </li>
          </ul>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Voorbeeld:</strong> Een fabrieksluiting dreigt omdat een machine steeds
              uitvalt. Wij ontdekken dat het niet aan de machine ligt, maar aan een gebrekkige
              onderhoudsprocedure die gebaseerd is op verouderde aannames.
            </p>
          </div>
        </section>

        {/* Dienst 2 */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-4">Analyse van instituties en procedures</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Organisaties zijn ook systemen. Ze hebben structuren, regels en logica. Maar vaak is die
            logica verborgen, verouderd of gebaseerd op verkeerde aannames. Wij maken zichtbaar hoe
            instituties echt werken.
          </p>

          <h3 className="text-xl font-semibold mb-3">Wat wij doen:</h3>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Procedureanalyse – waar lopen processen vast en waarom?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Besluitvormingsstructuren – wie beslist werkelijk en op basis waarvan?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Organisatiecultuur – welke ongeschreven regels bepalen het gedrag?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Implementatie-evaluatie – waarom werkt beleid niet zoals bedoeld?</span>
            </li>
          </ul>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Voorbeeld:</strong> Een gemeente krijgt klachten over trage vergunningverlening.
              Wij analyseren het proces en ontdekken drie overbodige controle-stappen die er 20 jaar
              geleden zijn ingevoegd voor een probleem dat niet meer bestaat.
            </p>
          </div>
        </section>

        {/* Dienst 3 */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-4">Narratieve en belangenanalyse</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Verhalen zijn machtsinstrumenten. Ze bepalen wat "logisch" lijkt, wie "geloofwaardig" is
            en welke oplossingen "realistisch" zijn. Wij ontleden die verhalen en laten zien wiens
            belangen ze dienen.
          </p>

          <h3 className="text-xl font-semibold mb-3">Wat wij doen:</h3>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Discoursanalyse – welke taal wordt gebruikt en wat betekent dat?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Belangenkaart – wie profiteert van welk verhaal?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Framing-onderzoek – hoe wordt een probleem gedefinieerd en wie bepaalt dat?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Mediastrategieën – hoe worden verhalen verspreid en versterkt?</span>
            </li>
          </ul>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Voorbeeld:</strong> Een nieuwe woonontwikkeling stuist op verzet. Wij analyseren
              de verhalen van bewoners, ontwikkelaar en gemeente en ontdekken dat alle partijen
              verschillende definities hanteren van "leefbaarheid" – elk met hun eigen agenda.
            </p>
          </div>
        </section>

        {/* Dienst 4 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Strategische adviesrapporten</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Analyse is nuttig, maar pas echt waardevol als het leidt tot actie. Wij leveren geen
            dikke rapporten vol jargon, maar heldere adviezen met concrete stappen.
          </p>

          <h3 className="text-xl font-semibold mb-3">Wat u krijgt:</h3>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Een heldere analyse van het systeem en zijn zwakke punten</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Concrete aanbevelingen die daadwerkelijk uitvoerbaar zijn</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Risicoanalyse – wat kan er misgaan bij implementatie?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Een taal die managers, techneuten en uitvoerders allemaal begrijpen</span>
            </li>
          </ul>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Onze aanpak:</strong> Wij geloven niet in standaardoplossingen. Elk systeem is
              uniek en vraagt om maatwerk. Ons advies is gebaseerd op grondige analyse, praktijkervaring
              en een scherpe blik op wat werkelijk werkt.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-12 border-t">
          <h2 className="text-2xl font-bold mb-4">Wilt u meer weten?</h2>
          <p className="text-muted-foreground mb-6">
            Neem contact op voor een vrijblijvend gesprek over uw situatie.
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
