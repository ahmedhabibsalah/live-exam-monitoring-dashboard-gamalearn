'use client'

import { useHydrateSessions } from '@/hooks/useHydrateSessions'
import { useRealtimeSession } from '@/hooks/useRealtimeSession'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectIsLoaded } from '@/store/slices/sessionsSlice'
import { Navbar } from '@/components/dashboard/Navbar'
import { FilterBar } from '@/components/dashboard/FilterBar'
import { SessionsList } from '@/components/dashboard/SessionsList'
import { SessionDetail } from '@/components/dashboard/SessionDetail'

export default function Home() {
  useHydrateSessions()
  useRealtimeSession()

  const isLoaded = useAppSelector(selectIsLoaded)

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
      <FilterBar />

      {!isLoaded ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '2px solid var(--accent-blue)',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Loading sessions...
          </p>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <SessionsList />
        </div>
      )}

      <SessionDetail />
    </div>
  )
}
