// Database Types for Apprentice Platform

export interface User {
  id: string
  email: string
  username: string
  created_at: string
  avatar_url?: string
  bio?: string
}

export interface Master {
  id: string
  name: string
  field: string // "Writing", "Design", "Code", "Business", "Art"
  bio: string
  image_url?: string
  alive: boolean
  created_by: string // references users.id
  created_at: string
  slug: string
}

export interface Apprenticeship {
  id: string
  user_id: string // references users.id
  master_id: string // references masters.id
  status: 'active' | 'completed' | 'paused'
  start_date: string
  target_end_date?: string
  days_committed: number
  created_at: string
  slug: string // for URL like /apprenticeship/username-to-mastername
}

export interface DailyLog {
  id: string
  apprenticeship_id: string // references apprenticeships.id
  day_number: number
  date: string
  studied: string // What specific work they studied
  recreated: string // What they made/recreated
  learned: string // Key insights
  questions?: string // What they're still figuring out
  created_at: string
}

export interface Recreation {
  id: string
  apprenticeship_id: string // references apprenticeships.id
  title: string
  description: string
  original_work: string // What work by the master this is based on
  image_url?: string
  file_url?: string
  content?: string // For text-based recreations
  created_at: string
  likes_count: number
}

export interface Pattern {
  id: string
  master_id: string // references masters.id
  title: string
  description: string
  examples?: string
  created_by: string // references users.id
  created_at: string
}

// Extended types with relations for UI components

export interface ApprenticeshipWithRelations extends Apprenticeship {
  user: User
  master: Master
  daily_logs?: DailyLog[]
  recreations?: Recreation[]
}

export interface MasterWithStats extends Master {
  active_apprentices_count: number
  total_apprentices_count: number
  created_by_user: User
}

export interface UserWithStats extends User {
  active_apprenticeships: Apprenticeship[]
  completed_apprenticeships: Apprenticeship[]
  total_days_logged: number
  current_streak: number
}

// Form types

export interface CreateMasterForm {
  name: string
  field: string
  bio: string
  image_url?: string
  alive: boolean
}

export interface CreateApprenticeshipForm {
  master_id: string
  days_committed: number
  target_end_date?: string
  public: boolean
}

export interface CreateDailyLogForm {
  studied: string
  recreated: string
  learned: string
  questions?: string
}

export interface CreateRecreationForm {
  title: string
  description: string
  original_work: string
  image_url?: string
  file_url?: string
  content?: string
}

export interface CreatePatternForm {
  title: string
  description: string
  examples?: string
}

// API Response types

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
  total_pages: number
}

// Filter and search types

export interface ApprenticeshipFilters {
  field?: string
  master_id?: string
  status?: 'active' | 'completed' | 'paused'
  sort_by?: 'newest' | 'oldest' | 'most_days' | 'most_popular'
}

export interface MasterFilters {
  field?: string
  alive?: boolean
  sort_by?: 'newest' | 'most_apprentices' | 'alphabetical'
}

// Constants

export const FIELDS = [
  'Writing',
  'Design', 
  'Code',
  'Business',
  'Art',
  'Music',
  'Film',
  'Photography',
  'Cooking',
  'Other'
] as const

export type Field = typeof FIELDS[number]

export const APPRENTICESHIP_STATUSES = ['active', 'completed', 'paused'] as const
export type ApprenticeshipStatus = typeof APPRENTICESHIP_STATUSES[number]

export const COMMITMENT_OPTIONS = [30, 60, 90, 180, 365] as const
export type CommitmentDays = typeof COMMITMENT_OPTIONS[number]