'use client'

import { useState } from 'react'
import type { Child } from '@/types'

interface ChildManagementProps {
  children: Child[]
  onAddChild: (child: Omit<Child, 'id' | 'createdAt'>) => void
  onEditChild: (child: Child) => void
  onDeleteChild: (childId: number) => void
}

const avatarOptions = ['👶', '👧', '👦', '🧒', '👩', '👨', '🎭', '🌟', '🦄', '🐻', '🐱', '🐶']

export default function ChildManagement({ 
  children, 
  onAddChild, 
  onEditChild, 
  onDeleteChild 
}: ChildManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    avatar: '👧',
    dateOfBirth: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const childData = {
      name: formData.name,
      age: parseInt(formData.age),
      avatar: formData.avatar,
      dateOfBirth: formData.dateOfBirth,
    }

    if (editingChild) {
      onEditChild({
        ...editingChild,
        ...childData,
      })
      setEditingChild(null)
    } else {
      onAddChild(childData)
    }

    // Reset form
    setFormData({ name: '', age: '', avatar: '👧', dateOfBirth: '' })
    setShowAddForm(false)
  }

  const handleEdit = (child: Child) => {
    setEditingChild(child)
    setFormData({
      name: child.name,
      age: child.age.toString(),
      avatar: child.avatar,
      dateOfBirth: child.dateOfBirth
    })
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingChild(null)
    setFormData({ name: '', age: '', avatar: '👧', dateOfBirth: '' })
  }

  return (
    <div className="space-y-4">
      {/* Existing Children */}
      {children.map((child) => (
        <div key={child.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-memento-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{child.avatar}</span>
            <div>
              <div className="font-medium text-memento-800">{child.name}</div>
              <div className="text-sm text-memento-600">Age {child.age}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(child)}
              className="text-memento-600 hover:text-memento-700 p-1"
              title="Edit child"
            >
              ✏️
            </button>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to remove ${child.name}? This will also delete all their notes.`)) {
                  onDeleteChild(child.id)
                }
              }}
              className="text-red-500 hover:text-red-600 p-1"
              title="Delete child"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}

      {/* Add Child Form */}
      {showAddForm ? (
        <form onSubmit={handleSubmit} className="p-4 bg-white/70 rounded-lg border border-memento-300 space-y-4">
          <h3 className="font-semibold text-memento-800">
            {editingChild ? 'Edit Child' : 'Add New Child'}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-memento-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full p-2 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50"
              placeholder="Child's name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-memento-700 mb-1">
              Current Age *
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              required
              min="0"
              max="50"
              className="w-full p-2 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50"
              placeholder="Age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-memento-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="w-full p-2 border border-memento-200 rounded-lg focus:ring-2 focus:ring-memento-500 focus:border-transparent bg-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-memento-700 mb-2">
              Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                  className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                    formData.avatar === avatar
                      ? 'border-memento-500 bg-memento-100'
                      : 'border-memento-200 hover:border-memento-300 bg-white/50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-memento-600 hover:bg-memento-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {editingChild ? 'Save Changes' : 'Add Child'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-memento-300 text-memento-700 hover:bg-memento-50 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-3 border-2 border-dashed border-memento-300 rounded-lg text-memento-600 hover:border-memento-400 hover:text-memento-700 transition-colors"
        >
          + Add Child
        </button>
      )}
    </div>
  )
}

