'use client'

import { useState } from 'react'
import { useT } from '@/lib/i18n'

/**
 * Dokowalny panel Radia ETS.
 *
 * Osadza istniejącą, w pełni funkcjonalną aplikację (/legacy/index.html)
 * w niewielkim, składanym panelu widocznym na każdej podstronie — bez
 * modyfikowania jednej linijki logiki playlisty, crossfade czy PWA. Pełny
 * interfejs (tryb pełnoekranowy) pozostaje pod tym samym adresem co dotychczas.
 */
export function RadioDock() {
  const [open, setOpen] = useState(false)
  const t = useT()

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="w-[320px] overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
          <div className="flex items-center justify-between border-b border-cyan-500/20 px-3 py-2">
            <span className="text-xs font-semibold text-cyan-300 tracking-wide">{t.radioDock.live}</span>
            <a
              href="/legacy/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-cyan-300 transition"
            >
              {t.radioDock.fullscreen}
            </a>
          </div>
          <iframe
            src="/legacy/index.html"
            title="Radio ETS"
            className="h-[420px] w-full border-0"
            loading="lazy"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t.radioDock.closeLabel : t.radioDock.openLabel}
        className="flex items-center gap-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-black font-semibold px-4 py-2.5 text-sm shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
      >
        <span aria-hidden="true">{open ? '▾' : '▸'}</span>
        {t.radioDock.button}
      </button>
    </div>
  )
}
