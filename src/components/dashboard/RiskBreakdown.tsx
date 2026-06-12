'use client'

import type { SessionEvent } from '@/types'
import { EVENT_LABELS } from '@/constants'
import { RISK_SCORE_WEIGHTS } from '@/constants'

interface Props {
  events: SessionEvent[]
  totalScore: number
}

export function RiskBreakdown({ events, totalScore }: Props) {
  // Count by type
  const counts: Record<string, number> = {}
  events.forEach((e) => {
    if (RISK_SCORE_WEIGHTS[e.type as keyof typeof RISK_SCORE_WEIGHTS]) {
      counts[e.type] = (counts[e.type] || 0) + 1
    }
  })

  const entries = Object.entries(counts).sort((a, b) => {
    const aWeight =
      RISK_SCORE_WEIGHTS[a[0] as keyof typeof RISK_SCORE_WEIGHTS] || 0
    const bWeight =
      RISK_SCORE_WEIGHTS[b[0] as keyof typeof RISK_SCORE_WEIGHTS] || 0
    return bWeight * b[1] - aWeight * a[1]
  })

  if (entries.length === 0) {
    return (
      <div
        style={{
          padding: '16px',
          color: 'var(--text-muted)',
          fontSize: '13px',
          textAlign: 'center',
        }}
      >
        No risk factors detected
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '4px 0',
      }}
    >
      {entries.map(([type, count]) => {
        const weight =
          RISK_SCORE_WEIGHTS[type as keyof typeof RISK_SCORE_WEIGHTS] || 0
        const contribution = Math.min(100, weight * count)
        const pct = totalScore > 0 ? (contribution / totalScore) * 100 : 0

        return (
          <div key={type}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <span
                style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
              >
                {EVENT_LABELS[type as keyof typeof EVENT_LABELS]} ×{count}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)',
                }}
              >
                +{contribution}
              </span>
            </div>
            <div
              style={{
                height: '4px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '9999px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, pct)}%`,
                  backgroundColor:
                    contribution >= 20
                      ? 'var(--risk-critical)'
                      : contribution >= 10
                        ? 'var(--risk-high)'
                        : 'var(--risk-medium)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
