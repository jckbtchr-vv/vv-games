'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/?auth=required')
      } else {
        setShouldRender(true)
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mono uppercase mb-4">Loading...</div>
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mono uppercase mb-4">Access Denied</div>
          <p className="mb-4">You need to sign in to access this page.</p>
          <button 
            onClick={() => router.push('/')}
            className="brutalist-button"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return shouldRender ? <>{children}</> : null
}
