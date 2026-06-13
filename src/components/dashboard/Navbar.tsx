'use client'
import { useState } from 'react'
import { NotificationsDrawer } from './NotificationsDrawer'
import { Shield, Bell, LayoutGrid, List } from 'lucide-react'
import { ConnectionStatus } from '@/components/ui/ConnectionStatus'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setPanelView } from '@/store/slices/uiSlice'
import { selectPanelView } from '@/store/slices/uiSlice'
import { selectDashboardStats } from '@/store/slices/sessionsSlice'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const dispatch = useAppDispatch()
  const view = useAppSelector(selectPanelView)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const stats = useAppSelector(selectDashboardStats)
  const pathname = usePathname()
  const isMonitor = pathname === '/'

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      {/* Main row */}
      <div
        style={{
          display: 'flex',
          height: '52px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          gap: '12px',
        }}
      >
        {/* Left — logo + nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <Shield
              aria-hidden="true"
              style={{ width: 18, height: 18, color: 'var(--accent-blue)' }}
            />
            <span
              style={{
                fontWeight: 600,
                fontSize: '15px',
                color: 'var(--text-primary)',
              }}
            >
              ExamGuard
            </span>
            {stats.criticalSessions > 0 && (
              <span
                role="status"
                aria-live="polite"
                aria-label={`${stats.criticalSessions} critical sessions`}
                style={{
                  backgroundColor: 'var(--status-critical)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {stats.criticalSessions} critical
              </span>
            )}
          </div>

          <nav
            aria-label="Main navigation"
            style={{ display: 'flex', gap: '2px' }}
          >
            {[
              { href: '/', label: 'Monitor' },
              { href: '/analytics', label: 'Analytics' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  backgroundColor:
                    pathname === link.href
                      ? 'var(--bg-elevated)'
                      : 'transparent',
                  color:
                    pathname === link.href
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <ConnectionStatus />

          {/* View toggle — monitor only */}
          {isMonitor && (
            <div
              role="group"
              aria-label="View mode"
              style={{
                display: 'flex',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                overflow: 'hidden',
              }}
            >
              {[
                {
                  mode: 'grid' as const,
                  icon: <LayoutGrid style={{ width: 14, height: 14 }} />,
                  label: 'Grid view',
                },
                {
                  mode: 'list' as const,
                  icon: <List style={{ width: 14, height: 14 }} />,
                  label: 'List view',
                },
              ].map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => dispatch(setPanelView(mode))}
                  aria-label={label}
                  aria-pressed={view === mode}
                  style={{
                    padding: '6px 8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor:
                      view === mode ? 'var(--accent-blue)' : 'transparent',
                    color: view === mode ? 'white' : 'var(--text-muted)',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <button
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((prev) => !prev)}
              style={{
                position: 'relative',
                padding: '6px',
                border: 'none',
                backgroundColor: notificationsOpen
                  ? 'var(--bg-elevated)'
                  : 'transparent',
                color: notificationsOpen
                  ? 'var(--text-primary)'
                  : 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.15s',
              }}
            >
              <Bell style={{ width: 16, height: 16 }} />
              {stats.criticalSessions > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--status-critical)',
                  }}
                />
              )}
            </button>

            <NotificationsDrawer
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Mobile stats bar */}
      <div
        role="region"
        aria-label="Dashboard summary"
        style={{
          display: 'flex',
          gap: '16px',
          padding: '6px 16px',
          borderTop: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {[
          { label: 'Total', value: stats.totalSessions.toLocaleString() },
          {
            label: 'Active',
            value: stats.activeSessions.toLocaleString(),
            color: 'var(--status-active)',
          },
          {
            label: 'Flagged',
            value: stats.flaggedSessions.toLocaleString(),
            color: 'var(--status-warning)',
          },
          {
            label: 'Critical',
            value: stats.criticalSessions.toLocaleString(),
            color: 'var(--risk-critical)',
          },
          { label: 'Avg Risk', value: `${stats.avgRiskScore}%` },
        ].map((s) => (
          <div key={s.label} style={{ flexShrink: 0, textAlign: 'center' }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: s.color || 'var(--text-primary)',
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </header>
  )
}
