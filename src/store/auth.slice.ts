/**
 * @file Auth slice
 * @description Redux slice managing authentication state: user profile, tokens, and auth status. Persists user data to localStorage.
 * @module store
 */

// Redux Toolkit slice and action types
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// User profile type
import type { User } from '@/types/auth.types';
// User role type for selectors
import type { UserRole } from '@/types/auth.types';

/** Auth slice state shape */
interface AuthState {
  /** Current logged-in user, or null */
  user: User | null;
  /** JWT access token */
  accessToken: string | null;
  /** JWT refresh token */
  refreshToken: string | null;
  /** Whether a user session is active */
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('tt-user');
const initialState: AuthState = {
  user: savedUser ? (JSON.parse(savedUser) as User) : null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: !!savedUser,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * setAuth
     * @description Sets the authenticated user and tokens after successful login/signup.
     *   Persists the user object to localStorage.
     * @param state - Current auth state
     * @param payload - Contains user, accessToken, and optional refreshToken
     */
    setAuth: (
      state,
      { payload }: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>,
    ) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.isAuthenticated = true;
      if (payload.refreshToken) {
        state.refreshToken = payload.refreshToken;
      }
      localStorage.setItem('tt-user', JSON.stringify(payload.user));
    },
    /**
     * setToken
     * @description Updates the access token (used after silent token refresh)
     * @param state - Current auth state
     * @param payload - New access token string
     */
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },
    /**
     * updateUser
     * @description Replaces the stored user object (e.g. after profile update)
     * @param state - Current auth state
     * @param payload - Updated user object
     */
    updateUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      localStorage.setItem('tt-user', JSON.stringify(payload));
    },
    /**
     * setOnboardingCompleted
     * @description Marks the user's onboarding as completed in the stored user object
     */
    setOnboardingCompleted: (state) => {
      if (state.user) {
        state.user.onboardingCompleted = true;
        localStorage.setItem('tt-user', JSON.stringify(state.user));
      }
    },
    /**
     * updateEmailVerified
     * @description Marks the user's email as verified in the stored user object
     */
    updateEmailVerified: (state) => {
      if (state.user) {
        state.user.emailVerified = true;
        localStorage.setItem('tt-user', JSON.stringify(state.user));
      }
    },
    /**
     * updatePhoneVerified
     * @description Marks the user's phone as verified in the stored user object
     */
    updatePhoneVerified: (state) => {
      if (state.user) {
        state.user.phoneVerified = true;
        localStorage.setItem('tt-user', JSON.stringify(state.user));
      }
    },
    /**
     * clearAuth
     * @description Clears all auth state and removes the persisted user from localStorage (logout)
     */
    clearAuth: (state) => {
      Object.assign(state, { user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      localStorage.removeItem('tt-user');
    },
  },
});

/** Set the authenticated user and tokens */
export const { setAuth, setToken, updateUser, setOnboardingCompleted, updateEmailVerified, updatePhoneVerified, clearAuth } = authSlice.actions;

/** Select the current user object */
export const selectUser = (s: { auth: AuthState }) => s.auth.user;
/** Select whether the user is authenticated */
export const selectIsAuthenticated = (s: { auth: AuthState }) => s.auth.isAuthenticated;
/** Select the current access token */
export const selectAccessToken = (s: { auth: AuthState }) => s.auth.accessToken;
/** Select the user's role, or null if not logged in */
export const selectUserRole = (s: { auth: AuthState }): UserRole | null => s.auth.user?.role ?? null;

/** Auth reducer for store registration */
export const authReducer = authSlice.reducer;
