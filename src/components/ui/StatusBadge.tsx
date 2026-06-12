import type { SessionStatus } from '@/types'

const STATUS_COLORS: Record<
  SessionStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  active: {
    bg: 'rgba(34,197,94,0.12)',
    text: 'var(--status-active)',
    border: 'rgba(34,197,94,0.3)',
    dot: 'var(--status-active)',
  },
  idle: {
    bg: 'rgba(100,116,139,0.12)',
    text: 'var(--status-idle)',
    border: 'rgba(100,116,139,0.3)',
    dot: 'var(--status-idle)',
  },
  disconnected: {
    bg: 'rgba(99,102,241,0.12)',
    text: 'var(--status-disconnected)',
    border: 'rgba(99,102,241,0.3)',
    dot: 'var(--status-disconnected)',
  },
  flagged: {
    bg: 'rgba(239,68,68,0.12)',
    text: 'var(--status-critical)',
    border: 'rgba(239,68,68,0.3)',
    dot: 'var(--status-critical)',
  },
  completed: {
    bg: 'rgba(71,85,105,0.12)',
    text: 'var(--text-muted)',
    border: 'rgba(71,85,105,0.3)',
    dot: 'var(--text-muted)',
  },
}

interface Props {
  status: SessionStatus
}

export function StatusBadge({ status }: Props) {
  const colors = STATUS_COLORS[status]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '9999px',
        padding: '3px 10px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: colors.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  )
}
