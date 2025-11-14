import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { AuthProvider } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'VV Games - Simple Mini Games',
  description: 'Clean, minimal mini games for quick fun. Starting with a hyper-simple typing game.',
  keywords: ['games', 'typing', 'mini-games', 'simple', 'clean', 'minimal'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <AuthProvider>
          <Navigation />
          <div className="min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
