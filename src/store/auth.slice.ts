/**
 * @file Auth slice
 * @description Redux slice managing authentication state: user profile, agent data, tokens, and auth status. Persists user and agent data to localStorage.
 * @module store
 */

// Redux Toolkit slice and action types
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// User profile type
import type { User } from '@/types/auth.types';
// Agent profile type
import type { AgentProfile } from '@/types/agents.types';
// User role type for selectors
import type { UserRole } from '@/types/auth.types';

/** Auth slice state shape */
interface AuthState {
  /** Current logged-in user, or null */
  user: User | null;
  /** Current agent profile (only for agent-role users), or null */
  agent: AgentProfile | null;
  /** JWT access token */
  accessToken: string | null;
  /** JWT refresh token */
  refreshToken: string | null;
  /** Whether a user session is active */
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('tt-user');
const savedAgent = localStorage.getItem('tt-agent');
const initialState: AuthState = {
  user: savedUser ? (JSON.parse(savedUser) as User) : null,
  agent: savedAgent ? (JSON.parse(savedAgent) as AgentProfile) : null,
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
     */
    setAuth: (
      state,
      { payload }: PayloadAction<{ user: User; accessToken: string; refreshToken?: string; agent?: AgentProfile }>,
    ) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.isAuthenticated = true;
      if (payload.refreshToken) {
        state.refreshToken = payload.refreshToken;
      }
      if (payload.agent) {
        state.agent = payload.agent;
        localStorage.setItem('tt-agent', JSON.stringify(payload.agent));
      }
      localStorage.setItem('tt-user', JSON.stringify(payload.user));
    },
    /**
     * setAgent
     * @description Updates the stored agent profile (e.g. after carousel step or profile update).
     */
    setAgent: (state, { payload }: PayloadAction<AgentProfile>) => {
      state.agent = payload;
      localStorage.setItem('tt-agent', JSON.stringify(payload));
    },
    /**
     * setToken
     * @description Updates the access token (used after silent token refresh)
     */
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },
    /**
     * updateUser
     * @description Replaces the stored user object (e.g. after profile update)
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
      Object.assign(state, { user: null, agent: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      localStorage.removeItem('tt-user');
      localStorage.removeItem('tt-agent');
    },
  },
});

/** Actions */
export const { setAuth, setAgent, setToken, updateUser, setOnboardingCompleted, updateEmailVerified, updatePhoneVerified, clearAuth } = authSlice.actions;

/** Selectors */
export const selectUser = (s: { auth: AuthState }) => s.auth.user;
export const selectAgent = (s: { auth: AuthState }) => s.auth.agent;
export const selectIsAuthenticated = (s: { auth: AuthState }) => s.auth.isAuthenticated;
export const selectAccessToken = (s: { auth: AuthState }) => s.auth.accessToken;
export const selectUserRole = (s: { auth: AuthState }): UserRole | null => s.auth.user?.role ?? null;

/** Auth reducer for store registration */
export const authReducer = authSlice.reducer;
