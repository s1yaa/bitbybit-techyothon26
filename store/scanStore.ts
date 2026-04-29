import { create } from 'zustand'
import type { SortingEvent } from '@/types'

interface ScanState {
  events: SortingEvent[]
  addEvent: (event: SortingEvent) => void
  clearEvents: () => void
}

export const useScanStore = create<ScanState>()((set) => ({
  events: [],

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
    })),

  clearEvents: () => set({ events: [] }),
}))
