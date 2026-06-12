'use client'

import {
  X,
  User,
  Globe,
  Mail,
  Clock,
  Flag,
  ShieldAlert,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  selectSelectedSession,
  setSelectedSession,
} from '@/store/slices/sessionsSlice'
import { setDetailOpen } from '@/store/slices/uiSlice'
import { selectIsDetailOpen } from '@/store/slices/uiSlice'
import { useSessionEvents } from '@/hooks/useSessionEvents'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { IncidentTimeline } from './IncidentTimeline'
import { RiskBreakdown } from './RiskBreakdown'
import { formatDuration, formatTimestamp } from '@/lib/utils'

export function SessionDetail() {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSelectedSession)
  const isOpen = useAppSelector(selectIsDetailOpen)
  const events = useSessionEvents(session?.id ?? null)

  const close = () => {
    dispatch(setDetailOpen(false))
    dispatch(setSelectedSession(null))
  }

  const riskColor =
    session?.riskLevel === 'critical'
      ? 'var(--risk-critical)'
      : session?.riskLevel === 'high'
        ? 'var(--risk-high)'
        : session?.riskLevel === 'medium'
          ? 'var(--risk-medium)'
          : 'var(--risk-low)'

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 40,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '480px',
          maxWidth: '100vw',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '-8px 0 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {!session ? null : (
          <>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '20px 20px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {session.candidate.name}
                  </h2>
                  <StatusBadge status={session.status} />
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    margin: 0,
                  }}
                >
                  {session.examName}
                </p>
              </div>
              <button
                onClick={close}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Risk score hero */}
            <div
              style={{
                margin: '16px 20px',
                padding: '16px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '8px',
                border: `1px solid ${riskColor}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Risk Score
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '36px',
                      fontWeight: 700,
                      color: riskColor,
                      lineHeight: 1,
                    }}
                  >
                    {session.riskScore}
                  </span>
                  <span
                    style={{ fontSize: '13px', color: 'var(--text-muted)' }}
                  >
                    /100
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: riskColor,
                    marginTop: '4px',
                    textTransform: 'capitalize',
                    fontWeight: 500,
                  }}
                >
                  {session.riskLevel} risk
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  textAlign: 'right',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Flag
                    style={{
                      width: 13,
                      height: 13,
                      color: 'var(--risk-critical)',
                    }}
                  />
                  <span
                    style={{ fontSize: '13px', color: 'var(--text-primary)' }}
                  >
                    {session.criticalFlagCount} critical flags
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <ShieldAlert
                    style={{
                      width: 13,
                      height: 13,
                      color: 'var(--risk-medium)',
                    }}
                  />
                  <span
                    style={{ fontSize: '13px', color: 'var(--text-primary)' }}
                  >
                    {session.flagCount} total flags
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Clock
                    style={{
                      width: 13,
                      height: 13,
                      color: 'var(--text-muted)',
                    }}
                  />
                  <span
                    style={{ fontSize: '13px', color: 'var(--text-primary)' }}
                  >
                    {formatDuration(session.duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate info */}
            <div
              style={{
                margin: '0 20px 16px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              {[
                {
                  icon: <User style={{ width: 12, height: 12 }} />,
                  label: 'ID',
                  value: session.candidate.id.slice(0, 12),
                },
                {
                  icon: <Globe style={{ width: 12, height: 12 }} />,
                  label: 'Country',
                  value: session.candidate.country,
                },
                {
                  icon: <Mail style={{ width: 12, height: 12 }} />,
                  label: 'Email',
                  value: session.candidate.email,
                },
                {
                  icon:
                    session.status === 'disconnected' ? (
                      <WifiOff style={{ width: 12, height: 12 }} />
                    ) : (
                      <Wifi style={{ width: 12, height: 12 }} />
                    ),
                  label: 'Last Event',
                  value: formatTimestamp(session.lastEventAt),
                },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--text-muted)',
                      marginBottom: '2px',
                    }}
                  >
                    {item.icon}
                    <span
                      style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
              {/* Risk breakdown */}
              <div style={{ marginBottom: '20px' }}>
                <h3
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '10px',
                  }}
                >
                  Risk Breakdown
                </h3>
                <RiskBreakdown events={events} totalScore={session.riskScore} />
              </div>

              {/* Incident timeline */}
              <div>
                <h3
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '10px',
                  }}
                >
                  Incident Timeline ({events.length})
                </h3>
                <IncidentTimeline events={events} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
