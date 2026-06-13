import { describe, it, expect } from 'vitest'
import filtersReducer, {
  setSearch,
  setStatus,
  setRiskLevel,
  setSortBy,
  setSortOrder,
  resetFilters,
} from '@/store/slices/filtersSlice'

const initialState = {
  search: '',
  status: 'all',
  riskLevel: 'all',
  examId: 'all',
  sortBy: 'lastEventAt',
  sortOrder: 'desc',
}

describe('filtersSlice', () => {
  it('returns initial state', () => {
    const state = filtersReducer(undefined, { type: '@@INIT' })
    expect(state.search).toBe('')
    expect(state.status).toBe('all')
    expect(state.riskLevel).toBe('all')
  })

  it('setSearch updates search term', () => {
    const state = filtersReducer(undefined, setSearch('Ahmed'))
    expect(state.search).toBe('Ahmed')
  })

  it('setStatus updates status filter', () => {
    const state = filtersReducer(undefined, setStatus('flagged'))
    expect(state.status).toBe('flagged')
  })

  it('setRiskLevel updates risk level filter', () => {
    const state = filtersReducer(undefined, setRiskLevel('critical'))
    expect(state.riskLevel).toBe('critical')
  })

  it('setSortBy updates sort field', () => {
    const state = filtersReducer(undefined, setSortBy('flagCount'))
    expect(state.sortBy).toBe('flagCount')
  })

  it('setSortOrder toggles sort direction', () => {
    const desc = filtersReducer(undefined, setSortOrder('desc'))
    expect(desc.sortOrder).toBe('desc')
    const asc = filtersReducer(desc, setSortOrder('asc'))
    expect(asc.sortOrder).toBe('asc')
  })

  it('resetFilters restores initial state', () => {
    let state = filtersReducer(undefined, setSearch('test'))
    state = filtersReducer(state, setStatus('flagged'))
    state = filtersReducer(state, setRiskLevel('critical'))
    state = filtersReducer(state, resetFilters())
    expect(state.search).toBe('')
    expect(state.status).toBe('all')
    expect(state.riskLevel).toBe('all')
  })
})
