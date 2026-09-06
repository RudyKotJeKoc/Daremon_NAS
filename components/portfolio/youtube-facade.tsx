'use client'

import { trackInteraction } from '@/lib/track'

interface YouTubeFacadeProps {
  itemId: string
  youtubeId: string
  title: string
  format: '16:9' | '9:16'
  /** Czy to ten kafelek jest aktualnie odtwarzany — stan trzyma rodzic (PortfolioGrid),
   *  żeby w danej chwili mógł grać tylko jeden film w całej siatce. */
  isActive: boolean
  /** Wywoływane po kliknięciu miniaturki — rodzic ustawia ten kafelek jako aktywny
   *  (co automatycznie resetuje pozostałe z powrotem do fasady). */
  onPlay: () => void
}

/**
 * Facade pattern dla osadzeń YouTube.
 *
 * Dopóki użytkownik nie kliknie, na stronie ląduje wyłącznie statyczna
 * miniatura (obraz) — żaden <iframe> ani skrypt YouTube nie jest ładowany.
 * To zgodne z reżimem opisanym w MEDIA-AVAILABILITY-OPTIMIZATION.md: siatka
 * portfolio może pokazywać dziesiątki pozycji bez obciążania strony przy
 * starcie.
 *
 * Komponent jest "kontrolowany" (isActive/onPlay) zamiast trzymać własny stan
 * `activated` — dzięki temu PortfolioGrid może pilnować, żeby zawsze grał
 * najwyżej jeden film naraz (patrz activeVideoId w portfolio-grid.tsx).
 */
export function YouTubeFacade({ itemId, youtubeId, title, format, isActive, onPlay }: YouTubeFacadeProps) {
  const aspectClass = format === '9:16' ? 'aspect-[9/16]' : 'aspect-video'

  const handleActivate = () => {
    onPlay()
    trackInteraction(itemId, 'play')
  }

  if (isActive) {
    return (
      <div className={`relative w-full ${aspectClass} rounded-lg overflow-hidden bg-black`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleActivate}
      aria-label={`Odtwórz: ${title}`}
      className={`group relative block w-full ${aspectClass} rounded-lg overflow-hidden bg-slate-900 border border-cyan-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/70 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,255,255,0.35)] transition-transform duration-200 group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-cyan-400 translate-x-[1px]">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
