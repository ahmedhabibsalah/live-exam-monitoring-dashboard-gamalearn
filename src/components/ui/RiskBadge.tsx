import type { RiskLevel } from '@/types'

const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'var(--risk-low)',
  medium: 'var(--risk-medium)',
  high: 'var(--risk-high)',
  critical: 'var(--risk-critical)',
}

interface Props {
  level: RiskLevel
  score: number
}

export function RiskBadge({ level, score }: Props) {
  const color = RISK_COLORS[level]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          height: '4px',
          width: '64px',
          borderRadius: '9999px',
          backgroundColor: 'var(--bg-tertiary)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            borderRadius: '9999px',
            backgroundColor: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <span
        style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          color,
          fontWeight: level === 'critical' ? 700 : 400,
          minWidth: '24px',
        }}
      >
        {score}
      </span>
    </div>
  )
}
