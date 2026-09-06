'use client'

import { useT } from '@/lib/i18n'

export function SiteFooter() {
  const t = useT()

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {t.footer.rights}</p>
          <p className="text-slate-500 text-xs">
            {t.footer.tagline}{' '}
            <a href="/legal" className="underline hover:text-slate-400 transition">
              {t.footer.legal}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
