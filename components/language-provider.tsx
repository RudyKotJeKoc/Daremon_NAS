'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'pl' | 'nl'

const STORAGE_KEY = 'daremon_ui_lang'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
}

// Domyślny język renderowany na serwerze (i przy pierwszym renderze klienta,
// zanim React zdąży zahydratować drzewo). Musi być identyczny po obu stronach,
// inaczej Next.js zgłosi błąd hydratacji — dlatego odczyt localStorage
// wykonujemy dopiero w useEffect, już po zamontowaniu komponentu.
const DEFAULT_LANGUAGE: Language = 'pl'

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)

  // Po zamontowaniu (czyli już po hydratacji) synchronizujemy z zapisaną
  // preferencją — ta zmiana stanu nie wpływa na zgodność drzewa SSR/CSR.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'pl' || saved === 'nl') {
        setLanguageState(saved)
      }
    } catch {
      // localStorage niedostępny (np. tryb prywatny) — zostajemy przy domyślnym.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'pl' ? 'pl-PL' : 'nl-NL'
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignorujemy — preferencja po prostu nie przetrwa odświeżenia strony
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
