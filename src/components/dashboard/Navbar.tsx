'use client'

import { Shield, Bell, LayoutGrid, List } from 'lucide-react'
import { ConnectionStatus } from '@/components/ui/ConnectionStatus'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setPanelView } from '@/store/slices/uiSlice'
import { selectPanelView } from '@/store/slices/uiSlice'
import { selectDashboardStats } from '@/store/slices/sessionsSlice'
import { cn } from '@/lib/utils'

export function Navbar() {
  const dispatch = useAppDispatch()
  const view = useAppSelector(selectPanelView)
  const stats = useAppSelector(selectDashboardStats)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[var(--accent-blue)]" />
          <span className="font-semibold tracking-tight text-[var(--text-primary)]">
            ExamGuard
          </span>
          {stats.criticalSessions > 0 && (
            <span className="rounded-full bg-[var(--status-critical)] px-2 py-0.5 text-xs font-medium text-white">
              {stats.criticalSessions} critical
            </span>
          )}
        </div>

        {/* Center — quick stats */}
        <div className="hidden items-center gap-6 text-xs md:flex">
          {[
            { label: 'Total', value: stats.totalSessions },
            { label: 'Active', value: stats.activeSessions },
            { label: 'Flagged', value: stats.flaggedSessions },
            { label: 'Avg Risk', value: `${stats.avgRiskScore}%` },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-semibold text-[var(--text-primary)]">
                {s.value}
              </p>
              <p className="text-[var(--text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <ConnectionStatus />

          {/* View toggle */}
          <div className="flex overflow-hidden rounded-md border border-[var(--border-default)]">
            <button
              onClick={() => dispatch(setPanelView('grid'))}
              className={cn(
                'p-1.5 transition-colors',
                view === 'grid'
                  ? 'bg-[var(--accent-blue)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => dispatch(setPanelView('list'))}
              className={cn(
                'p-1.5 transition-colors',
                view === 'list'
                  ? 'bg-[var(--accent-blue)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            className="relative p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {stats.criticalSessions > 0 && (
              <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-[var(--status-critical)]" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
