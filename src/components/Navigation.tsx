'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/typing', label: 'Play' },
    { href: '/scores', label: 'Scores' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold mono uppercase tracking-wider">
              VV GAMES
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 font-bold uppercase tracking-wide transition-colors ${
                  isActive(item.href)
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 font-bold text-black hover:bg-gray-100"
          >
            <span className="text-xl mono">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-3 border-black">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 font-bold uppercase tracking-wide transition-colors ${
                    isActive(item.href)
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  </nav>
  )
}

