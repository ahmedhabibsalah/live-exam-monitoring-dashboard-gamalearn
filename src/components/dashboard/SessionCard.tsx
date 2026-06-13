'use client'

import { Flag, Clock, Wifi, WifiOff } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { formatDuration, formatTimestamp } from '@/lib/utils'
import type { ExamSession } from '@/types'
import { memo } from 'react'

interface Props {
  session: ExamSession
  onClick: () => void
}

export const SessionCard = memo(function SessionCard({
  session,
  onClick,
}: Props) {
  const isCritical = session.riskLevel === 'critical'
  const isDisconnected = session.status === 'disconnected'

  return (
    <button
      onClick={onClick}
      aria-label={`Session: ${session.candidate.name}, ${session.status}, risk ${session.riskScore}`}
      style={{
        width: '100%',
        borderRadius: '8px',
        border: `1px solid ${isCritical ? 'rgba(239,68,68,0.4)' : 'var(--border-subtle)'}`,
        backgroundColor: 'var(--bg-elevated)',
        padding: '14px 16px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: isCritical ? '0 0 12px rgba(239,68,68,0.15)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-blue)'
        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isCritical
          ? 'rgba(239,68,68,0.4)'
          : 'var(--border-subtle)'
        e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'
      }}
    >
      {/* Header — name + wifi icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
          >
            {session.candidate.name}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              marginTop: '2px',
            }}
          >
            {session.candidate.country} · {session.examName}
          </p>
        </div>
        <div style={{ flexShrink: 0, paddingTop: '2px' }}>
          {isDisconnected ? (
            <WifiOff
              style={{
                width: 14,
                height: 14,
                color: 'var(--status-disconnected)',
              }}
            />
          ) : (
            <Wifi
              style={{
                width: 14,
                height: 14,
                color: 'var(--status-active)',
                opacity: 0.5,
              }}
            />
          )}
        </div>
      </div>

      {/* Status + Risk */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <StatusBadge status={session.status} />
        <RiskBadge level={session.riskLevel} score={session.riskScore} />
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock style={{ width: 12, height: 12 }} />
          <span>{formatDuration(session.duration)}</span>
        </div>
        {session.flagCount > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color:
                session.criticalFlagCount > 0
                  ? 'var(--risk-critical)'
                  : 'var(--text-muted)',
            }}
          >
            <Flag style={{ width: 12, height: 12 }} />
            <span>
              {session.flagCount} flag{session.flagCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        <span style={{ fontFamily: 'monospace' }}>
          {formatTimestamp(session.lastEventAt)}
        </span>
      </div>
    </button>
  )
})
