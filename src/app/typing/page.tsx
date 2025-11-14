'use client'

import { useState, useEffect, useRef } from 'react'
import { saveScore, getHighScores, type GameScore, type HighScores } from '@/lib/scores'

const LITERATURE_TEXTS = [
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity",
  "Call me Ishmael. Some years ago never mind how long precisely having little or no money in my purse, and nothing particular to interest me on shore",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole",
  "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife",
  "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys house",
  "To be, or not to be, that is the question: Whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune",
  "When I wrote the following pages, or rather the bulk of them, I lived alone, in the woods, a mile from any neighbor, in a house which I had built myself",
  "In the beginning was the Word, and the Word was with God, and the Word was God. The same was in the beginning with God"
]

export default function TypingGame() {
  const [currentText, setCurrentText] = useState('')
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [completedWords, setCompletedWords] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [highScores, setHighScores] = useState<HighScores>({ personalBest: null, recentScores: [], totalGamesPlayed: 0 })
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize game and load high scores
  useEffect(() => {
    startNewGame()
    setHighScores(getHighScores())
  }, [])

  // Focus input when game starts
  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameStarted])

  const startNewGame = () => {
    const randomText = LITERATURE_TEXTS[Math.floor(Math.random() * LITERATURE_TEXTS.length)]
    const wordArray = randomText.split(' ')
    
    setCurrentText(randomText)
    setWords(wordArray)
    setCurrentWordIndex(0)
    setUserInput('')
    setIsCorrect(null)
    setCompletedWords(0)
    setStartTime(null)
    setEndTime(null)
    setGameStarted(false)
    setGameCompleted(false)
    setIsNewPersonalBest(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setUserInput(value)

    // Start timer on first keystroke
    if (!startTime) {
      setStartTime(Date.now())
      setGameStarted(true)
    }

    const currentWord = words[currentWordIndex]
    
    // Check if current input matches the word so far
    if (currentWord.startsWith(value)) {
      setIsCorrect(value.length === 0 ? null : true)
    } else {
      setIsCorrect(false)
    }

    // Check if word is completed exactly
    if (value === currentWord) {
      // Move to next word immediately
      const nextIndex = currentWordIndex + 1
      setCompletedWords(nextIndex)
      
      if (nextIndex >= words.length) {
        // Game completed
        const endTimeNow = Date.now()
        setEndTime(endTimeNow)
        setGameCompleted(true)
        setGameStarted(false)
        
        // Save the score
        const gameScore: GameScore = {
          wpm: Math.round(nextIndex / ((endTimeNow - (startTime || 0)) / 60000)),
          accuracy: 100, // For now, simplified - could track errors later
          wordsCompleted: nextIndex,
          textLength: words.length,
          date: new Date().toISOString(),
          textPreview: words.slice(0, 4).join(' ') + '...'
        }
        
        const updatedScores = saveScore(gameScore)
        setHighScores(updatedScores)
        
        // Check if this was a new personal best
        const wasPersonalBest = !highScores.personalBest || 
          gameScore.wpm > highScores.personalBest.wpm
        setIsNewPersonalBest(wasPersonalBest)
      } else {
        setCurrentWordIndex(nextIndex)
        setUserInput('')
        setIsCorrect(null)
      }
    }
  }

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0
    const timeInMinutes = (endTime - startTime) / 60000
    return Math.round(completedWords / timeInMinutes)
  }

  const calculateAccuracy = () => {
    if (completedWords === 0) return 100
    // For now, simplified accuracy based on completion
    return gameCompleted ? 100 : Math.round((completedWords / words.length) * 100)
  }

  const getCurrentWord = () => words[currentWordIndex] || ''
  const getDisplayText = () => {
    return words.map((word, index) => {
      if (index < currentWordIndex) {
        return { word, status: 'completed' }
      } else if (index === currentWordIndex) {
        return { word, status: 'current' }
      } else {
        return { word, status: 'pending' }
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-4xl">
        {!gameCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            {/* High Scores Sidebar - Hidden on mobile, minimal on desktop */}
            <div className="hidden lg:block space-y-6 text-sm">
              {highScores.personalBest && (
                <div className="text-center">
                  <div className="text-gray-500 uppercase tracking-wide text-xs">Personal Best</div>
                  <div className="text-2xl font-bold mono">{highScores.personalBest.wpm}</div>
                  <div className="text-gray-400 text-xs">WPM</div>
                </div>
              )}
              
              {highScores.totalGamesPlayed > 0 && (
                <div className="text-center">
                  <div className="text-gray-500 uppercase tracking-wide text-xs">Games Played</div>
                  <div className="text-xl font-bold mono">{highScores.totalGamesPlayed}</div>
                </div>
              )}
            </div>

            {/* Main Game Area */}
            <div className="lg:col-span-2 text-center space-y-12">
              {/* Current Word - Ultra Large */}
              <div className="flex items-center justify-center min-h-[200px] md:min-h-[250px] px-4">
                <div className="text-6xl md:text-7xl font-bold mono break-all leading-tight text-center max-w-full">
                  {getCurrentWord()}
                </div>
              </div>

              {/* Input - Minimal */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className={`w-full text-4xl text-center p-6 border-0 border-b-4 bg-transparent font-mono ${
                  isCorrect === null 
                    ? 'border-gray-300' 
                    : isCorrect 
                    ? 'border-green-500' 
                    : 'border-red-500'
                } focus:outline-none focus:border-black`}
                placeholder="type here"
                autoComplete="off"
                spellCheck="false"
                autoFocus
              />

              {/* Minimal Progress */}
              <div className="text-xl text-gray-400 mono">
                {currentWordIndex + 1} / {words.length}
              </div>
            </div>

            {/* Empty space for balance */}
            <div className="hidden lg:block"></div>
          </div>
        ) : (
          /* Game Complete - Enhanced with score info */
          <div className="text-center space-y-8">
            {isNewPersonalBest && (
              <div className="text-2xl text-green-600 font-bold mono uppercase tracking-wide">
                New Personal Best!
              </div>
            )}
            
            <div className="text-6xl font-bold mono">
              {calculateWPM()} WPM
            </div>
            
            {highScores.personalBest && !isNewPersonalBest && (
              <div className="text-gray-500">
                <div className="text-sm uppercase tracking-wide">Personal Best</div>
                <div className="text-2xl font-bold mono">{highScores.personalBest.wpm} WPM</div>
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={startNewGame}
                className="text-2xl mono hover:underline block mx-auto"
              >
                again
              </button>
              
              {highScores.recentScores.length > 1 && (
                <div className="text-sm text-gray-400">
                  Last game: {highScores.recentScores[1]?.wpm || 0} WPM
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
