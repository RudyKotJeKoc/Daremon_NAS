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
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            Daremon
          </Link>

          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors hover:text-primary ${
                    pathname === item.href
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
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
                className="px-4 py-2 text-sm font-semibold text-cyan-400 hover:text-cyan-200 transition"
              >
                ETS Radio
              </a>
            </li>
          </ul>

          {/* Mobile menu button - TODO: implement mobile menu */}
          <button className="md:hidden">
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
