'use client'

import { Flag, WifiOff } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { formatDuration, formatTimestamp, cn } from '@/lib/utils'
import type { ExamSession } from '@/types'
import { memo } from 'react'

interface Props {
  session: ExamSession
  onClick: () => void
  style?: React.CSSProperties
}

export const SessionRow = memo(function SessionRow({
  session,
  onClick,
  style,
}: Props) {
  const isCritical = session.riskLevel === 'critical'

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingLeft: '24px',
        paddingRight: '24px',
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-subtle)',
        borderLeft: isCritical ? '2px solid var(--risk-critical)' : undefined,
        transition: 'background 0.15s',
      }}
      className="hover:bg-[var(--bg-elevated)] focus:bg-[var(--bg-elevated)] focus:outline-none"
    >
      {/* Candidate */}
      <div style={{ width: '192px', minWidth: 0, flexShrink: 0 }}>
        <p
          style={{
            fontSize: '14px',
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
            fontSize: '12px',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {session.candidate.country}
        </p>
      </div>

      {/* Exam */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {session.examName}
        </p>
      </div>

      {/* Status */}
      <div style={{ width: '128px', flexShrink: 0 }}>
        <StatusBadge status={session.status} />
      </div>

      {/* Risk */}
      <div style={{ width: '128px', flexShrink: 0 }}>
        <RiskBadge level={session.riskLevel} score={session.riskScore} />
      </div>

      {/* Duration */}
      <div
        style={{
          width: '80px',
          flexShrink: 0,
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        {formatDuration(session.duration)}
      </div>

      {/* Flags */}
      <div
        style={{
          width: '64px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
        }}
      >
        {session.flagCount > 0 ? (
          <>
            <Flag
              style={{
                width: '12px',
                height: '12px',
                color:
                  session.criticalFlagCount > 0
                    ? 'var(--risk-critical)'
                    : 'var(--risk-medium)',
              }}
            />
            <span
              style={{
                color:
                  session.criticalFlagCount > 0
                    ? 'var(--risk-critical)'
                    : 'var(--text-muted)',
              }}
            >
              {session.flagCount}
            </span>
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>—</span>
        )}
      </div>

      {/* Last event */}
      <div
        style={{
          width: '80px',
          flexShrink: 0,
          textAlign: 'right',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        {formatTimestamp(session.lastEventAt)}
      </div>

      {/* Disconnected */}
      {session.status === 'disconnected' && (
        <WifiOff
          style={{
            width: '14px',
            height: '14px',
            flexShrink: 0,
            color: 'var(--status-disconnected)',
          }}
        />
      )}
    </div>
  )
})
