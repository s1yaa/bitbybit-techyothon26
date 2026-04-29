import type { UserProfile } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserState {
  user: UserProfile | null

  isAuthenticated: boolean

  streakDays: number
  totalScans: number

  setUser: (user: UserProfile | null) => void
  incrementStreak: () => void
  incrementScans: () => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)