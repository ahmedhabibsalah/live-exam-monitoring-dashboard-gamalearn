import { configureStore } from '@reduxjs/toolkit'
import sessionsReducer from './slices/sessionsSlice'
import filtersReducer from './slices/filtersSlice'
import uiReducer from './slices/uiSlice'
import type { RootState } from './types'

export const store = configureStore({
  reducer: {
    sessions: sessionsReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
})

export type { RootState }
export type AppDispatch = typeof store.dispatch
