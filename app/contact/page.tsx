import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact – Daremon',
  description: 'Neem contact op als je nieuwsgierig bent naar dit AI-experiment. Geen commerciële diensten.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Contact</h1>
          <p className="text-xl text-cyan-400 font-light">
            Nieuwsgierig naar dit AI-experiment? Je kunt contact opnemen om te praten over ideeën.
          </p>
        </div>

        {/* DISCLAIMER */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-amber-950/40 border border-amber-500/50 rounded-lg p-6 shadow-[0_0_15px_rgba(255,191,0,0.2)]">
            <h2 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-3">
              <span className="text-2xl">ℹ</span>
              Dit is geen zakelijk contactformulier
            </h2>
            <div className="space-y-2 text-slate-200 text-sm leading-relaxed">
              <p>
                Daremon is een experimenteel AI-narratief project, <strong className="text-amber-300">geen bedrijf</strong>.
                Contact opnemen is mogelijk om te praten over ideeën of het experiment zelf, maar
                <strong> niet om diensten af te nemen, offertes aan te vragen of opdrachten te geven</strong>.
              </p>
              <p>
                Als je een zakelijke vraag hebt of op zoek bent naar professionele dienstverlening,
                is dit niet de juiste plek.
              </p>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact informatie */}
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Over contact</h2>
            <div className="space-y-6 text-slate-300">
              <p className="leading-relaxed">
                Als je vragen hebt over dit AI-experiment, de achterliggende ideeën of gewoon
                nieuwsgierig bent naar het project, kun je een bericht sturen.
              </p>

              <div>
                <h3 className="font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Wat kun je verwachten?
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Een persoonlijke reactie (mogelijk vertraagd)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Geen commerciële benadering</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Geen offertes of zakelijke voorstellen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Mogelijk een interessant gesprek over AI en verhalen</span>
                  </li>
                </ul>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 mb-2">E-mail</h3>
                <p className="text-sm mb-2 text-slate-300">
                  Voor vragen over dit project:
                </p>
                <p className="text-sm text-slate-200">
                  <strong className="text-cyan-400">E-mail:</strong> info@daremon.nl
                </p>
                <p className="text-xs text-slate-400 mt-3 italic">
                  Let op: Dit is geen zakelijke contactmogelijkheid. Commerciële vragen
                  kunnen mogelijk niet beantwoord worden.
                </p>
              </div>
            </div>
          </div>

          {/* Contact formulier */}
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Stuur een bericht</h2>
            <ContactForm />
          </div>
        </div>

        {/* Extra info */}
        <section className="mt-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Veelgestelde vragen
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Kan ik diensten afnemen of een project laten uitvoeren?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Nee. Daremon is geen bedrijf en biedt geen commerciële diensten aan. Dit is een
                  experimenteel AI-project zonder zakelijke activiteiten.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Kunnen jullie een analyse of adviesrapport maken?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Nee. De "analyses" en "rapporten" op deze site zijn fictieve AI-gegenereerde verhalen,
                  geen echte diensten. Er is geen team of organisatie die dit soort werk uitvoert.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Wat zijn de kosten?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Er zijn geen kosten, omdat er geen diensten zijn. Dit is een gratis experimenteel
                  project zonder commerciële basis.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Waarom kun je dan wel contact opnemen?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Contact is mogelijk voor vragen over het AI-experiment zelf, de achterliggende ideeën,
                  of gewoon uit nieuwsgierigheid. Niet voor zakelijke vragen of diensten.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Wie beheert dit project?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Dit is een persoonlijk AI-experiment om gedachten te ordenen en metaforische verhalen
                  te genereren. Er is geen bureau, geen team en geen bedrijfsstructuur.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
