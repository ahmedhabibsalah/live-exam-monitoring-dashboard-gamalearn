'use client'

import { useAppSelector } from '@/hooks/useAppSelector'
import { selectRealtimeConnected } from '@/store/slices/uiSlice'

export function ConnectionStatus() {
  const connected = useAppSelector(selectRealtimeConnected)

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`h-2 w-2 rounded-full ${
          connected
            ? 'animate-pulse-slow bg-[var(--status-active)]'
            : 'bg-[var(--status-critical)]'
        }`}
      />
      <span
        className={
          connected
            ? 'text-[var(--text-secondary)]'
            : 'text-[var(--status-critical)]'
        }
      >
        {connected ? 'Live' : 'Reconnecting...'}
      </span>
    </div>
  )
}
