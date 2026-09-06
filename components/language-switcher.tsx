'use client'

import { useLanguage, type Language } from './language-provider'

const OPTIONS: { id: Language; label: string }[] = [
  { id: 'pl', label: 'PL' },
  { id: 'nl', label: 'NL' },
]

/**
 * Wyrazisty, segmentowy przełącznik języka (PL | NL).
 *
 * Stan pochodzi z LanguageProvider (React context), więc zmiana jest
 * natychmiastowa i nie wymaga przeładowania strony ani requestu sieciowego —
 * a ponieważ provider inicjalizuje się identycznie po stronie serwera i klienta,
 * przełącznik nie powoduje błędów hydratacji w Next.js (patrz komentarz w
 * language-provider.tsx).
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Wybierz język / Kies taal"
      className="flex items-center rounded-full border border-slate-700 bg-slate-900/80 p-0.5 font-mono text-xs font-bold tracking-wide"
    >
      {OPTIONS.map((opt) => {
        const active = language === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLanguage(opt.id)}
            aria-pressed={active}
            aria-label={opt.id === 'pl' ? 'Polski' : 'Nederlands'}
            className={`rounded-full px-3 py-1.5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              active
                ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.55)] ring-1 ring-cyan-400/60'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
