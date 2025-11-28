import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Technische Analyse – Daremon',
  description: 'Analyse van technische systemen: faalanalyse, onderhoudsstrategie, procesoptimalisatie en due diligence voor fabrieken en machines.',
}

export default function TechnischeAnalysePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main id="main-content" role="main">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <div className="inline-block px-3 py-1 text-xs sm:text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full mb-3 sm:mb-4">
            Dienst
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100">
            Technische Systeemanalyse
          </h1>
          <p className="text-lg sm:text-xl text-cyan-400 font-light leading-relaxed max-w-3xl mx-auto">
            Van fabriekssluitingen tot onderhoudsoptimalisatie. Technische systemen zijn complex maar wel begrijpbaar.
          </p>
        </div>

        {/* Wat is het */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Wat is technische systeemanalyse?
            </h2>
            <div className="space-y-3 sm:space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Een fabriek die stil staat wordt vaak gezien als een "machine-probleem", maar in werkelijkheid gaat het meestal om een <strong className="text-slate-100">systeem-probleem</strong>. De machine werkt, maar de onderhoudsstrategie niet. Of de planning klopt niet. Of de documentatie is verouderd.
              </p>
              <p>
                Technische systemen – fabrieken, productielijnen, installaties – hebben hun eigen logica. Ze hebben zwakke punten, bottlenecks en emergente eigenschappen. Ze falen niet omdat ze slecht zijn, maar omdat ze verkeerd begrepen of verkeerd onderhouden worden.
              </p>
              <p>
                Daremon analyseert technische systemen zoals ze werkelijk functioneren. Niet vanuit standaardsjablonen of best practices, maar vanuit de concrete situatie. Wat is hier aan de hand? Waar zit de echte oorzaak? Wat kan er beter?
              </p>
            </div>
          </div>
        </section>

        {/* Wat we doen */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Onze diensten
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {/* Faalanalyse */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Faalanalyse
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                  Waarom is iets misgegaan? Niet de oppervlakkige oorzaak, maar de werkelijke oorzaak. Was het de machine? De procedure? De planning? De communicatie? De besluitvorming?
                </p>
                <div className="border-l-4 border-cyan-500/30 pl-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  <strong className="text-cyan-400">Typisch resultaat:</strong> Een rapport dat niet alleen uitlegt wat er is misgegaan, maar ook waarom het is misgegaan en hoe herhaling wordt voorkomen.
                </div>
              </div>

              {/* Onderhoudsstrategie */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Onderhoudsstrategie
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                  Te veel onderhoud is duur en veroorzaakt slijtage. Te weinig onderhoud leidt tot storingen. De kunst is om precies genoeg te doen op het juiste moment. Maar hoe weet je wat "genoeg" is?
                </p>
                <div className="border-l-4 border-cyan-500/30 pl-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  <strong className="text-cyan-400">Typisch resultaat:</strong> Een data-gedreven onderhoudsplan dat kosten verlaagt en betrouwbaarheid verhoogt, gebaseerd op werkelijke machine-conditie in plaats van standaard-intervallen.
                </div>
              </div>

              {/* Procesoptimalisatie */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Procesoptimalisatie
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                  Productie loopt traag. Bottlenecks verschijnen. Doorlooptijden zijn lang. Maar waar zit het probleem precies? Vaak niet daar waar iedereen denkt. Wij identificeren de werkelijke beperkingen.
                </p>
                <div className="border-l-4 border-cyan-500/30 pl-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  <strong className="text-cyan-400">Typisch resultaat:</strong> Concrete verbetervoorstellen met voorspelde impact, van quick wins tot structurele verbeteringen.
                </div>
              </div>

              {/* Due Diligence */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Due Diligence
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
                  Overweegt u een overname? Een grote investering? Een partnership? Dan wilt u weten wat u koopt. Niet alleen de papieren werkelijkheid, maar de technische werkelijkheid.
                </p>
                <div className="border-l-4 border-cyan-500/30 pl-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  <strong className="text-cyan-400">Typisch resultaat:</strong> Een onafhankelijke beoordeling van technische staat, risico's en verborgen kosten.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voorbeeld casus */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Voorbeeld: Fabrieksluiting voorkomen
            </h2>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Situatie</h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Een productiebedrijf staat op het punt een fabriek te sluiten wegens "onbetrouwbare machines". Hoge onderhoudskosten en frequente storingen maken de locatie onrendabel. De directie heeft al besloten tot sluiting.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Onze analyse</h3>
                <ul className="space-y-2 text-slate-300 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 flex-shrink-0">▸</span>
                    <span>De machines zelf zijn technisch in orde</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 flex-shrink-0">▸</span>
                    <span>De onderhoudsstrategie is gebaseerd op verouderde aannames uit de jaren 90</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 flex-shrink-0">▸</span>
                    <span>Onderhoudsintervallen zijn te kort, waardoor juist extra slijtage ontstaat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 flex-shrink-0">▸</span>
                    <span>Documentatie is slecht bijgehouden, waardoor elke storing lang duurt</span>
                  </li>
                </ul>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Resultaat</h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Door aanpassing van de onderhoudsstrategie en verbetering van de documentatie dalen de kosten met 40%. De fabriek blijft open. 150 banen behouden.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Voor wie */}
        <section className="mb-12 sm:mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Voor wie is dit geschikt?
            </h2>
            <ul className="space-y-3 text-slate-300 text-sm sm:text-base">
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Productiebedrijven met terugkerende storingen of hoge onderhoudskosten</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Fabrieken die processen willen optimaliseren maar niet weten waar te beginnen</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Partijen die een second opinion nodig hebben op technische claims of expertises</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Investeerders die due diligence nodig hebben voor overnames of partnerships</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>Organisaties die te maken hebben met juridische procedures rond technisch falen</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="border border-cyan-500/30 rounded-lg p-6 sm:p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4">Een technisch systeem dat begrepen moet worden?</h2>
            <p className="text-slate-300 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
              Neem contact op voor een vrijblijvend gesprek. We bespreken uw situatie en kijken of en hoe we kunnen helpen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block px-5 sm:px-6 py-3 min-h-[44px] bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-sm sm:text-base rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Neem contact op
              </Link>
              <Link
                href="/diensten"
                className="inline-block px-5 sm:px-6 py-3 min-h-[44px] border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 font-semibold text-sm sm:text-base rounded-lg transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Bekijk alle diensten
              </Link>
            </div>
          </div>
        </section>
      </div>
      </main>
    </div>
  )
}
