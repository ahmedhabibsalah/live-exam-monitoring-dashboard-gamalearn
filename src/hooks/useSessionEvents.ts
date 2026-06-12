'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppDispatch } from './useAppDispatch'
import { useAppSelector } from './useAppSelector'
import { addEvent, selectSessionEvents } from '@/store/slices/sessionsSlice'
import type { SessionEvent } from '@/types'

export function useSessionEvents(sessionId: string | null) {
  const dispatch = useAppDispatch()
  const existingEvents = useAppSelector((state) =>
    sessionId ? selectSessionEvents(sessionId)(state) : []
  )

  useEffect(() => {
    if (!sessionId || existingEvents.length > 0) return

    async function load() {
      const { data, error } = await supabase
        .from('session_events')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })

      if (error || !data) return

      data.forEach((row) => {
        const event: SessionEvent = {
          id: row.id,
          sessionId: row.session_id,
          type: row.type,
          severity: row.severity,
          message: row.message,
          timestamp: row.timestamp,
          metadata: row.metadata,
        }
        dispatch(addEvent(event))
      })
    }

    load()
  }, [sessionId, existingEvents.length, dispatch])

  return existingEvents
}
