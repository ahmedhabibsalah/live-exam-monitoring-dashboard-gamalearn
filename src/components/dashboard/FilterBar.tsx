'use client'

import { Search, X, SlidersHorizontal } from 'lucide-react'
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
  selectFilteredSessions,
} from '@/store/slices/filtersSlice'
import type { FilterState, SessionStatus, RiskLevel } from '@/types'

const selectStyle: React.CSSProperties = {
  borderRadius: '6px',
  border: '1px solid var(--border-default)',
  backgroundColor: 'var(--bg-tertiary)',
  padding: '6px 10px',
  fontSize: '12px',
  color: 'var(--text-primary)',
  outline: 'none',
  cursor: 'pointer',
}

export function FilterBar() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectFilters)
  const filtered = useAppSelector(selectFilteredSessions)
  const isFiltered =
    filters.search || filters.status !== 'all' || filters.riskLevel !== 'all'

  return (
    <div
      role="search"
      aria-label="Filter sessions"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Row 1 — search */}
      <div style={{ position: 'relative' }}>
        <Search
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 13,
            height: 13,
            color: 'var(--text-muted)',
          }}
        />
        <input
          type="search"
          placeholder="Search candidate, exam, country..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          aria-label="Search sessions"
          style={{
            width: '100%',
            borderRadius: '6px',
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '7px 32px',
            fontSize: '13px',
            color: 'var(--text-primary)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {filters.search && (
          <button
            onClick={() => dispatch(setSearch(''))}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
            }}
          >
            <X style={{ width: 13, height: 13 }} />
          </button>
        )}
      </div>

      {/* Row 2 — filters + count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <SlidersHorizontal
          aria-hidden="true"
          style={{
            width: 13,
            height: 13,
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        />

        <select
          value={filters.status}
          onChange={(e) =>
            dispatch(setStatus(e.target.value as SessionStatus | 'all'))
          }
          aria-label="Filter by status"
          style={selectStyle}
        >
          {[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'flagged', label: 'Flagged' },
            { value: 'idle', label: 'Idle' },
            { value: 'disconnected', label: 'Disconnected' },
            { value: 'completed', label: 'Completed' },
          ].map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={filters.riskLevel}
          onChange={(e) =>
            dispatch(setRiskLevel(e.target.value as RiskLevel | 'all'))
          }
          aria-label="Filter by risk level"
          style={selectStyle}
        >
          {[
            { value: 'all', label: 'All Risk' },
            { value: 'critical', label: 'Critical' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ].map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) =>
            dispatch(setSortBy(e.target.value as FilterState['sortBy']))
          }
          aria-label="Sort by"
          style={selectStyle}
        >
          {[
            { value: 'riskScore', label: 'Risk Score' },
            { value: 'flagCount', label: 'Flags' },
            { value: 'lastEventAt', label: 'Last Event' },
            { value: 'startedAt', label: 'Start Time' },
          ].map((o) => (
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
          aria-label={`Sort ${filters.sortOrder === 'desc' ? 'ascending' : 'descending'}`}
          style={{ ...selectStyle, fontFamily: 'monospace', fontWeight: 600 }}
        >
          {filters.sortOrder === 'desc' ? '↓' : '↑'}
        </button>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            role="status"
            aria-live="polite"
            aria-label={`${filtered.length} sessions shown`}
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            {filtered.length.toLocaleString()} sessions
          </span>
          {isFiltered && (
            <button
              onClick={() => dispatch(resetFilters())}
              aria-label="Reset all filters"
              style={{
                fontSize: '12px',
                color: 'var(--accent-blue)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
