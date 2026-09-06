'use client'

import Link from 'next/link'
import { Tabs } from '@/components/tabs'
import { useT } from '@/lib/i18n'

export function MethodiekContent() {
  const t = useT()

  const tabs = [
    {
      id: 'proces',
      label: t.methodiek.tabProcess,
      content: (
        <section className="mb-8">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              {t.methodiek.processHeading}
            </h2>
            <div className="space-y-4">
              {t.methodiek.processSteps.map((step, i) => (
                <div key={step.tytul} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-600 text-black flex items-center justify-center font-bold text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">{step.tytul}</h3>
                    <p className="text-slate-300">{step.opis}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 'ai',
      label: t.methodiek.tabAi,
      content: (
        <section className="mb-8">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              {t.methodiek.aiHeading}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">{t.methodiek.aiIntro}</p>
            <div className="space-y-6">
              {t.methodiek.aiPoints.map((point) => (
                <div key={point.tytul} className="border border-cyan-500/20 rounded-lg p-6 bg-slate-900/40">
                  <h3 className="font-semibold text-cyan-400 mb-2">{point.tytul}</h3>
                  <p className="text-slate-300">{point.opis}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">{t.methodiek.heroTitle}</h1>
          <p className="text-xl text-cyan-400 font-light">{t.methodiek.heroLead}</p>
        </div>

        <Tabs tabs={tabs} defaultTab="proces" />

        <section className="text-center mt-16">
          <div className="border border-cyan-500/30 rounded-lg p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">{t.methodiek.ctaHeading}</h2>
            <p className="text-slate-300 mb-6">{t.methodiek.ctaText}</p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
            >
              {t.methodiek.ctaButton}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
