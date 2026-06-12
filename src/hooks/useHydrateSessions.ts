'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppDispatch } from './useAppDispatch'
import { hydrateSessions } from '@/store/slices/sessionsSlice'
import { getMockData } from '@/lib/mockData'
import type { ExamSession, SessionEvent } from '@/types'

export function useHydrateSessions() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('risk_score', { ascending: false })

      if (error || !data || data.length === 0) {
        // Fallback to mock data
        console.warn('Supabase empty or error — using mock data')
        const { sessions, events } = getMockData()
        const eventsRecord: Record<string, SessionEvent[]> = {}
        events.forEach((v, k) => {
          eventsRecord[k] = v
        })
        dispatch(hydrateSessions({ sessions, events: eventsRecord }))
        return
      }

      const sessions: ExamSession[] = data.map((row) => ({
        id: row.id,
        candidate: row.candidate,
        examId: row.exam_id,
        examName: row.exam_name,
        status: row.status,
        riskScore: row.risk_score,
        riskLevel: row.risk_level,
        startedAt: row.started_at,
        duration: row.duration,
        flagCount: row.flag_count,
        criticalFlagCount: row.critical_flag_count,
        lastEventAt: row.last_event_at,
        proctorId: row.proctor_id,
        notes: row.notes ?? [],
      }))

      // Events loaded lazily per session — start with empty
      dispatch(hydrateSessions({ sessions, events: {} }))
    }

    load()
  }, [dispatch])
}
