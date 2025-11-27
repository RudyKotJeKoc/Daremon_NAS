'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Start' },
  { href: '/diensten', label: 'Diensten' },
  { href: '/casussen', label: 'Casussen' },
  { href: '/methodiek', label: 'Methodiek & AI' },
  { href: '/over', label: 'Over het bureau' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-slate-100 hover:text-cyan-400 transition">
            Daremon
          </Link>

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
                ETS Radio
              </a>
            </li>
          </ul>

          {/* Mobile menu button - TODO: implement mobile menu */}
          <button className="md:hidden text-slate-300 hover:text-cyan-400 transition">
            <span className="sr-only">Menu</span>
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
          </button>
        </div>
      </div>
    </nav>
  )
}
