'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FIELDS } from '@/types'
import { getApprenticeships } from '@/lib/database'
import type { ApprenticeshipWithRelations } from '@/types'

// Mock data for demonstration
const mockApprenticeships = [
  {
    id: '1',
    slug: 'maya-films-to-kurosawa',
    user: { username: 'maya_films', avatar_url: null },
    master: { name: 'Akira Kurosawa', field: 'Film' },
    day_number: 45,
    days_committed: 120,
    start_date: '2024-01-15',
    latest_log: "Analyzed the rain sequences in Seven Samurai frame by frame. His use of weather as emotional punctuation is masterful...",
    status: 'active'
  },
  {
    id: '2',
    slug: 'zara-codes-to-ada-lovelace',
    user: { username: 'zara_codes', avatar_url: null },
    master: { name: 'Ada Lovelace', field: 'Code' },
    day_number: 67,
    days_committed: 100,
    start_date: '2023-11-20',
    latest_log: "Studying her Analytical Engine notes. The first algorithm was poetry in mathematical form...",
    status: 'active'
  },
  {
    id: '3',
    slug: 'carlos-cooks-to-ferran-adria',
    user: { username: 'carlos_cooks', avatar_url: null },
    master: { name: 'Ferran Adrià', field: 'Cooking' },
    day_number: 89,
    days_committed: 365,
    start_date: '2023-08-01',
    latest_log: "Attempted molecular spherification today. Failed spectacularly, but understanding the science behind elBulli's magic...",
    status: 'active'
  },
  {
    id: '4',
    slug: 'amara-paints-to-frida-kahlo',
    user: { username: 'amara_paints', avatar_url: null },
    master: { name: 'Frida Kahlo', field: 'Art' },
    day_number: 156,
    days_committed: 200,
    start_date: '2023-08-10',
    latest_log: "Self-portrait #47. Each one reveals more about the intersection of pain and beauty in her work...",
    status: 'active'
  },
  {
    id: '5',
    slug: 'zoe-captures-to-vivian-maier',
    user: { username: 'zoe_captures', avatar_url: null },
    master: { name: 'Vivian Maier', field: 'Photography' },
    day_number: 156,
    days_committed: 200,
    start_date: '2023-09-01',
    latest_log: "Street photography in Chicago today, channeling Maier's eye. The decisive moment is about patience, not luck...",
    status: 'active'
  },
  {
    id: '6',
    slug: 'kai-writes-to-toni-morrison',
    user: { username: 'kai_writes', avatar_url: null },
    master: { name: 'Toni Morrison', field: 'Writing' },
    day_number: 234,
    days_committed: 365,
    start_date: '2023-06-15',
    latest_log: "Deconstructing Beloved's narrative structure. Her use of memory as a character itself is revolutionary...",
    status: 'active'
  },
  {
    id: '7',
    slug: 'elena-builds-to-zaha-hadid',
    user: { username: 'elena_builds', avatar_url: null },
    master: { name: 'Zaha Hadid', field: 'Design' },
    day_number: 78,
    days_committed: 120,
    start_date: '2023-12-01',
    latest_log: "Parametric design study of the Heydar Aliyev Center. Her fluid forms challenge every assumption about space...",
    status: 'active'
  },
  {
    id: '8',
    slug: 'marcus-composes-to-nina-simone',
    user: { username: 'marcus_composes', avatar_url: null },
    master: { name: 'Nina Simone', field: 'Music' },
    day_number: 90,
    days_committed: 90,
    start_date: '2023-11-15',
    latest_log: "Transcribed 'Feeling Good' note by note. Her classical training meets raw emotion in ways that still give me chills.",
    status: 'completed'
  }
]

export default function ExplorePage() {
  const [selectedField, setSelectedField] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [apprenticeships, setApprenticeships] = useState<ApprenticeshipWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApprenticeships()
  }, [selectedField, selectedStatus, sortBy])

  const loadApprenticeships = async () => {
    setLoading(true)
    try {
      const data = await getApprenticeships({
        field: selectedField || undefined,
        status: selectedStatus as any || undefined,
        sort_by: sortBy as any
      })
      setApprenticeships(data)
    } catch (error) {
      console.error('Error loading apprenticeships:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredApprenticeships = apprenticeships

  const getProgressPercentage = (dayNumber: number, daysCommitted: number) => {
    return Math.min((dayNumber / daysCommitted) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'paused': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mono uppercase mb-4">
            Explore Permissionless Apprenticeships
          </h1>
          <p className="text-xl">
            Discover how others are learning from the masters, without asking permission
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 border-3 border-black bg-gray-50">
          <h2 className="text-xl font-bold mono uppercase mb-4">Filters</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-2">Field</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full brutalist-input"
              >
                <option value="">All Fields</option>
                {FIELDS.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full brutalist-input"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full brutalist-input"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most_days">Most Days Logged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg font-bold">
            {filteredApprenticeships.length} apprenticeship{filteredApprenticeships.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Apprenticeships Grid */}
        <div className="grid gap-6">
          {filteredApprenticeships.map(apprenticeship => (
            <Link
              key={apprenticeship.id}
              href={`/apprenticeship/${apprenticeship.slug}`}
              className="border-3 border-black p-6 bg-white hover:bg-gray-50 transition-colors block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-bold text-lg">{apprenticeship.user.username}</p>
                    <p className="text-gray-600">studying</p>
                    <p className="font-bold text-lg">{apprenticeship.master.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-block w-3 h-3 rounded-full ${getStatusColor(apprenticeship.status)} mr-2`}></div>
                  <span className="text-sm font-bold uppercase">{apprenticeship.status}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Day {apprenticeship.day_number} of {apprenticeship.days_committed}</span>
                  <span>{apprenticeship.master.field}</span>
                </div>
                <div className="w-full bg-gray-200 h-3 border border-black">
                  <div 
                    className="bg-black h-full" 
                    style={{ width: `${getProgressPercentage(apprenticeship.day_number, apprenticeship.days_committed)}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-gray-700 line-clamp-2">
                "{apprenticeship.latest_log}"
              </p>

              <div className="mt-4 text-right">
                <span className="text-sm font-bold uppercase tracking-wide">
                  View Apprenticeship →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredApprenticeships.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mono uppercase mb-4">
              No Apprenticeships Found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or be the first to start an apprenticeship in this field.
            </p>
            <Link href="/start" className="brutalist-button">
              Start Your Apprenticeship
            </Link>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center p-8 border-3 border-black bg-gray-50">
          <h2 className="text-2xl font-bold mono uppercase mb-4">
            Ready to Start Your Own?
          </h2>
          <p className="mb-6">
            Join the community of learners documenting their journey to mastery.
          </p>
          <Link href="/start" className="brutalist-button">
            Start Your Apprenticeship
          </Link>
        </div>
      </div>
    </main>
  )
}
