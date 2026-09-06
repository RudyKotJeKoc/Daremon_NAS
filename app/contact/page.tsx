import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact – DAREMON Engineering',
  description: 'Vraag een offerte aan voor technische videomontage, procesanalyse of AI-visualisaties.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Contact</h1>
          <p className="text-xl text-cyan-400 font-light">
            Vraag een vrijblijvende offerte aan voor montage, analyse of visualisatie.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact informatie */}
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Over dit contact</h2>
            <div className="space-y-6 text-slate-300">
              <p className="leading-relaxed">
                Beschrijf je project — een machine, proces of incident dat gedocumenteerd of
                geanalyseerd moet worden — en we nemen contact op met een concreet voorstel.
              </p>

              <div>
                <h3 className="font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Wat kun je verwachten?
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Een reactie met een eerste inschatting van aanpak en levertijd</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Een vrijblijvende offerte op maat van je sector (PLC, Arburg, robotica, MIM, agro)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Reactie binnen enkele werkdagen</span>
                  </li>
                </ul>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 mb-2">E-mail</h3>
                <p className="text-sm mb-2 text-slate-300">
                  Voor offertes en zakelijke vragen:
                </p>
                <p className="text-sm text-slate-200">
                  <strong className="text-cyan-400">E-mail:</strong> info@daremon.nl
                </p>
              </div>
            </div>
          </div>

          {/* Contact formulier */}
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Stuur een aanvraag</h2>
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
                  Wat doet DAREMON Engineering?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Gespecialiseerde technische videomontage, procesanalyse en AI-visualisaties voor
                  de mechanische, industriële en agrarische sector.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Hoe ziet het proces eruit?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Analyse van het bronmateriaal, montage met eigen audio en eventuele AI-visualisatie,
                  en levering in het formaat dat past bij het gebruik — zie de sectie{' '}
                  <a href="/methodiek" className="text-cyan-400 hover:underline">Methodiek &amp; AI</a> op de homepage.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Waarvoor kan ik contact opnemen?
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  Voor offerteaanvragen, vragen over een lopend project, of een eerste kennismaking
                  voordat je een opdracht vastlegt.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
