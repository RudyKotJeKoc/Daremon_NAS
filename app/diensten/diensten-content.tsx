'use client'

import Link from 'next/link'
import { useT } from '@/lib/i18n'

export function DienstenContent() {
  const t = useT()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">{t.diensten.heroTitle}</h1>
          <p className="text-xl text-cyan-400 font-light">{t.diensten.heroLead}</p>
        </div>

        <div className="space-y-8">
          {t.diensten.items.map((item) => (
            <section
              key={item.tytul}
              className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">{item.tytul}</h2>
              <p className="text-slate-300 leading-relaxed mb-6">{item.opis}</p>
              <ul className="space-y-3 text-slate-200">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="text-center mt-16">
          <div className="border border-cyan-500/30 rounded-lg p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">{t.diensten.ctaHeading}</h2>
            <p className="text-slate-300 mb-6">{t.diensten.ctaText}</p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
            >
              {t.diensten.ctaButton}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
