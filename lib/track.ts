'use client'

/**
 * Cichy klient telemetrii — wysyła zdarzenia do backendu PHP
 * (public/api/track.php), który zapisuje je w tabelach `page_visits` i
 * `portfolio_interactions` bazy `daremon_b2b`.
 *
 * Zasady:
 * - Nigdy nie wysyłamy surowego adresu IP — jego hash SHA-256 liczy backend
 *   na podstawie żądania HTTP, nie klient.
 * - Wywołanie jest zawsze "fire-and-forget": błąd sieci lub zablokowany
 *   endpoint (np. przez AdBlock) nie może wpłynąć na działanie strony.
 * - Preferujemy `navigator.sendBeacon`, bo działa też przy nawigacji/zamykaniu
 *   karty; w przeglądarkach bez tego API spadamy do `fetch(..., {keepalive})`.
 */

const TRACK_ENDPOINT = '/api/track.php'

type VisitPayload = {
  type: 'visit'
  path: string
  language: string
  referrer: string
}

type InteractionPayload = {
  type: 'interaction'
  item_id: string
  action: 'play' | 'expand' | 'view'
}

type TrackPayload = VisitPayload | InteractionPayload

function send(payload: TrackPayload) {
  if (typeof window === 'undefined') return

  try {
    const body = JSON.stringify(payload)

    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' })
      const ok = navigator.sendBeacon(TRACK_ENDPOINT, blob)
      if (ok) return
    }

    // Fallback dla przeglądarek bez sendBeacon (lub gdy zwróciło false).
    fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // Telemetria nie może psuć doświadczenia użytkownika.
    })
  } catch {
    // j.w. — ignorujemy każdy błąd telemetryczny.
  }
}

export function trackVisit(path: string, language: string) {
  send({
    type: 'visit',
    path,
    language,
    referrer: document.referrer || '',
  })
}

export function trackInteraction(itemId: string, action: InteractionPayload['action']) {
  send({ type: 'interaction', item_id: itemId, action })
}
