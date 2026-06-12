'use client'

import { useHydrateSessions } from '@/hooks/useHydrateSessions'
import { useRealtimeSession } from '@/hooks/useRealtimeSession'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectIsLoaded } from '@/store/slices/sessionsSlice'
import { Navbar } from '@/components/dashboard/Navbar'
import { FilterBar } from '@/components/dashboard/FilterBar'
import { SessionsList } from '@/components/dashboard/SessionsList'

export default function Home() {
  useHydrateSessions()
  useRealtimeSession()

  const isLoaded = useAppSelector(selectIsLoaded)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <FilterBar />

      {!isLoaded ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent-blue)] border-t-transparent" />
          <p className="text-sm text-[var(--text-muted)]">
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
    </div>
  )
}
