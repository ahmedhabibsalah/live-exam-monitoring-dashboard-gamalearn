import {
  createSlice,
  createSelector,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { ExamSession, SessionEvent, DashboardStats } from '@/types'
import type { RootState } from '@/store/types'

interface SessionsState {
  items: ExamSession[]
  events: Record<string, SessionEvent[]>
  selectedSessionId: string | null
  isLoaded: boolean
}

const initialState: SessionsState = {
  items: [],
  events: {},
  selectedSessionId: null,
  isLoaded: false,
}

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    hydrateSessions(
      state,
      action: PayloadAction<{
        sessions: ExamSession[]
        events: Record<string, SessionEvent[]>
      }>
    ) {
      // Deduplicate by id
      const seen = new Set<string>()
      const unique = action.payload.sessions.filter((s) => {
        if (seen.has(s.id)) return false
        seen.add(s.id)
        return true
      })
      state.items = unique
      state.events = action.payload.events
      state.isLoaded = true
    },

    updateSession(
      state,
      action: PayloadAction<Partial<ExamSession> & { id: string }>
    ) {
      const index = state.items.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    },

    addEvent(state, action: PayloadAction<SessionEvent>) {
      const { sessionId } = action.payload
      if (!state.events[sessionId]) {
        state.events[sessionId] = []
      }
      state.events[sessionId].push(action.payload)

      // Update session metadata
      const sessionIndex = state.items.findIndex((s) => s.id === sessionId)
      if (sessionIndex !== -1) {
        const session = state.items[sessionIndex]
        state.items[sessionIndex] = {
          ...session,
          lastEventAt: action.payload.timestamp,
          flagCount:
            action.payload.severity !== 'info'
              ? session.flagCount + 1
              : session.flagCount,
          criticalFlagCount:
            action.payload.severity === 'critical'
              ? session.criticalFlagCount + 1
              : session.criticalFlagCount,
        }
      }
    },

    setSelectedSession(state, action: PayloadAction<string | null>) {
      state.selectedSessionId = action.payload
    },
  },
})

export const { hydrateSessions, updateSession, addEvent, setSelectedSession } =
  sessionsSlice.actions

// --- Selectors ---

export const selectAllSessions = (state: RootState) => state.sessions.items
export const selectIsLoaded = (state: RootState) => state.sessions.isLoaded
export const selectSelectedSessionId = (state: RootState) =>
  state.sessions.selectedSessionId

export const selectSelectedSession = createSelector(
  selectAllSessions,
  selectSelectedSessionId,
  (sessions, id) => sessions.find((s) => s.id === id) ?? null
)

export const selectSessionEvents = (sessionId: string) => (state: RootState) =>
  state.sessions.events[sessionId] ?? []

export const selectDashboardStats = createSelector(
  selectAllSessions,
  (sessions): DashboardStats => ({
    totalSessions: sessions.length,
    activeSessions: sessions.filter((s) => s.status === 'active').length,
    flaggedSessions: sessions.filter((s) => s.status === 'flagged').length,
    criticalSessions: sessions.filter((s) => s.riskLevel === 'critical').length,
    avgRiskScore:
      sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + s.riskScore, 0) / sessions.length
          )
        : 0,
  })
)

export default sessionsSlice.reducer
