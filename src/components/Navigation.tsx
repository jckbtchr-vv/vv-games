'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import AuthModal from './AuthModal'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const pathname = usePathname()
  const { user, signOut, loading } = useAuth()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/typing', label: 'Play' },
    { href: '/scores', label: 'Scores' },
  ]

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

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
            
            {/* Auth Buttons */}
            {loading ? (
              <div className="px-4 py-2 text-gray-500">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">@{user.username}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 font-bold uppercase tracking-wide text-black hover:bg-gray-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAuthClick('signin')}
                  className="px-4 py-2 font-bold uppercase tracking-wide text-black hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="brutalist-button text-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
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
              
              {/* Mobile Auth */}
              {loading ? (
                <div className="px-4 py-3 text-gray-500">Loading...</div>
              ) : user ? (
                <>
                  <div className="px-4 py-2 text-sm border-t border-gray-200">
                    Signed in as @{user.username}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-3 font-bold uppercase tracking-wide text-black hover:bg-gray-100 transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleAuthClick('signin')
                      setIsMenuOpen(false)
                    }}
                    className="px-4 py-3 font-bold uppercase tracking-wide text-black hover:bg-gray-100 transition-colors text-left border-t border-gray-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('signup')
                      setIsMenuOpen(false)
                    }}
                    className="px-4 py-3 font-bold uppercase tracking-wide text-black hover:bg-gray-100 transition-colors text-left"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </nav>
  )
}

