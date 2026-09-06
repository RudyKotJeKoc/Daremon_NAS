'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { LanguageSwitcher } from './language-switcher'

export function Navigation() {
  const pathname = usePathname()
  const t = useT()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: t.nav.start },
    { href: '/diensten', label: t.nav.diensten },
    { href: '/casussen', label: t.nav.casussen },
    { href: '/methodiek', label: t.nav.methodiek },
    { href: '/over', label: t.nav.over },
    { href: '/contact', label: t.nav.contact },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <nav className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl text-slate-100 hover:text-cyan-400 transition"
          >
            Daremon
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors ${
                    pathname === item.href
                      ? 'text-cyan-400 font-medium'
                      : 'text-slate-300 hover:text-cyan-400'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/legacy/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-black rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)] transition"
              >
                {t.nav.etsRadio}
              </a>
            </li>
          </ul>

          {/* Right-hand cluster: language switcher (always visible) + mobile toggle */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-300 hover:text-cyan-400 transition p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                // Close icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-16 right-0 bottom-0 w-64 bg-slate-900 border-l border-cyan-500/20 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col h-full">
          {/* Navigation Links */}
          <ul className="flex-1 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-6 py-3 transition-colors ${
                    pathname === item.href
                      ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400 font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-cyan-400 border-l-4 border-transparent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ETS Radio Button */}
          <div className="p-4 border-t border-cyan-500/20">
            <a
              href="/legacy/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 text-center text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-black rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)] transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.etsRadio}
            </a>
          </div>

          {/* Close hint */}
          <div className="p-4 text-center text-xs text-slate-500">
            {t.nav.escHint}
          </div>
        </nav>
      </div>
    </nav>
  )
}
