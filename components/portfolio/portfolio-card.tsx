'use client'

import { useT } from '@/lib/i18n'
import { YouTubeFacade } from './youtube-facade'
import type { PortfolioItem } from './types'

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const t = useT()

  return (
    <article className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden transition-colors hover:border-cyan-500/40">
      <YouTubeFacade itemId={item.id} youtubeId={item.youtubeId} title={item.tytul} format={item.format} />

      <div className="p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300 border border-cyan-500/20">
            {t.portfolio.kategoria[item.kategoria]}
          </span>
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300 border border-amber-500/20">
            {t.portfolio.branza[item.branza]}
          </span>
          <span className="ml-auto text-xs font-mono text-slate-500">{item.format}</span>
        </div>

        <h3 className="text-lg font-semibold text-slate-100 leading-snug">{item.tytul}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{item.opis}</p>
        <p className="text-xs font-mono text-slate-600">{item.data}</p>
      </div>
    </article>
  )
}
