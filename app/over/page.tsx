import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Over het project – Daremon',
  description: 'Daremon is een experimenteel AI-narratief project, geen bureau of bedrijf.',
}

export default function OverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Over het project</h1>
          <p className="text-xl text-cyan-400 font-light">
            Daremon is geen bureau. Het is een experimenteel AI-narratief project.
          </p>
        </div>

        {/* Disclaimer */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-red-950/30 border border-red-500/50 rounded-lg p-8 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
            <h2 className="text-2xl font-bold text-red-300 mb-4 flex items-center gap-3">
              <span className="text-3xl">⚠</span>
              Belangrijke waarschuwing
            </h2>
            <div className="space-y-3 text-slate-200 leading-relaxed">
              <p className="font-semibold">
                Daremon is <strong className="text-red-300">geen bedrijf</strong> en <strong className="text-red-300">geen plan om een bedrijf te starten</strong>.
              </p>
              <p>
                Deze website en alle inhoud zijn een <strong>experimenteel narratief project</strong> waarin
                kunstmatige intelligentie (AI) wordt gebruikt om fictieve verhalen, metaforische scenario's
                en hypothetische analyses te genereren.
              </p>
              <p className="text-sm">
                Alle beschrijvingen van "diensten", "casussen", "klanten" en "projecten" zijn
                <strong> fictief</strong> of <strong>metaforisch</strong>. Ze vormen geen aanbod, geen
                commerciële activiteit en geen bewijs van zakelijke plannen.
              </p>
            </div>
          </div>
        </section>

        {/* Wat is dit eigenlijk? */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Wat is dit eigenlijk?
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Daremon is een <strong className="text-slate-100">experimenteel project</strong> waarin ik gebruik maak van
                kunstmatige intelligentie (AI) om:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mijn gedachten te ordenen na een periode van langdurige overbelasting</li>
                <li>Metaforische verhalen en "baśnie" (sprookjes/fabels) te creëren</li>
                <li>Fictieve technische scenario's te bouwen die lijken op echte situaties, maar dat niet zijn</li>
                <li>Narratieve analyses te genereren als literair-technisch experiment</li>
                <li>Te onderzoeken hoe AI-systemen verhalen en analyses kunnen structureren</li>
              </ul>
              <p className="pt-4">
                Het project ontstond niet uit een zakelijk plan, maar uit een persoonlijke behoefte om
                structuur en ordening aan te brengen in complexe gedachten en ervaringen.
              </p>
            </div>
          </div>
        </section>

        {/* De rol van AI */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              De rol van AI in dit project
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Content generatie
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Het grootste deel van de teksten op deze website is gegenereerd door AI-systemen
                  (voornamelijk Claude), op basis van gesprekken, notities en ideeën. De AI werkt als
                  een "verhalen-generator" die structuur geeft aan chaotische input.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Metaforische vertaling
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  De AI helpt om echte ervaringen en observaties om te zetten in metaforische verhalen.
                  Bijvoorbeeld: de "Baśń o Bobrze i tonącym statku" (Fabel van de Bever en het zinkende
                  schip) is een fictief verhaal dat algemene patronen van organisatiegedrag verkent,
                  zonder te verwijzen naar specifieke echte gebeurtenissen.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Gedachten ordenen
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Voor mij persoonlijk dient dit project als een manier om terug te komen van een periode
                  van sterke mentale overbelasting. De AI helpt om chaotische gedachten om te vormen tot
                  gestructureerde verhalen en analyses, zonder dat deze verhalen direct hoeven te
                  corresponderen met concrete plannen of acties.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Geen echte expertise
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Hoewel de AI-gegenereerde teksten soms klinken alsof ze van een expert komen, zijn
                  het fictieve constructies. Ze zijn gebaseerd op patronen in de trainingsdata van de
                  AI, niet op daadwerkelijke professionele ervaring of gecertificeerde expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Wat betekent dit voor de lezer? */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Wat betekent dit voor jou als lezer?
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Als je deze website bezoekt, lees je <strong>fictie</strong>, <strong>experimenten</strong> en
                <strong> metaforische verhalen</strong>. Niet meer, niet minder.
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4">
                <p className="text-slate-200 font-semibold mb-2">Interpreteer de inhoud als:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Literaire experimenten met AI-gegenereerde tekst</li>
                  <li>Metaforische verhalen over systemen en organisaties</li>
                  <li>Gedachte-oefeningen en hypothetische scenario's</li>
                  <li>Exploratieve analyses zonder praktische toepassing</li>
                </ul>
              </div>
              <div className="bg-red-950/20 border border-red-800/50 rounded-lg p-4 my-4">
                <p className="text-red-300 font-semibold mb-2">Interpreteer de inhoud NIET als:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Een aanbod van commerciële diensten</li>
                  <li>Bewijs van zakelijke activiteiten of plannen</li>
                  <li>Professionele expertise of advies</li>
                  <li>Documentatie van echte projecten of klanten</li>
                  <li>Een poging om klanten of opdrachten te werven</li>
                </ul>
              </div>
              <p>
                Als je iets interessants vindt in de teksten, is dat prima – maar besef dat het
                <strong> geen basis vormt voor zakelijke verwachtingen of contractuele afspraken</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Naam */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Waarom "Daremon"?
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                De naam is een samentrekking van <em className="text-cyan-400">daemon</em> – het Griekse woord voor een
                begeleidende geest, of in de informatica: een achtergrondproces dat systemen laat functioneren.
              </p>
              <p>
                Deze naam past bij de metaforische verhalen die hier worden gegenereerd – verhalen over
                onderliggende processen, verborgen structuren en systemen die op de achtergrond draaien.
                Maar het is een <strong>literaire keuze</strong>, geen zakelijke naam.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="border border-cyan-500/30 rounded-lg p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Vragen over dit project?</h2>
            <p className="text-slate-300 mb-6">
              Als je nieuwsgierig bent naar dit experiment of gewoon wilt praten over ideeën,
              kun je contact opnemen. Maar verwacht geen zakelijke voorstellen of offertes.
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
