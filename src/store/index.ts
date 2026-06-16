import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth.slice';
import { uiReducer } from './ui.slice';
import { demoReducer } from './demo.slice';

export const store = configureStore({
  reducer: { 
    /**
     * auth: handles authentication state, including user info and access token
     */
    auth: authReducer,
    
    /**
     * ui: manages user interface state, including modal visibility and notifications
     */
    ui: uiReducer,
    
    /**
     * demo: handles demo-related state, including demo data and loading status
     */
    demo: demoReducer 
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;