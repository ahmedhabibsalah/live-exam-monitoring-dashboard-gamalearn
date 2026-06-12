'use client'

import { Flag, Clock, Wifi, WifiOff } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { formatDuration, formatTimestamp, cn } from '@/lib/utils'
import type { ExamSession } from '@/types'

interface Props {
  session: ExamSession
  onClick: () => void
}

export function SessionCard({ session, onClick }: Props) {
  const isCritical = session.riskLevel === 'critical'
  const isDisconnected = session.status === 'disconnected'

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border bg-[var(--bg-elevated)] p-4 text-left transition-all duration-200',
        'hover:border-[var(--accent-blue)] hover:bg-[var(--bg-tertiary)]',
        'focus:ring-1 focus:ring-[var(--accent-blue)] focus:outline-none',
        isCritical
          ? 'glow-critical border-[var(--risk-critical)]/40'
          : 'border-[var(--border-subtle)]'
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--text-primary)]">
            {session.candidate.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
            {session.candidate.country} · {session.examName}
          </p>
        </div>
        <div className="shrink-0">
          {isDisconnected ? (
            <WifiOff className="h-4 w-4 text-[var(--status-disconnected)]" />
          ) : (
            <Wifi className="h-4 w-4 text-[var(--status-active)] opacity-50" />
          )}
        </div>
      </div>

      {/* Status + Risk */}
      <div className="mb-3 flex items-center justify-between">
        <StatusBadge status={session.status} />
        <RiskBadge level={session.riskLevel} score={session.riskScore} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDuration(session.duration)}</span>
        </div>
        {session.flagCount > 0 && (
          <div
            className={cn(
              'flex items-center gap-1',
              session.criticalFlagCount > 0 && 'text-[var(--risk-critical)]'
            )}
          >
            <Flag className="h-3 w-3" />
            <span>
              {session.flagCount} flag{session.flagCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        <span className="font-mono">
          {formatTimestamp(session.lastEventAt)}
        </span>
      </div>
    </button>
  )
}
