export type WasteCategory = 'wet' | 'dry' | 'recyclable' | 'hazardous' | 'ewaste'

export interface ClassificationResult {
  category: WasteCategory
  label: string
  confidence: number
  explanation: string
  tip: string
}

export interface SortingEvent {
  id: string
  category: WasteCategory
  label: string
  confidence?: number
  timestamp: string
  userId?: string
}

export interface UserProfile {
  id: string
  email?: string
  displayName?: string
  streakDays: number
  totalScans: number
  preferences: {
    ttsEnabled: boolean
    notificationsEnabled: boolean
  }
}

export interface ImpactStats {
  totalScans: number
  co2SavedKg: number
  landfillDivertedKg: number
  categoryCounts: Record<WasteCategory, number>
  weeklyStreak: boolean[]
}