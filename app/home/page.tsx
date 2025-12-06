export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-slate-100">Daremon</span>
            <span className="block mt-2 text-3xl md:text-4xl font-normal text-slate-300">
              Experimenteel AI Narratief Project
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-wide mt-8">
            Fictieve verhalen. Metaforische analyses. AI-experimenten.
          </p>
          <p className="text-lg text-slate-400 font-light">
            Geen bedrijf. Geen diensten. Alleen verhalen.
          </p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="backdrop-blur-sm bg-red-950/30 border border-red-500/50 rounded-lg p-8 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
          <h2 className="text-2xl font-bold text-red-300 mb-4 flex items-center gap-3">
            <span className="text-3xl">⚠</span>
            Dit is geen bedrijf
          </h2>
          <div className="space-y-3 text-slate-200 leading-relaxed">
            <p className="font-semibold">
              Daremon is <strong className="text-red-300">geen bedrijf</strong>, <strong className="text-red-300">geen
              plan om een bedrijf te starten</strong>, en biedt <strong className="text-red-300">geen commerciële
              diensten</strong> aan.
            </p>
            <p>
              Deze website is een <strong>experimenteel AI-narratief project</strong> waarin fictieve verhalen,
              metaforische scenario's en hypothetische analyses worden gegenereerd door kunstmatige intelligentie.
            </p>
            <p className="text-sm text-slate-300">
              Alle beschrijvingen zijn <strong>fictief</strong>. Er is geen team, geen organisatie,
              geen klanten en geen zakelijke activiteit. Behandel dit als een literair experiment, niet als
              een bedrijfswebsite.
            </p>
          </div>
        </div>
      </section>

      {/* Wat is dit eigenlijk? */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <h2 className="text-3xl font-semibold text-slate-100 mb-8 border-b border-cyan-500/30 pb-4">
            Wat is dit project?
          </h2>

          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Dit is een <strong className="text-slate-100">persoonlijk experiment</strong> waarin ik AI-systemen
              gebruik om:
            </p>

            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>
                  <strong className="text-slate-100">Gedachten te ordenen</strong> na een periode van mentale
                  overbelasting
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>
                  <strong className="text-slate-100">Metaforische verhalen te creëren</strong> (baśnie/sprookjes)
                  over systemen en organisaties
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>
                  <strong className="text-slate-100">Fictieve scenario's te bouwen</strong> die lijken op echte
                  situaties maar dat niet zijn
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                <span>
                  <strong className="text-slate-100">Te experimenteren met AI</strong> als tool voor het
                  structureren van chaotische ideeën
                </span>
              </li>
            </ul>

            <p className="pt-4 text-slate-400">
              Het project dient geen zakelijk doel en is niet bedoeld als commerciële activiteit.
            </p>
          </div>
        </div>
      </section>

      {/* Waarom "Daremon"? */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <h2 className="text-3xl font-semibold text-slate-100 mb-8 border-b border-cyan-500/30 pb-4">
            Waarom "Daremon"?
          </h2>

          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              De naam is afgeleid van <em className="text-cyan-400">daemon</em> – in de informatica een
              achtergrondproces dat ervoor zorgt dat systemen blijven functioneren.
            </p>
            <p>
              Het past bij de metaforische verhalen die hier worden gegenereerd – verhalen over
              onderliggende processen, verborgen structuren en systemen die "op de achtergrond draaien".
            </p>
            <p className="text-slate-400 text-sm">
              Maar nogmaals: dit is een <strong>literaire keuze</strong>, geen zakelijke naam of merk.
            </p>
          </div>
        </div>
      </section>

      {/* Wat kun je hier vinden? */}
      <section className="max-w-4xl mx-auto px-4 py-16 pb-24">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/20 rounded-lg p-8">
          <h3 className="text-2xl font-semibold text-slate-100 mb-6">Wat kun je hier vinden?</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200">
                  <strong className="text-slate-100">Hypothetische scenario's</strong> over fictieve analyses
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200">
                  <strong className="text-slate-100">AI-gegenereerde verhalen</strong> over systemen en organisaties
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200">
                  <strong className="text-slate-100">Metaforische baśnie</strong> (sprookjes) zonder echte basis
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200">
                  <strong className="text-slate-100">Experimenten</strong> met AI-gegenereerde narratieven
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-cyan-500/20">
            <p className="text-slate-400 text-sm italic">
              Let op: Niets op deze site vormt een commercieel aanbod, professioneel advies of
              zakelijke documentatie. Alles is fictie.
            </p>
          </div>
        </div>
      </section>

      {/* ETS LEGACY section */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="border border-cyan-500/30 rounded-xl p-8 bg-slate-900/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">
            ETS-systeem & Radio (Legacy Interface)
          </h2>

          <p className="text-slate-300 max-w-2xl mb-6">
            Toegang tot een legacy interface met visuele elementen, timers en het ETS-radiosysteem.
            Ook dit is onderdeel van het experimentele project.
          </p>

          <a
            href="/legacy/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
          >
            Open ETS-systeem
          </a>
        </div>
      </section>

      {/* Technisch footer accent */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="border-t border-cyan-500/20 pt-8 text-center">
          <p className="text-slate-500 text-sm font-mono">
            [ DAREMON_AI_EXPERIMENT ] [ FICTIONAL_NARRATIVES ] [ NO_BUSINESS ]
          </p>
        </div>
      </div>
    </div>
  )
}
