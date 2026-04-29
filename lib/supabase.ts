import { createClient } from '@supabase/supabase-js'
import type { ClassificationResult, SortingEvent } from '../types'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] Missing env vars — db logging disabled')
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function logSortingEvent(
  result: ClassificationResult,
  userId?: string
): Promise<void> {
  if (!supabase) return

  try {
    const event: Omit<SortingEvent, 'id'> = {
      category: result.category,
      label: result.label,
      timestamp: new Date().toISOString(),
      userId,
    }

    // Fall back to the live session user ID in case the store hasn't hydrated yet
    const resolvedUserId =
      event.userId ?? (await supabase.auth.getUser()).data.user?.id ?? null

    const { error } = await supabase.from('sorting_events').insert({
      category: event.category,
      label: event.label,
      confidence: result.confidence,
      timestamp: event.timestamp,
      user_id: resolvedUserId,
    })

    if (error) {
      console.warn('[supabase] Failed to log event:', error.message)
    }
  } catch (err) {
    console.warn('[supabase] logSortingEvent error:', err)
  }
}

export async function fetchUserEvents(userId: string): Promise<SortingEvent[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('sorting_events')
      .select('id, category, label, timestamp, user_id')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })

    if (error) {
      console.warn('[supabase] fetchUserEvents error:', error.message)
      return []
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      category: row.category,
      label: row.label,
      timestamp: row.timestamp,
      userId: row.user_id ?? undefined,
    }))
  } catch (err) {
    console.warn('[supabase] fetchUserEvents exception:', err)
    return []
  }
}