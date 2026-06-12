import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/types'

type PanelView = 'grid' | 'list'
type SidebarState = 'open' | 'closed'

interface UIState {
  panelView: PanelView
  sidebar: SidebarState
  isDetailOpen: boolean
  realtimeConnected: boolean
  lastRealtimeEvent: string | null
}

const initialState: UIState = {
  panelView: 'grid',
  sidebar: 'open',
  isDetailOpen: false,
  realtimeConnected: false,
  lastRealtimeEvent: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPanelView(state, action: PayloadAction<PanelView>) {
      state.panelView = action.payload
    },
    toggleSidebar(state) {
      state.sidebar = state.sidebar === 'open' ? 'closed' : 'open'
    },
    setDetailOpen(state, action: PayloadAction<boolean>) {
      state.isDetailOpen = action.payload
    },
    setRealtimeConnected(state, action: PayloadAction<boolean>) {
      state.realtimeConnected = action.payload
    },
    setLastRealtimeEvent(state, action: PayloadAction<string>) {
      state.lastRealtimeEvent = action.payload
    },
  },
})

export const {
  setPanelView,
  toggleSidebar,
  setDetailOpen,
  setRealtimeConnected,
  setLastRealtimeEvent,
} = uiSlice.actions

export const selectPanelView = (state: RootState) => state.ui.panelView
export const selectSidebarState = (state: RootState) => state.ui.sidebar
export const selectIsDetailOpen = (state: RootState) => state.ui.isDetailOpen
export const selectRealtimeConnected = (state: RootState) =>
  state.ui.realtimeConnected

export default uiSlice.reducer
