import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact – Daremon',
  description: 'Neem contact op als je nieuwsgierig bent naar dit AI-experiment.',
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
                    <span>Een persoonlijke reactie over het AI-experiment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Mogelijk een interessant gesprek over ideeën en technologie</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Reactietijd kan variëren</span>
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
                  Wat is dit project?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Een persoonlijk AI-experiment voor het ordenen van gedachten en genereren van
                  metaforische verhalen. Geen commerciële activiteit.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Wie beheert dit project?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Dit is een persoonlijk experiment. Er is geen bedrijfsstructuur, team of organisatie.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Waarvoor kan ik contact opnemen?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Voor vragen over het AI-experiment, de achterliggende ideeën, of uit nieuwsgierigheid
                  naar het project. Contact voor informele gesprekken over technologie en verhalen is welkom.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
