'use client'

import Link from 'next/link'
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid'
import { AudioLabVisualizer } from '@/components/audio-lab-visualizer'
import { useT } from '@/lib/i18n'

export default function HomePage() {
  const t = useT()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Strefa 1 — Hero z aktywnym systemem */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-4 py-1.5 text-xs font-mono text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            {t.home.statusBadge}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-slate-100">{t.home.title}</span>
            <span className="block mt-2 text-3xl md:text-4xl font-normal text-slate-300">
              {t.home.subtitle}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-wide mt-8">
            {t.home.lead1}
          </p>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">{t.home.lead2}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
            >
              {t.home.ctaQuote}
            </Link>
            <a
              href="#portfolio"
              className="px-6 py-3 border border-slate-700 hover:border-cyan-500/50 text-slate-200 rounded-lg transition"
            >
              {t.home.ctaPortfolio}
            </a>
          </div>
        </div>
      </section>

      {/* Strefa 2 — Portfolio & Case Studies (bezpośrednio pod Hero) */}
      <section id="portfolio" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.15)]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 border-b border-cyan-500/30 pb-4">
            <h2 className="text-3xl font-semibold text-slate-100">{t.home.portfolioHeading}</h2>
            <Link href="/casussen" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
              {t.home.portfolioLink}
            </Link>
          </div>
          <PortfolioGrid />
        </div>
      </section>

      {/* Strefa 3 — Audio Lab / Visualizer */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.15)]">
          <h2 className="text-3xl font-semibold text-slate-100 mb-3 border-b border-cyan-500/30 pb-4">
            {t.home.audioLabHeading}
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6 max-w-2xl">{t.home.audioLabText}</p>
          <AudioLabVisualizer />
        </div>
      </section>

      {/* Strefa 4 — Proces / metodyka */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold text-slate-100">{t.home.processHeading}</h2>
            <Link href="/methodiek" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
              {t.home.processLink}
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.home.process.map((p, i) => (
              <div key={p.krok} className="flex items-start gap-3">
                <span className="flex-none h-8 w-8 rounded-full border border-cyan-500/40 text-cyan-300 font-mono text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-slate-100 font-semibold mb-1">{p.krok}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strefa 5 — Radio ETS jako strefa multimedialna */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="border border-cyan-500/30 rounded-xl p-8 bg-slate-900/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">{t.home.radioHeading}</h2>
          <p className="text-slate-300 max-w-2xl mb-6">{t.home.radioText}</p>
          <a
            href="/legacy/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
          >
            {t.home.radioCta}
          </a>
        </div>
      </section>

      {/* Strefa 6 — Kontakt / wycena */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="text-center border-t border-cyan-500/20 pt-12">
          <h2 className="text-2xl font-semibold text-slate-100 mb-3">{t.home.contactHeading}</h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">{t.home.contactText}</p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
          >
            {t.home.contactCta}
          </Link>
        </div>
      </section>
    </div>
  )
}
