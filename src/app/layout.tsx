import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'VV Games - Ultra-Minimal Typing Game',
  description: 'Type great works of literature one word at a time. Pure focus, zero distractions.',
  keywords: ['typing-game', 'literature', 'minimal', 'focus', 'clean-ui'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Navigation />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
