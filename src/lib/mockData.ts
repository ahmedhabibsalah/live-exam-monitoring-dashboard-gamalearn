import type {
  ExamSession,
  SessionEvent,
  SessionStatus,
  EventType,
  Candidate,
} from '@/types'
import {
  COUNTRIES,
  EXAM_NAMES,
  EVENT_SEVERITY_MAP,
  RISK_SCORE_WEIGHTS,
} from '@/constants'
import { getRiskLevel } from '@/lib/utils'

const FIRST_NAMES = [
  'Ahmed',
  'Sara',
  'Mohamed',
  'Fatima',
  'Omar',
  'Layla',
  'Youssef',
  'Nour',
  'Khaled',
  'Hana',
  'James',
  'Emily',
  'Carlos',
  'Priya',
  'David',
  'Aisha',
  'Lucas',
  'Mei',
  'Ivan',
  'Amara',
]

const LAST_NAMES = [
  'Hassan',
  'Ali',
  'Ibrahim',
  'Mahmoud',
  'Smith',
  'Johnson',
  'Garcia',
  'Patel',
  'Kim',
  'Müller',
  'Dubois',
  'Rossi',
  'Santos',
  'Nguyen',
  'Ahmed',
]

const EVENT_TYPES: EventType[] = [
  'tab_switch',
  'face_not_detected',
  'multiple_faces',
  'phone_detected',
  'audio_detected',
  'screen_share_stopped',
  'connection_drop',
  'connection_restored',
  'proctor_note',
  'status_change',
]

const SUSPICIOUS_EVENTS: EventType[] = [
  'tab_switch',
  'face_not_detected',
  'multiple_faces',
  'phone_detected',
  'audio_detected',
  'screen_share_stopped',
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 11)
}

function generateCandidate(index: number): Candidate {
  const firstName = randomItem(FIRST_NAMES)
  const lastName = randomItem(LAST_NAMES)
  const country = randomItem(COUNTRIES)
  return {
    id: `cand_${randomId()}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@exam.io`,
    country,
    timezone: 'UTC+' + randomInt(0, 5),
  }
}

function generateEvents(
  sessionId: string,
  count: number,
  baseTime: Date
): SessionEvent[] {
  const events: SessionEvent[] = []
  for (let i = 0; i < count; i++) {
    const type = randomItem(EVENT_TYPES)
    const timestamp = new Date(baseTime.getTime() + randomInt(0, 3600000))
    events.push({
      id: `evt_${randomId()}`,
      sessionId,
      type,
      severity: EVENT_SEVERITY_MAP[type],
      message: generateEventMessage(type),
      timestamp: timestamp.toISOString(),
    })
  }
  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}

function generateEventMessage(type: EventType): string {
  const messages: Record<EventType, string[]> = {
    tab_switch: [
      'Candidate switched to another tab',
      'Browser tab change detected',
    ],
    face_not_detected: [
      'Face not visible in camera feed',
      'Candidate moved out of frame',
    ],
    multiple_faces: [
      'Multiple faces detected in frame',
      'Additional person detected',
    ],
    phone_detected: ['Mobile device detected', 'Phone visible in camera frame'],
    audio_detected: [
      'Unauthorized audio detected',
      'Background conversation detected',
    ],
    screen_share_stopped: [
      'Screen sharing was stopped',
      'Screen feed interrupted',
    ],
    connection_drop: [
      'Candidate connection lost',
      'Network interruption detected',
    ],
    connection_restored: [
      'Connection restored',
      'Candidate reconnected successfully',
    ],
    proctor_note: ['Proctor flagged for review', 'Manual review initiated'],
    status_change: ['Session status updated', 'Candidate status changed'],
  }
  return randomItem(messages[type])
}

function calculateRiskScore(events: SessionEvent[]): number {
  let score = 0
  for (const event of events) {
    const weight =
      RISK_SCORE_WEIGHTS[event.type as keyof typeof RISK_SCORE_WEIGHTS]
    if (weight) score += weight
  }
  return Math.min(100, score)
}

const STATUSES: SessionStatus[] = [
  'active',
  'idle',
  'disconnected',
  'flagged',
  'completed',
]

export function generateSessions(count: number = 10000): {
  sessions: ExamSession[]
  events: Map<string, SessionEvent[]>
} {
  const sessions: ExamSession[] = []
  const eventsMap = new Map<string, SessionEvent[]>()
  const baseTime = new Date(Date.now() - 3600000) // 1 hour ago

  // Weight distribution: mostly active/idle, some flagged, few disconnected
  const statusWeights: SessionStatus[] = [
    ...Array(55).fill('active'),
    ...Array(20).fill('idle'),
    ...Array(12).fill('flagged'),
    ...Array(8).fill('disconnected'),
    ...Array(5).fill('completed'),
  ]

  const examIds = EXAM_NAMES.map((_, i) => `exam_${i + 1}`)

  for (let i = 0; i < count; i++) {
    const sessionId = `sess_${randomId()}`
    const status = randomItem(statusWeights)
    const eventCount =
      status === 'flagged'
        ? randomInt(2, 6)
        : status === 'active'
          ? randomInt(0, 3)
          : randomInt(0, 2)

    const sessionEvents = generateEvents(sessionId, eventCount, baseTime)
    const suspiciousEvents = sessionEvents.filter((e) =>
      SUSPICIOUS_EVENTS.includes(e.type)
    )
    const riskScore = calculateRiskScore(suspiciousEvents)
    const examIndex = randomInt(0, EXAM_NAMES.length - 1)

    const session: ExamSession = {
      id: sessionId,
      candidate: generateCandidate(i),
      examId: examIds[examIndex],
      examName: EXAM_NAMES[examIndex],
      status,
      riskScore,
      riskLevel: getRiskLevel(riskScore),
      startedAt: new Date(
        baseTime.getTime() + randomInt(0, 1800000)
      ).toISOString(),
      duration: randomInt(300, 7200),
      flagCount: suspiciousEvents.length,
      criticalFlagCount: sessionEvents.filter((e) => e.severity === 'critical')
        .length,
      lastEventAt:
        sessionEvents.length > 0
          ? sessionEvents[sessionEvents.length - 1].timestamp
          : baseTime.toISOString(),
      proctorId: Math.random() > 0.7 ? `proctor_${randomInt(1, 10)}` : null,
      notes: [],
    }

    sessions.push(session)
    eventsMap.set(sessionId, sessionEvents)
  }

  return { sessions, events: eventsMap }
}

// Singleton so we generate once per app session
let _cache: ReturnType<typeof generateSessions> | null = null

export function getMockData() {
  if (!_cache) _cache = generateSessions(10000)
  return _cache
}
