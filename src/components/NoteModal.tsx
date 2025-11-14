'use client'

import { useEffect } from 'react'
import type { Note, Child } from '@/types'

interface NoteModalProps {
  note: Note | null
  child: Child | undefined
  isOpen: boolean
  onClose: () => void
}

export default function NoteModal({ note, child, isOpen, onClose }: NoteModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !note) return null

  const releaseDate = new Date(note.releaseDate)
  const isReleased = note.status === 'released'
  const isPastReleaseDate = releaseDate <= new Date()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-memento-500 to-memento-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{child?.avatar}</span>
              <div>
                <h2 className="text-xl font-semibold">{note.title}</h2>
                <p className="text-memento-100">For {child?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-memento-100 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Status and Release Info */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                note.status === 'released' 
                  ? 'bg-green-100 text-green-700'
                  : note.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
              }`}>
                {note.status === 'released' ? '✅ Released' : 
                 note.status === 'scheduled' ? '⏰ Scheduled' : 
                 '📝 Draft'}
              </span>
              
              {isPastReleaseDate && note.status !== 'released' && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                  🎉 Ready to Release!
                </span>
              )}
            </div>
            
            <p className="text-sm text-memento-600">
              <span className="font-medium">Release Date:</span> {releaseDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Note Content */}
          <div className="prose prose-memento max-w-none">
            <div className="bg-memento-50 rounded-lg p-4 border-l-4 border-memento-400">
              <div className="whitespace-pre-wrap text-memento-800 leading-relaxed">
                {note.content}
              </div>
            </div>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-memento-700 mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-memento-100 text-memento-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-6 pt-4 border-t border-memento-200">
            <div className="text-xs text-memento-500 space-y-1">
              <p>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
              <p>Last updated: {new Date(note.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-memento-50 px-6 py-4 border-t border-memento-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-memento-600">
              {isReleased ? (
                <span className="text-green-600">💝 This memory has been shared!</span>
              ) : isPastReleaseDate ? (
                <span className="text-yellow-600">🎁 This memory is ready to be revealed!</span>
              ) : (
                <span>⏳ This memory will be revealed in the future</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-memento-600 hover:bg-memento-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

