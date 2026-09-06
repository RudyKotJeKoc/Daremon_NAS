'use client'

import { useMemo, useState } from 'react'
import portfolioData from '@/data/portfolio.json'
import { PortfolioCard } from './portfolio-card'
import type { PortfolioItem } from './types'

const items = portfolioData as PortfolioItem[]

const FILTERS: { id: 'wszystkie' | PortfolioItem['kategoria']; label: string }[] = [
  { id: 'wszystkie', label: 'Wszystkie' },
  { id: 'analiza-mechaniczna', label: 'Analizy mechaniczne' },
  { id: 'short', label: 'Shorts / Reels' },
  { id: 'ai-wizualizacja', label: 'Wizualizacje AI' },
]

export function PortfolioGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('wszystkie')

  const filtered = useMemo(
    () => (filter === 'wszystkie' ? items : items.filter((item) => item.kategoria === filter)),
    [filter]
  )

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtruj portfolio wg kategorii"
        className="flex flex-wrap gap-2 mb-8"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              filter === f.id
                ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(0,255,255,0.2)]'
                : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-400">Brak pozycji w tej kategorii.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
