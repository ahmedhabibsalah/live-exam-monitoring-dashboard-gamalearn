import type { ExamSession, SessionEvent, FilterState } from '@/types'

export interface SessionsState {
  items: ExamSession[]
  events: Record<string, SessionEvent[]>
  selectedSessionId: string | null
  isLoaded: boolean
}

export interface UIState {
  panelView: 'grid' | 'list'
  sidebar: 'open' | 'closed'
  isDetailOpen: boolean
  realtimeConnected: boolean
  lastRealtimeEvent: string | null
}

export interface RootState {
  sessions: SessionsState
  filters: FilterState
  ui: UIState
}
