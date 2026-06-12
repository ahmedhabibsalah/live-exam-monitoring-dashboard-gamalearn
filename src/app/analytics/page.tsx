'use client'

import { useHydrateSessions } from '@/hooks/useHydrateSessions'
import { useRealtimeSession } from '@/hooks/useRealtimeSession'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  selectIsLoaded,
  selectDashboardStats,
} from '@/store/slices/sessionsSlice'
import { Navbar } from '@/components/dashboard/Navbar'
import { RiskHeatmap } from '@/components/dashboard/RiskHeatmap'
import { AlertFeed } from '@/components/dashboard/AlertFeed'
import { SessionDetail } from '@/components/dashboard/SessionDetail'

const statStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  padding: '16px 20px',
}

export default function AnalyticsPage() {
  useHydrateSessions()
  useRealtimeSession()

  const isLoaded = useAppSelector(selectIsLoaded)
  const stats = useAppSelector(selectDashboardStats)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Navbar />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {!isLoaded ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Loading...
            </p>
          </div>
        ) : (
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Stats row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                {
                  label: 'Total Sessions',
                  value: stats.totalSessions.toLocaleString(),
                  color: 'var(--text-primary)',
                },
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
                {
                  label: 'Avg Risk Score',
                  value: `${stats.avgRiskScore}`,
                  color: 'var(--accent-blue)',
                },
              ].map((s) => (
                <div key={s.label} style={statStyle}>
                  <p
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: s.color,
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              {/* Heatmap */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h2
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    Risk Heatmap
                  </h2>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    Average risk score by exam × country. Darker red = higher
                    risk concentration.
                  </p>
                </div>
                <RiskHeatmap />
              </div>

              {/* Alert feed */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h2
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    Priority Alerts
                  </h2>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    Highest risk sessions requiring immediate attention.
                  </p>
                </div>
                <AlertFeed />
              </div>
            </div>
          </div>
        )}
      </div>

      <SessionDetail />
    </div>
  )
}
