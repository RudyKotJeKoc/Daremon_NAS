import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Over het bureau – Daremon',
  description: 'Een analytisch kantoor met wortels in industriële techniek, onderhoud en systeemkritiek.',
}

export default function OverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main id="main-content" role="main">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100">Over het bureau</h1>
          <p className="text-lg sm:text-xl text-cyan-400 font-light leading-relaxed">
            Een analytisch kantoor met wortels in industriële techniek, onderhoud en systeemkritiek.
          </p>
        </div>

        {/* Ontstaan */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Hoe dit bureau ontstond
            </h2>
            <div className="space-y-3 sm:space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
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
                kunnen worden als je ze benadert als <strong className="text-slate-100">systemen</strong>. Niet in de vaag-filosofische
                zin, maar in de technische zin: een verzameling onderdelen met relaties, feedback loops,
                zwakke punten en emergente eigenschappen.
              </p>
              <p>
                Die benadering komt voort uit ervaring met industriële systemen – fabrieken, machines,
                onderhoudsstrategieën – maar blijkt breder toepasbaar. Een organisatie is ook een
                systeem. Een beleidstraject ook. Een verhaal ook.
              </p>
            </div>
          </div>
        </section>

        {/* Filosofie */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Onze werkwijze
            </h2>
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Geen bullshit
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  We gebruiken geen vaag jargon om simpele dingen ingewikkeld te laten klinken.
                  We leveren geen dikke rapporten vol opvulling. We zeggen wat we denken, ook als
                  dat ongemakkelijk is. Als iets niet werkt, zeggen we dat. Als een oplossing
                  onrealistisch is, zeggen we dat ook.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Techniek én politiek
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Veel technische problemen zijn politiek, en veel politieke problemen zijn technisch.
                  Een "neutrale" analyse die dat negeert, is waardeloos. Wij kijken naar hoe systemen
                  werkelijk functioneren, inclusief de machtsstructuren en belangen die ze vormgeven.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Praktijkgericht
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  We leveren geen academische verhandelingen en geen utopische plannen. Onze analyses
                  zijn erop gericht dat er daadwerkelijk iets mee gedaan kan worden. Dat betekent:
                  rekening houden met budgetten, organisatiecultuur, politieke realiteit en menselijk
                  gedrag.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Kritisch maar niet cynisch
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  We zijn kritisch op systemen, procedures en verhalen – maar dat betekent niet dat
                  we denken dat alles slecht is of dat verbetering onmogelijk is. Integendeel: juist
                  omdat we geloven dat systemen te begrijpen en te veranderen zijn, is het zinvol om
                  ze kritisch te analyseren.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Voor wie */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Voor wie we werken
            </h2>
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
              <p>
                Daremon werkt voor organisaties, bedrijven en individuen die een complex systeem
                moeten begrijpen of veranderen. Dat kunnen zijn:
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Bedrijven met technische problemen</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Fabrieken, productielijnen, onderhoudsvraagstukken, procesoptimalisatie.
                </p>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Overheden met vastgelopen trajecten</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Beleid dat niet werkt, procedures die vastlopen, conflicten die escaleren.
                </p>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Organisaties met strategische vragen</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Moet dit project doorgaan? Wat zijn de risico's? Wat zegt de data echt?
                </p>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Partijen in juridische procedures</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Due diligence, expertises, contra-expertises, onderbouwing van standpunten.
                </p>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Journalisten en onderzoekers</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Hulp bij het ontleden van complexe systemen voor publicaties of onderzoeksprojecten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Naam */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Waarom "Daremon"?
            </h2>
            <div className="space-y-3 sm:space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                De naam is een samentrekking van <em className="text-cyan-400">daemon</em> – het Griekse woord voor een
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
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="border border-cyan-500/30 rounded-lg p-6 sm:p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4">Meer weten?</h2>
            <p className="text-slate-300 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
              Neem contact op voor een vrijblijvend gesprek.
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
