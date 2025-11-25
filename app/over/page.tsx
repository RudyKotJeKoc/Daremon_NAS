import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Over het bureau – Daremon',
  description: 'Een analytisch kantoor met wortels in industriële techniek, onderhoud en systeemkritiek.',
}

export default function OverPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Over het bureau</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Een analytisch kantoor met wortels in industriële techniek, onderhoud en systeemkritiek.
        </p>

        {/* Ontstaan */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-6">Hoe dit bureau ontstond</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Daremon is geen klassiek adviesbureau. Het is geen marketing-apparaat, geen
              netwerk-organisatie, geen verzameling consultants die dezelfde PowerPoint-templates
              gebruiken. Het is iets anders.
            </p>
            <p>
              Het begon met een simpele observatie: veel problemen worden niet opgelost omdat ze
              verkeerd worden begrepen. Een fabriek die stil staat, wordt gezien als
              "machine-probleem" terwijl het een onderhouds-probleem is. Een vastgelopen
              beleidstraject wordt gezien als "communicatie-probleem" terwijl het een
              macht-probleem is. Een maatschappelijk conflict wordt gezien als "emotie" terwijl
              het om structurele belangen gaat.
            </p>
            <p>
              Daremon is opgericht vanuit de overtuiging dat veel van deze problemen begrepen
              kunnen worden als je ze benadert als <strong>systemen</strong>. Niet in de vaag-filosofische
              zin, maar in de technische zin: een verzameling onderdelen met relaties, feedback loops,
              zwakke punten en emergente eigenschappen.
            </p>
            <p>
              Die benadering komt voort uit ervaring met industriële systemen – fabrieken, machines,
              onderhoudsstrategieën – maar blijkt breder toepasbaar. Een organisatie is ook een
              systeem. Een beleidstraject ook. Een verhaal ook.
            </p>
          </div>
        </section>

        {/* Filosofie */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-6">Onze werkwijze</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Geen bullshit</h3>
              <p className="text-muted-foreground leading-relaxed">
                We gebruiken geen vaag jargon om simpele dingen ingewikkeld te laten klinken.
                We leveren geen dikke rapporten vol opvulling. We zeggen wat we denken, ook als
                dat ongemakkelijk is. Als iets niet werkt, zeggen we dat. Als een oplossing
                onrealistisch is, zeggen we dat ook.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Techniek én politiek</h3>
              <p className="text-muted-foreground leading-relaxed">
                Veel technische problemen zijn politiek, en veel politieke problemen zijn technisch.
                Een "neutrale" analyse die dat negeert, is waardeloos. Wij kijken naar hoe systemen
                werkelijk functioneren, inclusief de machtsstructuren en belangen die ze vormgeven.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Praktijkgericht</h3>
              <p className="text-muted-foreground leading-relaxed">
                We leveren geen academische verhandelingen en geen utopische plannen. Onze analyses
                zijn erop gericht dat er daadwerkelijk iets mee gedaan kan worden. Dat betekent:
                rekening houden met budgetten, organisatiecultuur, politieke realiteit en menselijk
                gedrag.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Kritisch maar niet cynisch</h3>
              <p className="text-muted-foreground leading-relaxed">
                We zijn kritisch op systemen, procedures en verhalen – maar dat betekent niet dat
                we denken dat alles slecht is of dat verbetering onmogelijk is. Integendeel: juist
                omdat we geloven dat systemen te begrijpen en te veranderen zijn, is het zinvol om
                ze kritisch te analyseren.
              </p>
            </div>
          </div>
        </section>

        {/* Voor wie */}
        <section className="mb-16 pb-16 border-b">
          <h2 className="text-3xl font-bold mb-6">Voor wie we werken</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Daremon werkt voor organisaties, bedrijven en individuen die een complex systeem
              moeten begrijpen of veranderen. Dat kunnen zijn:
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Bedrijven met technische problemen</h3>
              <p className="text-muted-foreground text-sm">
                Fabrieken, productielijnen, onderhoudsvraagstukken, procesoptimalisatie.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Overheden met vastgelopen trajecten</h3>
              <p className="text-muted-foreground text-sm">
                Beleid dat niet werkt, procedures die vastlopen, conflicten die escaleren.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Organisaties met strategische vragen</h3>
              <p className="text-muted-foreground text-sm">
                Moet dit project doorgaan? Wat zijn de risico's? Wat zegt de data echt?
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Partijen in juridische procedures</h3>
              <p className="text-muted-foreground text-sm">
                Due diligence, expertises, contra-expertises, onderbouwing van standpunten.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Journalisten en onderzoekers</h3>
              <p className="text-muted-foreground text-sm">
                Hulp bij het ontleden van complexe systemen voor publicaties of onderzoeksprojecten.
              </p>
            </div>
          </div>
        </section>

        {/* Naam */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Waarom "Daremon"?</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              De naam is een samentrekking van <em>daemon</em> – het Griekse woord voor een
              begeleidende geest of een achtergrondproces dat systemen laat functioneren. In
              de informatica is een daemon een proces dat op de achtergrond draait en ervoor
              zorgt dat alles blijft werken.
            </p>
            <p>
              Dat past bij wat wij doen: de onderliggende processen en structuren analyseren die
              bepalen hoe systemen functioneren. Niet de zichtbare oppervlakte, maar de daemons
              die in de achtergrond draaien en het systeem laten werken – of falen.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-12 border-t">
          <h2 className="text-2xl font-bold mb-4">Meer weten?</h2>
          <p className="text-muted-foreground mb-6">
            Neem contact op voor een vrijblijvend gesprek.
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
