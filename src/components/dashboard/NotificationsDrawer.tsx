'use client'

import { X } from 'lucide-react'
import { AlertFeed } from './AlertFeed'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectDashboardStats } from '@/store/slices/sessionsSlice'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsDrawer({ isOpen, onClose }: Props) {
  const stats = useAppSelector(selectDashboardStats)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: '52px',
          right: 0,
          width: '360px',
          maxWidth: '100vw',
          maxHeight: 'calc(100vh - 52px)',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          borderBottomLeftRadius: '8px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '-4px 4px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Priority Alerts
            </h3>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              {stats.criticalSessions} critical · {stats.flaggedSessions}{' '}
              flagged
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              borderRadius: '6px',
            }}
          >
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Alert feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <AlertFeed />
        </div>
      </div>
    </>
  )
}
