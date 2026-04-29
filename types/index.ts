export type WasteCategory = 'wet' | 'dry' | 'recyclable' | 'hazardous' | 'ewaste'

export interface ClassificationResult {
  category: WasteCategory
  label: string          // e.g. "Plastic bottle (PET)"
  confidence: number     // 0–1
  explanation: string    // 1–2 sentence description
  tip: string            // e.g. "Rinse before recycling"
}

export interface SortingEvent {
  id: string
  category: WasteCategory
  label: string
  confidence?: number
  timestamp: string      // ISO 8601
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
  weeklyStreak: boolean[] // last 7 days
}