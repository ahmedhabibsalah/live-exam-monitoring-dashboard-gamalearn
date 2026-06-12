'use client'

import { useHydrateSessions } from '@/hooks/useHydrateSessions'
import { useRealtimeSession } from '@/hooks/useRealtimeSession'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectIsLoaded } from '@/store/slices/sessionsSlice'
import { selectDashboardStats } from '@/store/slices/sessionsSlice'
import { ConnectionStatus } from '@/components/ui/ConnectionStatus'

export default function Home() {
  useHydrateSessions()
  useRealtimeSession()

  const isLoaded = useAppSelector(selectIsLoaded)
  const stats = useAppSelector(selectDashboardStats)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          ExamGuard
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Live Monitoring Dashboard
        </p>
      </div>

      <ConnectionStatus />

      {!isLoaded ? (
        <p className="text-sm text-[var(--text-muted)]">Loading sessions...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-5">
          {[
            { label: 'Total', value: stats.totalSessions },
            { label: 'Active', value: stats.activeSessions },
            { label: 'Flagged', value: stats.flaggedSessions },
            { label: 'Critical', value: stats.criticalSessions },
            { label: 'Avg Risk', value: `${stats.avgRiskScore}%` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-6 py-4"
            >
              <p className="text-xl font-bold text-[var(--text-primary)]">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
