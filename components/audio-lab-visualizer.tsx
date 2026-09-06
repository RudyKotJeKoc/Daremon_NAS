'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Ambient (bez-dźwiękowa) wersja wizualizatora 3D z visualizer/Visualizer3D.js.
 *
 * Reużywa istniejącą klasę Three.js bez modyfikacji logiki audio — analyser
 * jest przekazywany jako null, więc kula i cząsteczki nie reagują na dźwięk,
 * ale kamera wciąż wykonuje automatyczną rotację po bezczynności (zachowanie
 * odziedziczone z oryginalnego modułu). To ta sama scena, która w Radiu ETS
 * reaguje na muzykę — tutaj działa jako żywa wizytówka technologiczna.
 */
export function AudioLabVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setStatus('unavailable')
      return
    }

    let instance: { start: () => void; stop: () => void } | null = null
    let cancelled = false

    import('@/visualizer/Visualizer3D.js')
      .then(({ Visualizer3D }) => {
        if (cancelled || !canvasRef.current) return
        if (!Visualizer3D.isWebGLAvailable()) {
          setStatus('unavailable')
          return
        }
        instance = new Visualizer3D(canvasRef.current, null)
        instance.start()
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable')
      })

    return () => {
      cancelled = true
      instance?.stop()
    }
  }, [])

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-lg border border-cyan-500/20 bg-[#04132B]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {status !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
          <p className="text-sm text-slate-400 max-w-xs text-center px-4">
            {status === 'loading'
              ? 'Ładowanie wizualizacji 3D…'
              : 'Wizualizacja 3D jest wyłączona w tej przeglądarce (brak WebGL lub włączone ograniczenie animacji).'}
          </p>
        </div>
      )}
    </div>
  )
}
