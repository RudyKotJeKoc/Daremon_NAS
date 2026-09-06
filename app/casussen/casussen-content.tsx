'use client'

import Link from 'next/link'
import { useT } from '@/lib/i18n'

export function CasussenContent() {
  const t = useT()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">{t.casussen.heroTitle}</h1>
          <p className="text-xl text-cyan-400 font-light">{t.casussen.heroLead}</p>
        </div>

        <div className="space-y-12">
          {t.casussen.items.map((casus) => (
            <article
              key={casus.tytul}
              className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full mb-3">
                  {casus.kategoria}
                </span>
                <h2 className="text-3xl font-bold text-slate-100 mb-3">{casus.tytul}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{t.casussen.situationLabel}</h3>
                  <p className="text-slate-300">{casus.sytuacja}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">{t.casussen.findingsLabel}</h3>
                  <ul className="space-y-2">
                    {casus.ustalenia.map((finding) => (
                      <li key={finding} className="flex items-start text-slate-300">
                        <span className="mr-3 text-cyan-400 flex-shrink-0">▸</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{t.casussen.resultLabel}</h3>
                  <p className="text-slate-300">{casus.rezultat}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="text-center mt-12">
          <div className="border border-cyan-500/30 rounded-lg p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">{t.casussen.ctaHeading}</h2>
            <p className="text-slate-300 mb-6">{t.casussen.ctaText}</p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
            >
              {t.casussen.ctaButton}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
