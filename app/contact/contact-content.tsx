'use client'

import { ContactForm } from '@/components/contact-form'
import { useT } from '@/lib/i18n'

export function ContactContent() {
  const t = useT()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">{t.contact.heroTitle}</h1>
          <p className="text-xl text-cyan-400 font-light">{t.contact.heroLead}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact informatie */}
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">{t.contact.aboutHeading}</h2>
            <div className="space-y-6 text-slate-300">
              <p className="leading-relaxed">{t.contact.aboutText}</p>

              <div>
                <h3 className="font-semibold text-slate-100 mb-3 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  {t.contact.expectHeading}
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {t.contact.expectItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
                <h3 className="font-semibold text-slate-100 mb-2">{t.contact.emailHeading}</h3>
                <p className="text-sm mb-2 text-slate-300">{t.contact.emailIntro}</p>
                <p className="text-sm text-slate-200">
                  <strong className="text-cyan-400">{t.contact.emailLabel}</strong> info@daremon.nl
                </p>
              </div>
            </div>
          </div>

          {/* Contact formulier */}
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">{t.contact.formHeading}</h2>
            <ContactForm />
          </div>
        </div>

        {/* Extra info */}
        <section className="mt-16">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              {t.contact.faqHeading}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  {t.contact.faqWhatQ}
                </h3>
                <p className="text-slate-300 text-sm ml-6">{t.contact.faqWhatA}</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  {t.contact.faqProcessQ}
                </h3>
                <p className="text-slate-300 text-sm ml-6">
                  {t.contact.faqProcessABefore}
                  <a href="/methodiek" className="text-cyan-400 hover:underline">
                    {t.contact.faqProcessLinkText}
                  </a>
                  {t.contact.faqProcessAAfter}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100 mb-2 flex items-start gap-3">
                  <span className="text-cyan-400 flex-shrink-0">▸</span>
                  {t.contact.faqWhyQ}
                </h3>
                <p className="text-slate-300 text-sm ml-6">{t.contact.faqWhyA}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
