'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
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
const CARD_HEIGHT = 160
const CARD_MIN_WIDTH = 280
const GRID_GAP = 12

export function SessionsList() {
  const dispatch = useAppDispatch()
  const sessions = useAppSelector(selectFilteredSessions)
  const view = useAppSelector(selectPanelView)
  const parentRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (!parentRef.current) return

    // Set immediately on mount
    setContainerWidth(parentRef.current.clientWidth)

    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width)
    })
    observer.observe(parentRef.current)
    return () => observer.disconnect()
  }, [])

  // Recalculate columns when view changes
  const columns =
    containerWidth > 0
      ? Math.max(
          1,
          Math.floor((containerWidth + GRID_GAP) / (CARD_MIN_WIDTH + GRID_GAP))
        )
      : 3 // fallback to 3 columns while measuring

  const handleSelect = useCallback(
    (sessionId: string) => {
      dispatch(setSelectedSession(sessionId))
      dispatch(setDetailOpen(true))
    },
    [dispatch]
  )

  // Grid columns based on container width

  const rowCount = Math.ceil(sessions.length / columns)

  const gridVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT + GRID_GAP,
    overscan: 3,
  })

  const listVirtualizer = useVirtualizer({
    count: sessions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

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
      <div
        ref={parentRef}
        style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}
      >
        <div
          style={{
            height: `${gridVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {gridVirtualizer.getVirtualItems().map((virtualRow) => {
            const startIndex = virtualRow.index * columns
            const rowSessions = sessions.slice(startIndex, startIndex + columns)

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: `${GRID_GAP}px`,
                  alignContent: 'start',
                }}
              >
                {rowSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => handleSelect(session.id)}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div ref={parentRef} style={{ flex: 1, overflow: 'auto' }}>
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
          height: `${listVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {listVirtualizer.getVirtualItems().map((virtualRow) => {
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
