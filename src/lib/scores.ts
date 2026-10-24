export interface GameScore {
  wpm: number
  accuracy: number
  wordsCompleted: number
  textLength: number
  date: string
  textPreview: string
}

export interface HighScores {
  personalBest: GameScore | null
  recentScores: GameScore[]
  totalGamesPlayed: number
}

const STORAGE_KEY = 'vv-games-high-scores'
const MAX_RECENT_SCORES = 10

export function getHighScores(): HighScores {
  if (typeof window === 'undefined') {
    return { personalBest: null, recentScores: [], totalGamesPlayed: 0 }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { personalBest: null, recentScores: [], totalGamesPlayed: 0 }
    }

    return JSON.parse(stored)
  } catch {
    return { personalBest: null, recentScores: [], totalGamesPlayed: 0 }
  }
}

export function saveScore(score: GameScore): HighScores {
  if (typeof window === 'undefined') {
    return { personalBest: null, recentScores: [], totalGamesPlayed: 0 }
  }

  const currentScores = getHighScores()
  
  const updatedScores: HighScores = {
    personalBest: !currentScores.personalBest || score.wpm > currentScores.personalBest.wpm
      ? score
      : currentScores.personalBest,
    recentScores: [score, ...currentScores.recentScores].slice(0, MAX_RECENT_SCORES),
    totalGamesPlayed: currentScores.totalGamesPlayed + 1
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores))
  } catch {
    console.error('Failed to save score to localStorage')
  }

  return updatedScores
}

export function clearHighScores(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    console.error('Failed to clear high scores from localStorage')
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}
