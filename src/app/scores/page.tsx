'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getHighScores, clearHighScores, formatDate, type HighScores } from '@/lib/scores'

export default function ScoresPage() {
  const [highScores, setHighScores] = useState<HighScores>({ 
    personalBest: null, 
    recentScores: [], 
    totalGamesPlayed: 0 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setHighScores(getHighScores())
    setLoading(false)
  }, [])

  const handleClearScores = () => {
    if (confirm('Are you sure you want to clear all scores? This cannot be undone.')) {
      clearHighScores()
      setHighScores({ personalBest: null, recentScores: [], totalGamesPlayed: 0 })
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl mono">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mono uppercase mb-4">
            High Scores
          </h1>
          <Link 
            href="/typing" 
            className="text-xl hover:underline"
          >
            ← Back to Game
          </Link>
        </div>

        {highScores.totalGamesPlayed === 0 ? (
          /* No scores yet */
          <div className="text-center py-12">
            <div className="text-6xl mb-8">📊</div>
            <h2 className="text-3xl font-bold mono uppercase mb-4">No Scores Yet</h2>
            <p className="text-xl text-gray-600 mb-8">
              Play the typing game to start tracking your progress!
            </p>
            <Link 
              href="/typing" 
              className="brutalist-button text-lg"
            >
              Play Now
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Personal Best */}
            {highScores.personalBest && (
              <div className="text-center p-8 border-3 border-black bg-green-50">
                <h2 className="text-2xl font-bold mono uppercase mb-4">Personal Best</h2>
                <div className="text-6xl font-bold mono mb-4">
                  {highScores.personalBest.wpm} WPM
                </div>
                <div className="text-gray-600 space-y-1">
                  <div>{highScores.personalBest.wordsCompleted} words completed</div>
                  <div>{formatDate(highScores.personalBest.date)}</div>
                  <div className="text-sm italic">"{highScores.personalBest.textPreview}"</div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border-3 border-black bg-white">
                <div className="text-3xl font-bold mono">{highScores.totalGamesPlayed}</div>
                <div className="text-sm uppercase tracking-wide">Games Played</div>
              </div>
              
              <div className="text-center p-6 border-3 border-black bg-white">
                <div className="text-3xl font-bold mono">
                  {highScores.recentScores.length > 0 
                    ? Math.round(highScores.recentScores.reduce((sum, score) => sum + score.wpm, 0) / highScores.recentScores.length)
                    : 0
                  }
                </div>
                <div className="text-sm uppercase tracking-wide">Average WPM</div>
              </div>
              
              <div className="text-center p-6 border-3 border-black bg-white">
                <div className="text-3xl font-bold mono">
                  {highScores.recentScores.length > 0 ? highScores.recentScores[0].wpm : 0}
                </div>
                <div className="text-sm uppercase tracking-wide">Last Game</div>
              </div>
            </div>

            {/* Recent Scores */}
            {highScores.recentScores.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mono uppercase mb-6 text-center">Recent Games</h2>
                <div className="space-y-3">
                  {highScores.recentScores.map((score, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border-3 border-black flex items-center justify-between ${
                        score.wpm === highScores.personalBest?.wpm ? 'bg-green-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold mono w-16">
                          {score.wpm}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>{score.wordsCompleted} words</div>
                          <div className="italic">"{score.textPreview}"</div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{formatDate(score.date)}</div>
                        {score.wpm === highScores.personalBest?.wpm && (
                          <div className="text-green-600 font-bold">BEST</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="text-center space-y-4">
              <Link 
                href="/typing" 
                className="brutalist-button text-lg mr-4"
              >
                Play Again
              </Link>
              
              <button
                onClick={handleClearScores}
                className="border-3 border-red-500 bg-white text-red-500 px-6 py-3 font-bold uppercase tracking-wide hover:bg-red-50 transition-colors"
              >
                Clear All Scores
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
