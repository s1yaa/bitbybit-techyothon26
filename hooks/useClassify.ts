import * as FileSystem from 'expo-file-system/legacy'
import { useCallback } from 'react'
import { classifyWaste, classifyWasteByText } from '../lib/gemini'
import { logSortingEvent } from '../lib/supabase'
import { useClassificationStore } from '../store/classificationStore'
import { useScanStore } from '../store/scanStore'
import { useUserStore } from '../store/userStore'

interface UseClassifyReturn {
  classify: (imageUri: string) => Promise<void>
  classifyText: (query: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useClassify(): UseClassifyReturn {
  const { setResult, setLoading, setError, isLoading, error, setImageUri } = useClassificationStore()
  const { user } = useUserStore()

  const classify = useCallback(async (imageUri: string) => {
    try {
      setLoading(true)
      setError(null)

      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      })

      const extension = imageUri.split('.').pop()?.toLowerCase()
      const mimeType =
        extension === 'png'
          ? 'image/png'
          : extension === 'webp'
            ? 'image/webp'
            : 'image/jpeg'

      const result = await classifyWaste(base64, mimeType)

      if (!result) {
        setError('Could not classify this image. Please try again.')
        setLoading(false)
        return
      }

      setImageUri(imageUri)
      setResult(result)
      useScanStore.getState().addEvent({
        id: Date.now().toString(),
        category: result.category,
        label: result.label,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
        userId: user?.id,
      })
      useUserStore.getState().incrementScans()

      logSortingEvent(result, user?.id).catch(() => { })
    } catch (err) {
      console.error('[useClassify] error:', err)
      setError('Something went wrong. Check your connection and try again.')
      setLoading(false)
    }
  }, [setResult, setLoading, setError, user?.id])

  const classifyText = useCallback(async (query: string) => {
    try {
      setLoading(true)
      setError(null)

      const result = await classifyWasteByText(query)

      if (!result) {
        setError('Could not classify this item. Please try again.')
        setLoading(false)
        return
      }

      setImageUri(null)
      setResult(result)
      useScanStore.getState().addEvent({
        id: Date.now().toString(),
        category: result.category,
        label: result.label,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
        userId: user?.id,
      })
      useUserStore.getState().incrementScans()

      logSortingEvent(result, user?.id).catch(() => { })
    } catch (err) {
      console.error('[useClassify] text error:', err)
      setError('Something went wrong. Check your connection and try again.')
      setLoading(false)
    }
  }, [setResult, setLoading, setError, user?.id, setImageUri])

  return { classify, classifyText, isLoading, error }
}