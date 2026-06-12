import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import type { EventSeverity } from '@/types'

interface Props {
  severity: EventSeverity
  size?: number
}

export function SeverityIcon({ severity, size = 14 }: Props) {
  if (severity === 'critical') {
    return (
      <AlertCircle
        style={{
          width: size,
          height: size,
          color: 'var(--risk-critical)',
          flexShrink: 0,
        }}
      />
    )
  }
  if (severity === 'warning') {
    return (
      <AlertTriangle
        style={{
          width: size,
          height: size,
          color: 'var(--risk-medium)',
          flexShrink: 0,
        }}
      />
    )
  }
  return (
    <Info
      style={{
        width: size,
        height: size,
        color: 'var(--text-muted)',
        flexShrink: 0,
      }}
    />
  )
}
