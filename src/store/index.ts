/**
 * @file Redux store
 * @description Configures the Redux store with auth, UI, and booking-draft slices
 * @module store
 */

// Redux Toolkit store configuration
import { configureStore } from '@reduxjs/toolkit';
// Auth state reducer
import { authReducer } from './auth.slice';
// UI state reducer (sidebar, modals)
import { uiReducer } from './ui.slice';
// Booking draft state reducer (multi-step booking flow)
import { bookingDraftReducer } from './booking-draft.slice';

/**
 * store
 * @description The application's Redux store, combining auth, ui, and bookingDraft reducers
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    bookingDraft: bookingDraftReducer,
  },
});

/** Root state type derived from the store */
export type RootState = ReturnType<typeof store.getState>;
/** Typed dispatch for the store */
export type AppDispatch = typeof store.dispatch;
