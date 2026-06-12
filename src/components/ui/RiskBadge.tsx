import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/types'

const RISK_STYLES: Record<RiskLevel, string> = {
  low: 'text-[var(--risk-low)]',
  medium: 'text-[var(--risk-medium)]',
  high: 'text-[var(--risk-high)]',
  critical: 'text-[var(--risk-critical)] font-bold',
}

const RISK_BAR: Record<RiskLevel, string> = {
  low: 'bg-[var(--risk-low)]',
  medium: 'bg-[var(--risk-medium)]',
  high: 'bg-[var(--risk-high)]',
  critical: 'bg-[var(--risk-critical)]',
}

interface Props {
  level: RiskLevel
  score: number
}

export function RiskBadge({ level, score }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-[var(--bg-tertiary)]">
        <div
          className={cn('h-full rounded-full transition-all', RISK_BAR[level])}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn('text-xs tabular-nums', RISK_STYLES[level])}>
        {score}
      </span>
    </div>
  )
}
