'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppDispatch } from './useAppDispatch'
import { hydrateSessions } from '@/store/slices/sessionsSlice'
import type { ExamSession, SessionEvent } from '@/types'

let _hydrated = false

export function useHydrateSessions() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (_hydrated) return
    _hydrated = true

    async function load() {
      const pageSize = 1000
      const allRows: Record<string, unknown>[] = []

      for (let page = 0; page < 20; page++) {
        const from = page * pageSize
        const to = from + pageSize - 1

        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .order('risk_score', { ascending: false })
          .range(from, to)

        if (error) {
          console.error(`Page ${page} error:`, error)
          break
        }

        if (!data || data.length === 0) break

        allRows.push(...data)
      }

      console.log('Total rows fetched:', allRows.length)

      const seen = new Set<string>()
      const sessions: ExamSession[] = allRows
        .filter((row) => {
          if (seen.has(row.id as string)) return false
          seen.add(row.id as string)
          return true
        })
        .map((row) => ({
          id: row.id as string,
          candidate: row.candidate as ExamSession['candidate'],
          examId: row.exam_id as string,
          examName: row.exam_name as string,
          status: row.status as ExamSession['status'],
          riskScore: row.risk_score as number,
          riskLevel: row.risk_level as ExamSession['riskLevel'],
          startedAt: row.started_at as string,
          duration: row.duration as number,
          flagCount: row.flag_count as number,
          criticalFlagCount: row.critical_flag_count as number,
          lastEventAt: row.last_event_at as string,
          proctorId: row.proctor_id as string | null,
          notes: (row.notes as string[]) ?? [],
        }))

      const eventsRecord: Record<string, SessionEvent[]> = {}
      dispatch(hydrateSessions({ sessions, events: eventsRecord }))
    }

    load()
  }, [dispatch])
}
