'use client'

import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { selectFilteredSessions } from '@/store/slices/filtersSlice'
import { selectPanelView } from '@/store/slices/uiSlice'
import { setSelectedSession } from '@/store/slices/sessionsSlice'
import { setDetailOpen } from '@/store/slices/uiSlice'
import { SessionCard } from './SessionCard'
import { SessionRow } from './SessionRow'
import { EmptyState } from '@/components/ui/EmptyState'

const ROW_HEIGHT = 72
const CARD_HEIGHT = 152

export function SessionsList() {
  const dispatch = useAppDispatch()
  const sessions = useAppSelector(selectFilteredSessions)
  const view = useAppSelector(selectPanelView)
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: sessions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (view === 'grid' ? CARD_HEIGHT : ROW_HEIGHT),
    overscan: 8,
  })

  const handleSelect = (sessionId: string) => {
    dispatch(setSelectedSession(sessionId))
    dispatch(setDetailOpen(true))
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No sessions match your filters"
        description="Try adjusting the search or filter criteria"
      />
    )
  }

  if (view === 'grid') {
    return (
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '12px',
          }}
        >
          {' '}
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClick={() => handleSelect(session.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={parentRef} style={{ flex: 1, overflow: 'auto', height: '100%' }}>
      {/* List header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '8px',
          paddingBottom: '8px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ width: '192px', flexShrink: 0 }}>Candidate</span>
        <span style={{ flex: 1 }}>Exam</span>
        <span style={{ width: '128px', flexShrink: 0 }}>Status</span>
        <span style={{ width: '128px', flexShrink: 0 }}>Risk</span>
        <span style={{ width: '80px', flexShrink: 0 }}>Duration</span>
        <span style={{ width: '64px', flexShrink: 0 }}>Flags</span>
        <span style={{ width: '80px', flexShrink: 0, textAlign: 'right' }}>
          Last Event
        </span>
      </div>

      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const session = sessions[virtualRow.index]
          return (
            <SessionRow
              key={virtualRow.key}
              session={session}
              onClick={() => handleSelect(session.id)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
