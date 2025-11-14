'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/lib/auth'
import { getUserApprenticeships } from '@/lib/database'
import type { ApprenticeshipWithRelations } from '@/types'

// Mock data for demonstration
const mockApprenticeships = [
  {
    id: '1',
    slug: 'my-apprenticeship-to-toni-morrison',
    master: { name: 'Toni Morrison', field: 'Writing' },
    status: 'active',
    day_number: 67,
    days_committed: 120,
    start_date: '2023-11-15',
    latest_log: "Deconstructing Beloved's narrative structure. Her use of memory as a character itself is revolutionary...",
    streak: 12
  },
  {
    id: '2', 
    slug: 'my-apprenticeship-to-zaha-hadid',
    master: { name: 'Zaha Hadid', field: 'Design' },
    status: 'active',
    day_number: 34,
    days_committed: 90,
    start_date: '2024-01-01',
    latest_log: "Parametric design study of the Heydar Aliyev Center. Her fluid forms challenge every assumption about space...",
    streak: 7
  },
  {
    id: '3',
    slug: 'my-apprenticeship-to-nina-simone',
    master: { name: 'Nina Simone', field: 'Music' },
    status: 'completed',
    day_number: 60,
    days_committed: 60,
    start_date: '2023-09-01',
    latest_log: "Final performance of 'Feeling Good' incorporating everything I learned. Her classical training meets raw emotion.",
    streak: 0
  }
]

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed' | 'paused'>('active')
  const [apprenticeships, setApprenticeships] = useState<ApprenticeshipWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadApprenticeships()
    }
  }, [user])

  const loadApprenticeships = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const data = await getUserApprenticeships(user.id)
      setApprenticeships(data)
    } catch (error) {
      console.error('Error loading apprenticeships:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredApprenticeships = apprenticeships.filter(a => a.status === selectedTab)

  const getProgressPercentage = (dayNumber: number, daysCommitted: number) => {
    return Math.min((dayNumber / daysCommitted) * 100, 100)
  }

  const getCurrentDay = (apprenticeship: ApprenticeshipWithRelations) => {
    if (!apprenticeship.daily_logs || apprenticeship.daily_logs.length === 0) {
      return 1
    }
    return Math.max(...apprenticeship.daily_logs.map(log => log.day_number)) + 1
  }

  const getLatestLog = (apprenticeship: ApprenticeshipWithRelations) => {
    if (!apprenticeship.daily_logs || apprenticeship.daily_logs.length === 0) {
      return "No logs yet..."
    }
    const latest = apprenticeship.daily_logs.sort((a, b) => b.day_number - a.day_number)[0]
    return latest.learned || latest.studied || "Working on their apprenticeship..."
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mono uppercase mb-4">
            Your Permissionless Dashboard
          </h1>
          <p className="text-xl">
            Manage your apprenticeships and track your learning journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border-3 border-black p-6 bg-white">
            <h3 className="text-lg font-bold mono uppercase mb-2">Active Apprenticeships</h3>
            <p className="text-3xl font-bold">
              {loading ? '...' : apprenticeships.filter(a => a.status === 'active').length}
            </p>
          </div>
          
          <div className="border-3 border-black p-6 bg-white">
            <h3 className="text-lg font-bold mono uppercase mb-2">Total Days Logged</h3>
            <p className="text-3xl font-bold">
              {loading ? '...' : apprenticeships.reduce((sum, a) => {
                const currentDay = getCurrentDay(a)
                return sum + (currentDay - 1)
              }, 0)}
            </p>
          </div>
          
          <div className="border-3 border-black p-6 bg-white">
            <h3 className="text-lg font-bold mono uppercase mb-2">Total Apprenticeships</h3>
            <p className="text-3xl font-bold">
              {loading ? '...' : apprenticeships.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b-3 border-black">
            {(['active', 'completed', 'paused'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-3 font-bold uppercase tracking-wide border-r-3 border-black ${
                  selectedTab === tab 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Apprenticeships */}
        <div className="space-y-6">
          {filteredApprenticeships.map(apprenticeship => (
            <div key={apprenticeship.id} className="border-3 border-black p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Apprenticeship to {apprenticeship.master.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{apprenticeship.master.field}</p>
                  <p className="text-sm text-gray-500">
                    Started {new Date(apprenticeship.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 text-sm font-bold uppercase ${
                    apprenticeship.status === 'active' ? 'bg-green-100 text-green-800' :
                    apprenticeship.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apprenticeship.status}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-bold">
                    Day {apprenticeship.day_number} of {apprenticeship.days_committed}
                  </span>
                  <span className="font-bold">
                    {Math.round(getProgressPercentage(apprenticeship.day_number, apprenticeship.days_committed))}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-4 border-2 border-black">
                  <div 
                    className="bg-black h-full" 
                    style={{ width: `${getProgressPercentage(apprenticeship.day_number, apprenticeship.days_committed)}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                Latest log: "{apprenticeship.latest_log}"
              </p>

              <div className="flex gap-4">
                <Link 
                  href={`/apprenticeship/${apprenticeship.slug}`}
                  className="brutalist-button"
                >
                  View Apprenticeship
                </Link>
                {apprenticeship.status === 'active' && (
                  <Link 
                    href={`/apprenticeship/${apprenticeship.slug}/log`}
                    className="border-3 border-black bg-white text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors"
                  >
                    Log Today's Work
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApprenticeships.length === 0 && (
          <div className="text-center py-12 border-3 border-black bg-gray-50">
            <h2 className="text-2xl font-bold mono uppercase mb-4">
              No {selectedTab} Apprenticeships
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedTab === 'active' 
                ? "You don't have any active apprenticeships yet."
                : `You don't have any ${selectedTab} apprenticeships.`
              }
            </p>
            {selectedTab === 'active' && (
              <Link href="/start" className="brutalist-button">
                Start Your First Apprenticeship
              </Link>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 p-8 border-3 border-black bg-gray-50">
          <h2 className="text-2xl font-bold mono uppercase mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              href="/start"
              className="brutalist-button block text-center"
            >
              Start New Apprenticeship
            </Link>
            <Link 
              href="/explore"
              className="border-3 border-black bg-white text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors block text-center"
            >
              Explore Others
            </Link>
          </div>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  )
}
