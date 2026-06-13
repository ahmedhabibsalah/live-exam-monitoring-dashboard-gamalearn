import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import sessionsReducer, { hydrateSessions } from '@/store/slices/sessionsSlice'
import filtersReducer, {
  setSearch,
  setStatus,
  setRiskLevel,
  setSortBy,
  setSortOrder,
  selectFilteredSessions,
} from '@/store/slices/filtersSlice'
import uiReducer from '@/store/slices/uiSlice'
import type { ExamSession } from '@/types'

function makeSession(overrides: Partial<ExamSession>): ExamSession {
  return {
    id: `sess_${Math.random().toString(36).slice(2)}`,
    candidate: {
      id: 'cand_001',
      name: 'Test User',
      email: 'test@exam.io',
      country: 'Egypt',
      timezone: 'UTC+2',
    },
    examId: 'exam_1',
    examName: 'AWS Solutions Architect',
    status: 'active',
    riskScore: 20,
    riskLevel: 'low',
    startedAt: '2026-01-01T10:00:00Z',
    duration: 1800,
    flagCount: 0,
    criticalFlagCount: 0,
    lastEventAt: '2026-01-01T10:30:00Z',
    proctorId: null,
    notes: [],
    ...overrides,
  }
}

function makeStore(sessions: ExamSession[]) {
  const store = configureStore({
    reducer: {
      sessions: sessionsReducer,
      filters: filtersReducer,
      ui: uiReducer,
    },
  })
  store.dispatch(hydrateSessions({ sessions, events: {} }))
  return store
}

describe('selectFilteredSessions', () => {
  it('returns all sessions with no filters', () => {
    const sessions = [makeSession({}), makeSession({}), makeSession({})]
    const store = makeStore(sessions)
    const result = selectFilteredSessions(store.getState())
    expect(result).toHaveLength(3)
  })

  it('filters by search on candidate name', () => {
    const sessions = [
      makeSession({
        candidate: {
          id: 'c1',
          name: 'Ahmed Hassan',
          email: 'a@exam.io',
          country: 'Egypt',
          timezone: 'UTC+2',
        },
      }),
      makeSession({
        candidate: {
          id: 'c2',
          name: 'Sara Smith',
          email: 's@exam.io',
          country: 'UK',
          timezone: 'UTC+0',
        },
      }),
    ]
    const store = makeStore(sessions)
    store.dispatch(setSearch('Ahmed'))
    const result = selectFilteredSessions(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].candidate.name).toBe('Ahmed Hassan')
  })

  it('filters by status', () => {
    const sessions = [
      makeSession({ status: 'active' }),
      makeSession({ status: 'flagged' }),
      makeSession({ status: 'idle' }),
    ]
    const store = makeStore(sessions)
    store.dispatch(setStatus('flagged'))
    const result = selectFilteredSessions(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('flagged')
  })

  it('filters by risk level', () => {
    const sessions = [
      makeSession({ riskLevel: 'low', riskScore: 10 }),
      makeSession({ riskLevel: 'critical', riskScore: 95 }),
      makeSession({ riskLevel: 'medium', riskScore: 50 }),
    ]
    const store = makeStore(sessions)
    store.dispatch(setRiskLevel('critical'))
    const result = selectFilteredSessions(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].riskLevel).toBe('critical')
  })

  it('sorts by riskScore descending', () => {
    const sessions = [
      makeSession({ riskScore: 20 }),
      makeSession({ riskScore: 80 }),
      makeSession({ riskScore: 50 }),
    ]
    const store = makeStore(sessions)
    store.dispatch(setSortBy('riskScore'))
    store.dispatch(setSortOrder('desc'))
    const result = selectFilteredSessions(store.getState())
    expect(result[0].riskScore).toBe(80)
    expect(result[2].riskScore).toBe(20)
  })

  it('sorts by riskScore ascending', () => {
    const sessions = [
      makeSession({ riskScore: 20 }),
      makeSession({ riskScore: 80 }),
      makeSession({ riskScore: 50 }),
    ]
    const store = makeStore(sessions)
    store.dispatch(setSortBy('riskScore'))
    store.dispatch(setSortOrder('asc'))
    const result = selectFilteredSessions(store.getState())
    expect(result[0].riskScore).toBe(20)
    expect(result[2].riskScore).toBe(80)
  })

  it('combines search and status filters', () => {
    const sessions = [
      makeSession({
        status: 'flagged',
        candidate: {
          id: 'c1',
          name: 'Ahmed Hassan',
          email: 'a@exam.io',
          country: 'Egypt',
          timezone: 'UTC+2',
        },
      }),
      makeSession({
        status: 'active',
        candidate: {
          id: 'c2',
          name: 'Ahmed Smith',
          email: 'as@exam.io',
          country: 'UK',
          timezone: 'UTC+0',
        },
      }),
      makeSession({
        status: 'flagged',
        candidate: {
          id: 'c3',
          name: 'Sara Hassan',
          email: 's@exam.io',
          country: 'Egypt',
          timezone: 'UTC+2',
        },
      }),
    ]
    const store = makeStore(sessions)
    store.dispatch(setSearch('Ahmed'))
    store.dispatch(setStatus('flagged'))
    const result = selectFilteredSessions(store.getState())
    expect(result).toHaveLength(1)
    expect(result[0].candidate.name).toBe('Ahmed Hassan')
  })
})
