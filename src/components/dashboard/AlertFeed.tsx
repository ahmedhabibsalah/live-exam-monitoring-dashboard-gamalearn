'use client'

import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import {
  selectAllSessions,
  setSelectedSession,
} from '@/store/slices/sessionsSlice'
import { setDetailOpen } from '@/store/slices/uiSlice'
import { SeverityIcon } from '@/components/ui/SeverityIcon'
import { formatTimestamp } from '@/lib/utils'

export function AlertFeed() {
  const dispatch = useAppDispatch()
  const sessions = useAppSelector(selectAllSessions)

  const criticalSessions = useMemo(
    () =>
      [...sessions]
        .filter((s) => s.riskLevel === 'critical' || s.riskLevel === 'high')
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 8),
    [sessions]
  )

  const handleClick = (sessionId: string) => {
    dispatch(setSelectedSession(sessionId))
    dispatch(setDetailOpen(true))
  }

  if (criticalSessions.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {criticalSessions.map((session) => (
        <div
          key={session.id}
          onClick={() => handleClick(session.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = 'var(--accent-blue)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = 'var(--border-subtle)')
          }
        >
          <SeverityIcon
            severity={session.riskLevel === 'critical' ? 'critical' : 'warning'}
            size={16}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {session.candidate.name}
            </p>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {session.examName} · {session.candidate.country}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color:
                  session.riskLevel === 'critical'
                    ? 'var(--risk-critical)'
                    : 'var(--risk-high)',
              }}
            >
              {session.riskScore}
            </p>
            <p
              style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                fontFamily: 'monospace',
              }}
            >
              {formatTimestamp(session.lastEventAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
