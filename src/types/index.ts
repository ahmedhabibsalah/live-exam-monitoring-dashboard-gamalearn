export type SessionStatus =
  | 'active'
  | 'idle'
  | 'disconnected'
  | 'completed'
  | 'flagged'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type EventType =
  | 'tab_switch'
  | 'face_not_detected'
  | 'multiple_faces'
  | 'phone_detected'
  | 'audio_detected'
  | 'screen_share_stopped'
  | 'connection_drop'
  | 'connection_restored'
  | 'proctor_note'
  | 'status_change'

export type EventSeverity = 'info' | 'warning' | 'critical'

export interface Candidate {
  id: string
  name: string
  email: string
  country: string
  timezone: string
}

export interface ExamSession {
  id: string
  candidate: Candidate
  examId: string
  examName: string
  status: SessionStatus
  riskScore: number
  riskLevel: RiskLevel
  startedAt: string
  duration: number // seconds elapsed
  flagCount: number
  criticalFlagCount: number
  lastEventAt: string
  proctorId: string | null
  notes: string[]
}

export interface SessionEvent {
  id: string
  sessionId: string
  type: EventType
  severity: EventSeverity
  message: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface ProctorNote {
  id: string
  sessionId: string
  proctorId: string
  content: string
  createdAt: string
}

export interface FilterState {
  search: string
  status: SessionStatus | 'all'
  riskLevel: RiskLevel | 'all'
  examId: string | 'all'
  sortBy: 'riskScore' | 'flagCount' | 'startedAt' | 'lastEventAt'
  sortOrder: 'asc' | 'desc'
}

export interface DashboardStats {
  totalSessions: number
  activeSessions: number
  flaggedSessions: number
  criticalSessions: number
  avgRiskScore: number
}
