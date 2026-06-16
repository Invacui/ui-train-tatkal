import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('lf-user');
const initialState: AuthState = {
  user: savedUser ? (JSON.parse(savedUser) as User) : null,
  accessToken: null,
  isAuthenticated: !!savedUser,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      { payload }: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('lf-user', JSON.stringify(payload.user));
    },
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },
    updateUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      localStorage.setItem('lf-user', JSON.stringify(payload));
    },
    clearAuth: (state) => {
      Object.assign(state, { user: null, accessToken: null, isAuthenticated: false });
      localStorage.removeItem('lf-user');
    },
  },
});

// Export for the dispatch actions
export const { setAuth, setToken, updateUser, clearAuth } = authSlice.actions;

// Selectors: These functions access specific parts of the auth slice from the global store state.
// 
// Note:
// - The parameter 's' represents the entire Redux store state.
// - The 'auth' key in 's.auth' should match the key used when registering your reducer in the store.
// - Ensure that in your store setup, you have:
//     reducer: { auth: authReducer }
// - The selectors access properties of the auth slice, e.g., user, isAuthenticated, accessToken.
// - Make sure the shape of the parameter matches your store configuration for correct type safety.
export const selectUser = (s: { auth: Pick<AuthState, 'user'> }) => s.auth.user;
export const selectIsAuthenticated = (s: { auth: Pick<AuthState, 'isAuthenticated'> }) => s.auth.isAuthenticated;
export const selectAccessToken = (s: { auth: Pick<AuthState, 'accessToken'> }) => s.auth.accessToken;

export const authReducer = authSlice.reducer;