'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAppDispatch } from './useAppDispatch'
import { hydrateSessions } from '@/store/slices/sessionsSlice'
import type { ExamSession, SessionEvent } from '@/types'

export function useHydrateSessions() {
  const dispatch = useAppDispatch()
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    async function load() {
      const pageSize = 1000
      const totalPages = 10
      const allRows: Record<string, unknown>[] = []

      for (let page = 0; page < totalPages; page++) {
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .order('risk_score', { ascending: false })
          .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
          console.error(`Page ${page} error:`, error)
          break
        }

        if (!data || data.length === 0) break

        allRows.push(...data)

        if (data.length < pageSize) break
      }

      console.log('Total rows fetched:', allRows.length)

      const sessions: ExamSession[] = allRows.map((row) => ({
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
