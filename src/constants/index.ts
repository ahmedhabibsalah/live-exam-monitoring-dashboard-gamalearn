import type { EventType, EventSeverity, SessionStatus } from '@/types'

export const EVENT_SEVERITY_MAP: Record<EventType, EventSeverity> = {
  tab_switch: 'warning',
  face_not_detected: 'critical',
  multiple_faces: 'critical',
  phone_detected: 'critical',
  audio_detected: 'warning',
  screen_share_stopped: 'warning',
  connection_drop: 'warning',
  connection_restored: 'info',
  proctor_note: 'info',
  status_change: 'info',
}

export const EVENT_LABELS: Record<EventType, string> = {
  tab_switch: 'Tab Switch',
  face_not_detected: 'Face Not Detected',
  multiple_faces: 'Multiple Faces',
  phone_detected: 'Phone Detected',
  audio_detected: 'Audio Detected',
  screen_share_stopped: 'Screen Share Stopped',
  connection_drop: 'Connection Drop',
  connection_restored: 'Connection Restored',
  proctor_note: 'Proctor Note',
  status_change: 'Status Change',
}

export const STATUS_LABELS: Record<SessionStatus, string> = {
  active: 'Active',
  idle: 'Idle',
  disconnected: 'Disconnected',
  completed: 'Completed',
  flagged: 'Flagged',
}

export const COUNTRIES = [
  'Egypt',
  'Tunisia',
  'Saudi Arabia',
  'UAE',
  'Jordan',
  'Morocco',
  'Kuwait',
  'Qatar',
  'Bahrain',
  'Lebanon',
  'Germany',
  'France',
  'UK',
  'USA',
  'Canada',
  'India',
  'Pakistan',
  'Nigeria',
  'Kenya',
  'Brazil',
]

export const EXAM_NAMES = [
  'AWS Solutions Architect',
  'Google Cloud Professional',
  'Cybersecurity Fundamentals',
  'Data Science Certification',
  'Frontend Development Assessment',
  'Project Management Professional',
  'IELTS Academic',
  'CompTIA Security+',
  'Microsoft Azure Administrator',
  'Oracle Database SQL',
]

export const VIRTUAL_ITEM_HEIGHT = 72
export const PAGE_SIZE = 50
export const RISK_SCORE_WEIGHTS = {
  tab_switch: 8,
  face_not_detected: 20,
  multiple_faces: 25,
  phone_detected: 22,
  audio_detected: 10,
  screen_share_stopped: 15,
  connection_drop: 5,
}
