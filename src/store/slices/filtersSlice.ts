import {
  createSlice,
  createSelector,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { FilterState, SessionStatus, RiskLevel } from '@/types'
import type { RootState } from '@/store/types'
import { selectAllSessions } from './sessionsSlice'

const initialState: FilterState = {
  search: '',
  status: 'all',
  riskLevel: 'all',
  examId: 'all',
  sortBy: 'riskScore',
  sortOrder: 'desc',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setStatus(state, action: PayloadAction<SessionStatus | 'all'>) {
      state.status = action.payload
    },
    setRiskLevel(state, action: PayloadAction<RiskLevel | 'all'>) {
      state.riskLevel = action.payload
    },
    setExamId(state, action: PayloadAction<string>) {
      state.examId = action.payload
    },
    setSortBy(state, action: PayloadAction<FilterState['sortBy']>) {
      state.sortBy = action.payload
    },
    setSortOrder(state, action: PayloadAction<FilterState['sortOrder']>) {
      state.sortOrder = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const {
  setSearch,
  setStatus,
  setRiskLevel,
  setExamId,
  setSortBy,
  setSortOrder,
  resetFilters,
} = filtersSlice.actions

export const selectFilters = (state: RootState) => state.filters

export const selectFilteredSessions = createSelector(
  selectAllSessions,
  selectFilters,
  (sessions, filters) => {
    let result = [...sessions]

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (s) =>
          s.candidate.name.toLowerCase().includes(q) ||
          s.candidate.email.toLowerCase().includes(q) ||
          s.candidate.id.toLowerCase().includes(q) ||
          s.examName.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((s) => s.status === filters.status)
    }

    // Risk level filter
    if (filters.riskLevel !== 'all') {
      result = result.filter((s) => s.riskLevel === filters.riskLevel)
    }

    // Exam filter
    if (filters.examId !== 'all') {
      result = result.filter((s) => s.examId === filters.examId)
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | string
      let bVal: number | string

      switch (filters.sortBy) {
        case 'riskScore':
          aVal = a.riskScore
          bVal = b.riskScore
          break
        case 'flagCount':
          aVal = a.flagCount
          bVal = b.flagCount
          break
        case 'startedAt':
          aVal = new Date(a.startedAt).getTime()
          bVal = new Date(b.startedAt).getTime()
          break
        case 'lastEventAt':
          aVal = new Date(a.lastEventAt).getTime()
          bVal = new Date(b.lastEventAt).getTime()
          break
        default:
          aVal = a.riskScore
          bVal = b.riskScore
      }

      return filters.sortOrder === 'desc'
        ? (bVal as number) - (aVal as number)
        : (aVal as number) - (bVal as number)
    })

    return result
  }
)

export default filtersSlice.reducer
