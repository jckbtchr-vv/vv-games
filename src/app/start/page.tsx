'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FIELDS } from '@/types'
import { searchMasters, createMaster, getAllMasters } from '@/lib/database'
import { useAuth } from '@/lib/auth'
import type { Master } from '@/types'

export default function StartPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedField, setSelectedField] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [masters, setMasters] = useState<Master[]>([])
  const [filteredMasters, setFilteredMasters] = useState<Master[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const { user } = useAuth()

  // Load all masters on mount
  useEffect(() => {
    loadMasters()
  }, [])

  // Filter masters when search or field changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch()
    } else {
      setFilteredMasters(masters.filter(master => 
        !selectedField || master.field === selectedField
      ))
    }
  }, [searchQuery, selectedField, masters])

  const loadMasters = async () => {
    try {
      const allMasters = await getAllMasters()
      setMasters(allMasters)
      setFilteredMasters(allMasters)
    } catch (error) {
      console.error('Error loading masters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setSearching(true)
    try {
      const results = await searchMasters(searchQuery, { 
        field: selectedField || undefined 
      })
      setFilteredMasters(results)
    } catch (error) {
      console.error('Error searching masters:', error)
    } finally {
      setSearching(false)
    }
  }

  const hasResults = filteredMasters.length > 0
  const showNoResults = searchQuery && !hasResults && !searching

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mono uppercase mb-4">
            Start Your Permissionless Apprenticeship
          </h1>
          <p className="text-xl mb-8">
            Search for a master to learn from, or create a new master profile.<br />
            <span className="text-lg text-gray-600">No permission required.</span>
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for a master (e.g., Hemingway, Jobs, Basquiat...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full brutalist-input text-lg"
              />
            </div>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="brutalist-input md:w-48"
            >
              <option value="">All Fields</option>
              {FIELDS.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {searchQuery && (
          <div className="mb-8">
            {hasResults ? (
              <div>
                <h2 className="text-2xl font-bold mono uppercase mb-6">
                  Found {filteredMasters.length} Master{filteredMasters.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid gap-4">
                  {filteredMasters.map(master => (
                    <Link
                      key={master.id}
                      href={`/master/${master.slug}`}
                      className="border-3 border-black p-6 bg-white hover:bg-gray-50 transition-colors block"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{master.name}</h3>
                          <p className="text-gray-600 mb-2">{master.field}</p>
                          <p className="text-sm text-gray-500">
                            {master.apprentices} active apprentices
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="brutalist-button text-sm">
                            View Master
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mono uppercase mb-4">
                  No Masters Found
                </h2>
                <p className="text-gray-600 mb-6">
                  Couldn't find "{searchQuery}" in our database.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="brutalist-button"
                >
                  Create New Master
                </button>
              </div>
            )}
          </div>
        )}

        {/* Popular Masters (shown when no search) */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mono uppercase mb-6">
              Popular Masters
            </h2>
            <div className="grid gap-4">
              {mockMasters.slice(0, 6).map(master => (
                <Link
                  key={master.id}
                  href={`/master/${master.slug}`}
                  className="border-3 border-black p-6 bg-white hover:bg-gray-50 transition-colors block"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{master.name}</h3>
                      <p className="text-gray-600 mb-2">{master.field}</p>
                      <p className="text-sm text-gray-500">
                        {master.apprentices} active apprentices
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="brutalist-button text-sm">
                        View Master
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Create New Master Section */}
        <div className="border-3 border-black p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mono uppercase mb-4">
            Don't See Your Master?
          </h2>
          <p className="mb-6">
            Anyone can create a master profile. Add someone you want to learn from 
            and start your apprenticeship immediately.
          </p>
          
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="brutalist-button"
            >
              Create New Master
            </button>
          ) : (
            <CreateMasterForm 
              onCancel={() => setShowCreateForm(false)}
              initialName={searchQuery}
            />
          )}
        </div>
      </div>
    </main>
  )
}

function CreateMasterForm({ 
  onCancel, 
  initialName,
  onSuccess
}: { 
  onCancel: () => void
  initialName?: string
  onSuccess?: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialName || '',
    field: '',
    bio: '',
    alive: true,
    image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be signed in to create a master')
      return
    }

    setLoading(true)
    setError('')

    try {
      const master = await createMaster({
        ...formData,
        created_by: user.id
      })
      
      // Redirect to the new master's page
      window.location.href = `/master/${master.slug}`
    } catch (error: any) {
      setError(error.message || 'Failed to create master')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-bold mb-2">Master Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full brutalist-input"
          required
          placeholder="e.g., Ernest Hemingway"
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Field *</label>
        <select
          value={formData.field}
          onChange={(e) => setFormData({ ...formData, field: e.target.value })}
          className="w-full brutalist-input"
          required
        >
          <option value="">Select a field</option>
          {FIELDS.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-bold mb-2">Bio *</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full brutalist-input h-32 resize-none"
          required
          placeholder="Brief description of who they are and why they're worth learning from..."
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Status</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={formData.alive}
              onChange={() => setFormData({ ...formData, alive: true })}
              className="mr-2"
            />
            Living
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!formData.alive}
              onChange={() => setFormData({ ...formData, alive: false })}
              className="mr-2"
            />
            Deceased
          </label>
        </div>
      </div>

      <div>
        <label className="block font-bold mb-2">Image URL (optional)</label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full brutalist-input"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="brutalist-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Master & Start Apprenticeship'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="border-3 border-black bg-white text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
