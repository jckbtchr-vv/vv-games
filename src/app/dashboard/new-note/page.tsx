'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { storage } from '@/lib/storage'
import type { Child } from '@/types'

const milestoneTemplates = [
  { id: 1, name: 'First Day of School', suggestedAge: 5, category: 'school' },
  { id: 2, name: 'Sweet 16', suggestedAge: 16, category: 'birthday' },
  { id: 3, name: 'High School Graduation', suggestedAge: 18, category: 'achievement' },
  { id: 4, name: '21st Birthday', suggestedAge: 21, category: 'birthday' },
  { id: 5, name: 'Wedding Day', suggestedAge: 25, category: 'custom' },
  { id: 6, name: 'First Job', suggestedAge: 22, category: 'achievement' },
]

export default function NewNotePage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [formData, setFormData] = useState({
    childId: '',
    title: '',
    content: '',
    releaseDate: '',
    releaseType: 'date', // 'date' or 'age'
    releaseAge: '',
    tags: '',
    milestone: ''
  })

  // Load children on mount
  useEffect(() => {
    storage.initialize()
    setChildren(storage.getChildren())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Calculate release date based on type
    let calculatedReleaseDate = formData.releaseDate
    if (formData.releaseType === 'age' && formData.releaseAge) {
      const child = children.find(c => c.id === parseInt(formData.childId))
      if (child) {
        const yearsToAdd = parseInt(formData.releaseAge) - child.age
        const releaseYear = new Date().getFullYear() + yearsToAdd
        calculatedReleaseDate = `${releaseYear}-01-01` // Default to January 1st of that year
      }
    }

    // Process tags
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // Create note object
    const noteData = {
      childId: parseInt(formData.childId),
      title: formData.title,
      content: formData.content,
      preview: formData.content.substring(0, 120) + (formData.content.length > 120 ? '...' : ''),
      releaseDate: calculatedReleaseDate,
      status: 'scheduled' as const,
      tags: tags.length > 0 ? tags : undefined
    }

    // Save to storage
    storage.addNote(noteData)
    
    // Show success message and redirect
    alert('Note saved successfully! 🎉')
    router.push('/dashboard')
  }

  const handleMilestoneSelect = (milestone: typeof milestoneTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      milestone: milestone.name,
      title: milestone.name,
      releaseType: 'age',
      releaseAge: milestone.suggestedAge.toString()
    }))
  }

  const selectedChild = children.find(child => child.id === parseInt(formData.childId))

  return (
    <div className="min-h-screen bg-gradient-to-br from-memento-50 to-memento-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 pt-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard" className="text-memento-600 hover:text-memento-700">
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-memento-800 handwriting mb-2">
            Create a New Memory
          </h1>
          <p className="text-memento-600">
            Write a heartfelt message for your child to discover in the future
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-memento-200">
                {/* Child Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-memento-800 mb-2">
                    For which child? *
                  </label>
                  <select
                    value={formData.childId}
                    onChange={(e) => setFormData(prev => ({ ...prev, childId: e.target.value }))}
                    required
                    className="w-full p-3 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50"
                  >
                    <option value="">Select a child...</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.avatar} {child.name} (Age {child.age})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-memento-800 mb-2">
                    Note Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Your first day of school, Why we chose your name..."
                    required
                    className="w-full p-3 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50"
                  />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-memento-800 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your heartfelt message here... Share your thoughts, memories, advice, or love letters for your child to discover in the future."
                    required
                    rows={10}
                    className="w-full p-3 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50 resize-none"
                  />
                  <p className="text-xs text-memento-500 mt-1">
                    {formData.content.length} characters
                  </p>
                </div>

                {/* Release Settings */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-memento-800 mb-2">
                    When should this be revealed?
                  </label>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="releaseType"
                          value="date"
                          checked={formData.releaseType === 'date'}
                          onChange={(e) => setFormData(prev => ({ ...prev, releaseType: e.target.value }))}
                          className="text-memento-600"
                        />
                        <span className="text-memento-700">Specific Date</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="releaseType"
                          value="age"
                          checked={formData.releaseType === 'age'}
                          onChange={(e) => setFormData(prev => ({ ...prev, releaseType: e.target.value }))}
                          className="text-memento-600"
                        />
                        <span className="text-memento-700">When they turn...</span>
                      </label>
                    </div>

                    {formData.releaseType === 'date' ? (
                      <input
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                        className="w-full p-3 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={formData.releaseAge}
                          onChange={(e) => setFormData(prev => ({ ...prev, releaseAge: e.target.value }))}
                          placeholder="Age"
                          min="1"
                          max="100"
                          className="w-24 p-3 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50"
                        />
                        <span className="text-memento-600">years old</span>
                        {selectedChild && formData.releaseAge && (
                          <span className="text-sm text-memento-500">
                            ({new Date(new Date().setFullYear(new Date().getFullYear() + (parseInt(formData.releaseAge) - selectedChild.age))).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-memento-800 mb-2">
                    Tags (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., school, birthday, advice, funny-story"
                    className="w-full p-3 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50"
                  />
                  <p className="text-xs text-memento-500 mt-1">
                    Separate tags with commas to help organize your memories
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-memento-600 hover:bg-memento-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                  >
                    💝 Save Memory
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 border-2 border-memento-300 text-memento-700 hover:bg-memento-50 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Milestone Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-memento-200">
              <h3 className="text-lg font-semibold text-memento-800 mb-4">
                💡 Milestone Ideas
              </h3>
              <p className="text-sm text-memento-600 mb-4">
                Click on any milestone to use it as a template for your note
              </p>
              
              <div className="space-y-2">
                {milestoneTemplates.map((milestone) => (
                  <button
                    key={milestone.id}
                    onClick={() => handleMilestoneSelect(milestone)}
                    className="w-full text-left p-3 rounded-lg border border-memento-200 hover:bg-memento-100 transition-colors text-sm"
                  >
                    <div className="font-medium text-memento-800">
                      {milestone.name}
                    </div>
                    <div className="text-memento-600">
                      Age {milestone.suggestedAge} • {milestone.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {formData.title && formData.content && (
              <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-memento-200">
                <h3 className="text-lg font-semibold text-memento-800 mb-4">
                  📝 Preview
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-memento-600 mb-1">Title:</div>
                    <div className="font-medium text-memento-800">{formData.title}</div>
                  </div>
                  <div>
                    <div className="text-sm text-memento-600 mb-1">Preview:</div>
                    <div className="text-sm text-memento-700 line-clamp-3">
                      {formData.content.substring(0, 120)}
                      {formData.content.length > 120 && '...'}
                    </div>
                  </div>
                  {selectedChild && (
                    <div>
                      <div className="text-sm text-memento-600 mb-1">For:</div>
                      <div className="text-sm text-memento-700">
                        {selectedChild.avatar} {selectedChild.name}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
