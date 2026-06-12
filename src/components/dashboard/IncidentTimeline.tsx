'use client'

import { SeverityIcon } from '@/components/ui/SeverityIcon'
import { EVENT_LABELS } from '@/constants'
import { formatTimestamp } from '@/lib/utils'
import type { SessionEvent } from '@/types'

interface Props {
  events: SessionEvent[]
}

export function IncidentTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}
      >
        No events recorded for this session
      </div>
    )
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {sorted.map((event, i) => (
        <div
          key={event.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '10px 16px',
            backgroundColor:
              i % 2 === 0 ? 'var(--bg-secondary)' : 'transparent',
            borderRadius: '6px',
            borderLeft:
              event.severity === 'critical'
                ? '2px solid var(--risk-critical)'
                : event.severity === 'warning'
                  ? '2px solid var(--risk-medium)'
                  : '2px solid transparent',
          }}
        >
          <div style={{ paddingTop: '2px' }}>
            <SeverityIcon severity={event.severity} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color:
                    event.severity === 'critical'
                      ? 'var(--risk-critical)'
                      : event.severity === 'warning'
                        ? 'var(--risk-medium)'
                        : 'var(--text-primary)',
                }}
              >
                {EVENT_LABELS[event.type]}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                }}
              >
                {formatTimestamp(event.timestamp)}
              </span>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              {event.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
