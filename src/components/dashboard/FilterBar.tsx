'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  setSearch,
  setStatus,
  setRiskLevel,
  setSortBy,
  setSortOrder,
  resetFilters,
  selectFilters,
} from '@/store/slices/filtersSlice'
import { selectFilteredSessions } from '@/store/slices/filtersSlice'
import { cn } from '@/lib/utils'
import type { FilterState, SessionStatus, RiskLevel } from '@/types'

const STATUS_OPTIONS: { value: SessionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'idle', label: 'Idle' },
  { value: 'disconnected', label: 'Disconnected' },
  { value: 'completed', label: 'Completed' },
]

const RISK_OPTIONS: { value: RiskLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All Risk' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const SORT_OPTIONS: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'riskScore', label: 'Risk Score' },
  { value: 'flagCount', label: 'Flag Count' },
  { value: 'lastEventAt', label: 'Last Event' },
  { value: 'startedAt', label: 'Start Time' },
]

const selectClass =
  'rounded-md border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors'

export function FilterBar() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectFilters)
  const filtered = useAppSelector(selectFilteredSessions)
  const isFiltered =
    filters.search || filters.status !== 'all' || filters.riskLevel !== 'all'

  return (
    <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3 md:px-6">
      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
        {/* Search */}
        <div className="relative max-w-sm min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search candidate, exam..."
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-tertiary)] py-1.5 pr-3 pl-8 text-xs text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-blue)] focus:outline-none"
          />
          {filters.search && (
            <button
              onClick={() => dispatch(setSearch(''))}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) =>
            dispatch(setStatus(e.target.value as SessionStatus | 'all'))
          }
          className={selectClass}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Risk */}
        <select
          value={filters.riskLevel}
          onChange={(e) =>
            dispatch(setRiskLevel(e.target.value as RiskLevel | 'all'))
          }
          className={selectClass}
        >
          {RISK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              dispatch(setSortBy(e.target.value as FilterState['sortBy']))
            }
            className={selectClass}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              dispatch(
                setSortOrder(filters.sortOrder === 'desc' ? 'asc' : 'desc')
              )
            }
            className={cn(selectClass, 'px-2 font-mono')}
            aria-label="Toggle sort order"
          >
            {filters.sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>

        {/* Result count + reset */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">
            {filtered.length.toLocaleString()} sessions
          </span>
          {isFiltered && (
            <button
              onClick={() => dispatch(resetFilters())}
              className="text-xs text-[var(--accent-blue)] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
