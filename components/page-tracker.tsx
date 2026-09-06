'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { trackVisit } from '@/lib/track'

/**
 * Niewidoczny komponent montowany raz w app/layout.tsx.
 * Przy każdej zmianie ścieżki (i przy pierwszym renderze) wysyła ciche
 * zdarzenie odwiedzin do backendu PHP — patrz lib/track.ts.
 */
export function PageTracker() {
  const pathname = usePathname()
  const { language } = useLanguage()

  useEffect(() => {
    if (!pathname) return
    trackVisit(pathname, language)
    // Śledzimy tylko zmianę ścieżki i języka — nie chcemy wysyłać zdarzenia
    // przy każdym renderze niezwiązanym z nawigacją.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, language])

  return null
}
