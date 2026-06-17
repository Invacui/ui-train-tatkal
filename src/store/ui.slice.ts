/**
 * @file UI slice
 * @description Redux slice managing UI state: sidebar toggle and modal dialogs
 * @module store
 */

// Redux Toolkit slice and action types
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** UI slice state shape */
interface UIState {
  /** Whether the sidebar is expanded */
  sidebarOpen: boolean;
  /** Name/identifier of the currently open modal, or null */
  activeModal: string | null;
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: true, activeModal: null } as UIState,
  reducers: {
    /** Toggle the sidebar open/closed */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    /**
     * Open a modal by name
     * @param state - Current UI state
     * @param payload - Modal identifier string
     */
    openModal: (state, { payload }: PayloadAction<string>) => {
      state.activeModal = payload;
    },
    /** Close the currently open modal */
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

/** Toggle sidebar action */
export const { toggleSidebar, openModal, closeModal } = uiSlice.actions;
/** UI reducer for store registration */
export const uiReducer = uiSlice.reducer;

/** Select whether the sidebar is open */
export const selectSidebarOpen = (s: { ui: UIState }) => s.ui.sidebarOpen;
/** Select the name of the currently active modal, or null */
export const selectActiveModal = (s: { ui: UIState }) => s.ui.activeModal;
