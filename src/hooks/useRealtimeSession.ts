'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppDispatch } from './useAppDispatch'
import { updateSession, addEvent } from '@/store/slices/sessionsSlice'
import {
  setRealtimeConnected,
  setLastRealtimeEvent,
} from '@/store/slices/uiSlice'
import type { ExamSession, SessionEvent } from '@/types'

export function useRealtimeSession() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const channel = supabase
      .channel('exam-monitor')

      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions' },
        (payload) => {
          const raw = payload.new as Record<string, unknown>
          const updated: Partial<ExamSession> & { id: string } = {
            id: raw.id as string,
            status: raw.status as ExamSession['status'],
            riskScore: raw.risk_score as number,
            riskLevel: raw.risk_level as ExamSession['riskLevel'],
            flagCount: raw.flag_count as number,
            criticalFlagCount: raw.critical_flag_count as number,
            lastEventAt: raw.last_event_at as string,
          }
          dispatch(updateSession(updated))
          dispatch(setLastRealtimeEvent(new Date().toISOString()))
        }
      )

      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'session_events' },
        (payload) => {
          const raw = payload.new as Record<string, unknown>
          const event: SessionEvent = {
            id: raw.id as string,
            sessionId: raw.session_id as string,
            type: raw.type as SessionEvent['type'],
            severity: raw.severity as SessionEvent['severity'],
            message: raw.message as string,
            timestamp: raw.timestamp as string,
            metadata: raw.metadata as Record<string, unknown> | undefined,
          }
          dispatch(addEvent(event))
          dispatch(setLastRealtimeEvent(new Date().toISOString()))
        }
      )

      .subscribe((status) => {
        dispatch(setRealtimeConnected(status === 'SUBSCRIBED'))
      })

    return () => {
      supabase.removeChannel(channel)
      dispatch(setRealtimeConnected(false))
    }
  }, [dispatch])
}
