import { create } from 'zustand'
import type { ClassificationResult } from '../types'

interface ClassificationState {
  result: ClassificationResult | null
  imageUri: string | null
  history: ClassificationResult[]
  isLoading: boolean
  error: string | null
}

interface ClassificationActions {
  setResult: (result: ClassificationResult) => void
  setImageUri: (uri: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: ClassificationState = {
  result: null,
  imageUri: null,
  history: [],
  isLoading: false,
  error: null,
}

export const useClassificationStore = create<ClassificationState & ClassificationActions>(
  (set) => ({
    ...initialState,

    setResult: (result) =>
      set((state) => ({
        result,
        isLoading: false,
        error: null,
        history: [result, ...state.history].slice(0, 50),
      })),

    setImageUri: (imageUri) => set({ imageUri }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error, isLoading: false }),

    reset: () => set(initialState),
  })
)