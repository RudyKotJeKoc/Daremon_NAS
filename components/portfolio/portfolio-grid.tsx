'use client'

import { useMemo, useState } from 'react'
import portfolioData from '@/data/portfolio.json'
import { useT } from '@/lib/i18n'
import { PortfolioCard } from './portfolio-card'
import type { PortfolioItem } from './types'

const items = portfolioData as PortfolioItem[]

const FILTER_IDS: ('wszystkie' | PortfolioItem['kategoria'])[] = [
  'wszystkie',
  'analiza-mechaniczna',
  'short',
  'ai-wizualizacja',
]

export function PortfolioGrid() {
  const t = useT()
  const [filter, setFilter] = useState<(typeof FILTER_IDS)[number]>('wszystkie')
  // Id kafelka aktualnie odtwarzanego w siatce — tylko jeden film może grać
  // naraz, więc ustawienie nowego id automatycznie „gasi" (wraca do fasady)
  // wszystkie pozostałe kafelki.
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  const filtered = useMemo(
    () => (filter === 'wszystkie' ? items : items.filter((item) => item.kategoria === filter)),
    [filter]
  )

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtruj portfolio wg kategorii / Filter portfolio op categorie"
        className="flex flex-wrap gap-2 mb-8"
      >
        {FILTER_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            onClick={() => setFilter(id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              filter === id
                ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(0,255,255,0.2)]'
                : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
            }`}
          >
            {t.portfolio.filters[id]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-400">{t.portfolio.empty}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              isActive={activeVideoId === item.id}
              onPlay={() => setActiveVideoId(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
