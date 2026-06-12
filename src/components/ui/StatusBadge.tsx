import { cn } from '@/lib/utils'
import type { SessionStatus } from '@/types'

const STATUS_STYLES: Record<SessionStatus, string> = {
  active:
    'bg-[var(--status-active)]/15 text-[var(--status-active)] border-[var(--status-active)]/30',
  idle: 'bg-[var(--status-idle)]/15 text-[var(--status-idle)] border-[var(--status-idle)]/30',
  disconnected:
    'bg-[var(--status-disconnected)]/15 text-[var(--status-disconnected)] border-[var(--status-disconnected)]/30',
  flagged:
    'bg-[var(--status-critical)]/15 text-[var(--status-critical)] border-[var(--status-critical)]/30',
  completed:
    'bg-[var(--text-muted)]/15 text-[var(--text-muted)] border-[var(--text-muted)]/30',
}

const STATUS_DOT: Record<SessionStatus, string> = {
  active: 'bg-[var(--status-active)] animate-pulse-slow',
  idle: 'bg-[var(--status-idle)]',
  disconnected: 'bg-[var(--status-disconnected)]',
  flagged: 'bg-[var(--status-critical)] animate-pulse-slow',
  completed: 'bg-[var(--text-muted)]',
}

interface Props {
  status: SessionStatus
}

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
        STATUS_STYLES[status]
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[status])} />
      {status}
    </span>
  )
}
