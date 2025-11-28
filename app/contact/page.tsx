import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact – Daremon',
  description: 'Neem contact op met Daremon voor een vrijblijvend gesprek over uw situatie.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main id="main-content" role="main">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100">Contact</h1>
          <p className="text-lg sm:text-xl text-cyan-400 font-light leading-relaxed">
            Heeft u een complex systeem dat begrepen moet worden? Neem contact op voor een
            vrijblijvend gesprek.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact informatie */}
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-5 sm:mb-6">Neem contact op</h2>
            <div className="space-y-5 sm:space-y-6 text-slate-300">
              <p className="text-sm sm:text-base leading-relaxed">
                Bij voorkeur starten we met een kort kennismakingsgesprek (telefonisch of per
                videocall) om te bepalen of we kunnen helpen en wat de beste aanpak is.
              </p>

              <div>
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2 sm:mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Wat kunt u verwachten?
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Reactie binnen 2 werkdagen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Vrijblijvend kennismakingsgesprek</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Geen verplichtingen of commerciële druk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                    <span>Duidelijke offerte als we verder gaan</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Vertrouwelijkheid</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Alle informatie die u deelt wordt strikt vertrouwelijk behandeld. Ook als er
                  uiteindelijk geen opdracht uit voortkomt.
                </p>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 sm:p-5 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2">Direct contact</h3>
                <p className="text-xs sm:text-sm mb-2 text-slate-300 leading-relaxed">
                  Voor spoedeisende zaken of vragen over lopende projecten:
                </p>
                <p className="text-xs sm:text-sm text-slate-200">
                  <strong className="text-cyan-400">E-mail:</strong> info@daremon.nl<br />
                  <strong className="text-cyan-400">Telefoon:</strong> +31 (0)6 12345678
                </p>
              </div>
            </div>
          </div>

          {/* Contact formulier */}
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-5 sm:mb-6">Stuur een bericht</h2>
            <ContactForm />
          </div>
        </div>

        {/* Extra info */}
        <section className="mt-12 sm:mt-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
              Veelgestelde vragen
            </h2>
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Wat zijn typische projectduren?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm ml-6 leading-relaxed">
                  Dat hangt sterk af van de complexiteit. Een snelle faalanalyse kan in een paar
                  dagen, een grondige organisatieanalyse kan enkele weken duren. We bespreken dit
                  altijd vooraf.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Werken jullie alleen in Nederland?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm ml-6 leading-relaxed">
                  Primair wel, maar voor specifieke opdrachten werken we ook internationaal (Engels
                  en Pools mogelijk).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Wat zijn de kosten?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm ml-6 leading-relaxed">
                  We werken met transparante uurtarieven en maken altijd vooraf een offerte. Geen
                  verborgen kosten of verrassingen achteraf.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 text-base sm:text-lg mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  Kan ik een second opinion aanvragen?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm ml-6 leading-relaxed">
                  Ja, we doen regelmatig second opinions op analyses van anderen. Of u nu twijfelt
                  aan een adviesrapport, een technische expertise of een beleidsanalyse – we kijken
                  kritisch mee.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      </main>
    </div>
  )
}
