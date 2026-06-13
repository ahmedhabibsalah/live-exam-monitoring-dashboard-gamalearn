import { describe, it, expect } from 'vitest'
import sessionsReducer, {
  hydrateSessions,
  updateSession,
  addEvent,
  setSelectedSession,
} from '@/store/slices/sessionsSlice'
import type { ExamSession, SessionEvent } from '@/types'

const mockSession: ExamSession = {
  id: 'sess_001',
  candidate: {
    id: 'cand_001',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@exam.io',
    country: 'Egypt',
    timezone: 'UTC+2',
  },
  examId: 'exam_1',
  examName: 'AWS Solutions Architect',
  status: 'active',
  riskScore: 25,
  riskLevel: 'low',
  startedAt: '2026-01-01T10:00:00Z',
  duration: 1800,
  flagCount: 1,
  criticalFlagCount: 0,
  lastEventAt: '2026-01-01T10:30:00Z',
  proctorId: null,
  notes: [],
}

const mockEvent: SessionEvent = {
  id: 'evt_001',
  sessionId: 'sess_001',
  type: 'tab_switch',
  severity: 'warning',
  message: 'Candidate switched to another tab',
  timestamp: '2026-01-01T10:15:00Z',
}

const initialState = {
  items: [],
  events: {},
  selectedSessionId: null,
  isLoaded: false,
}

describe('sessionsSlice', () => {
  it('returns initial state', () => {
    const state = sessionsReducer(undefined, { type: '@@INIT' })
    expect(state).toEqual(initialState)
  })

  it('hydrateSessions loads sessions and sets isLoaded', () => {
    const state = sessionsReducer(
      undefined,
      hydrateSessions({ sessions: [mockSession], events: {} })
    )
    expect(state.items).toHaveLength(1)
    expect(state.items[0].id).toBe('sess_001')
    expect(state.isLoaded).toBe(true)
  })

  it('hydrateSessions deduplicates by id', () => {
    const state = sessionsReducer(
      undefined,
      hydrateSessions({
        sessions: [mockSession, mockSession],
        events: {},
      })
    )
    expect(state.items).toHaveLength(1)
  })

  it('updateSession updates matching session', () => {
    const loaded = sessionsReducer(
      undefined,
      hydrateSessions({ sessions: [mockSession], events: {} })
    )
    const updated = sessionsReducer(
      loaded,
      updateSession({ id: 'sess_001', status: 'flagged', riskScore: 80 })
    )
    expect(updated.items[0].status).toBe('flagged')
    expect(updated.items[0].riskScore).toBe(80)
  })

  it('updateSession ignores unknown id', () => {
    const loaded = sessionsReducer(
      undefined,
      hydrateSessions({ sessions: [mockSession], events: {} })
    )
    const updated = sessionsReducer(
      loaded,
      updateSession({ id: 'sess_999', status: 'flagged' })
    )
    expect(updated.items[0].status).toBe('active')
  })

  it('addEvent appends event to session', () => {
    const loaded = sessionsReducer(
      undefined,
      hydrateSessions({ sessions: [mockSession], events: {} })
    )
    const withEvent = sessionsReducer(loaded, addEvent(mockEvent))
    expect(withEvent.events['sess_001']).toHaveLength(1)
    expect(withEvent.events['sess_001'][0].id).toBe('evt_001')
  })

  it('addEvent increments flagCount for warning events', () => {
    const loaded = sessionsReducer(
      undefined,
      hydrateSessions({ sessions: [mockSession], events: {} })
    )
    const withEvent = sessionsReducer(loaded, addEvent(mockEvent))
    expect(withEvent.items[0].flagCount).toBe(2)
  })

  it('addEvent increments criticalFlagCount for critical events', () => {
    const loaded = sessionsReducer(
      undefined,
      hydrateSessions({ sessions: [mockSession], events: {} })
    )
    const criticalEvent: SessionEvent = {
      ...mockEvent,
      id: 'evt_002',
      severity: 'critical',
      type: 'face_not_detected',
    }
    const withEvent = sessionsReducer(loaded, addEvent(criticalEvent))
    expect(withEvent.items[0].criticalFlagCount).toBe(1)
  })

  it('setSelectedSession sets selectedSessionId', () => {
    const state = sessionsReducer(undefined, setSelectedSession('sess_001'))
    expect(state.selectedSessionId).toBe('sess_001')
  })

  it('setSelectedSession accepts null', () => {
    const state = sessionsReducer(undefined, setSelectedSession(null))
    expect(state.selectedSessionId).toBeNull()
  })
})
