import type { UserProfile } from '@/types'
import { create } from 'zustand'

interface UserState {
  user: UserProfile | null

  isAuthenticated: boolean

  streakDays: number
  totalScans: number

  setUser: (user: UserProfile | null) => void
  setStreakDays: (days: number) => void
  incrementStreak: () => void
  incrementScans: () => void
  reset: () => void
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  isAuthenticated: false,
  streakDays: 0,
  totalScans: 0,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      streakDays: user?.streakDays ?? 0,
      totalScans: user?.totalScans ?? 0,
    }),

  setStreakDays: (days) =>
    set({ streakDays: days }),

  incrementStreak: () =>
    set((state) => ({
      streakDays: state.streakDays + 1,
      user: state.user
        ? {
          ...state.user,
          streakDays: state.user.streakDays + 1,
        }
        : null,
    })),

  incrementScans: () =>
    set((state) => ({
      totalScans: state.totalScans + 1,
      user: state.user
        ? {
          ...state.user,
          totalScans: state.user.totalScans + 1,
        }
        : null,
    })),

  reset: () =>
    set({
      user: null,
      isAuthenticated: false,
      streakDays: 0,
      totalScans: 0,
    }),
}))