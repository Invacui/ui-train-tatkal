/**
 * @file useRefreshAgentProfile.ts
 * @description React Query query hook that fetches the authenticated agent's profile from
 *   /agents/profile and dispatches it to the Redux store. This ensures the store always
 *   has fresh agent data (including businessName, gstNumber, panNumber, bank details, etc.)
 *   which GET /auth/me does NOT return.
 *
 *   Also syncs emailVerified and onboardingCompleted from the Agent doc into the User store,
 *   so consumers reading from selectUser get the latest verification/onboarding status
 *   without needing to call /auth/me.
 *
 *   Why this exists: /auth/me only returns the User document (name, email, phone, role).
 *   For agents, all business-specific fields live in the Agent document, fetched via
 *   /agents/profile. This hook bridges the gap by pushing fresh Agent data into Redux,
 *   where other components can read it from `selectAgent`.
 * @module hooks/agents/useRefreshAgentProfile
 */

// React hooks
import { useEffect } from 'react';

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

// Redux dispatch hook and selector
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Redux auth actions
import { setAgent, updateUser, selectUser } from '@/store/auth.slice';

/**
 * useRefreshAgentProfile
 * @description Fetches the agent's full profile from /agents/profile and pushes it into
 *   the Redux store. Use this on app load / AuthGuard mount to guarantee the store has
 *   fresh agent data (not just the stale snapshot from localStorage).
 *
 *   The hook is a no-op when `enabled` is false (i.e., the current user is not an agent).
 *
 *   IMPORTANT: Also syncs emailVerified and onboardingCompleted from the Agent doc back
 *   into the User store, since the User document never gets these updated during the
 *   agent onboarding flow. This eliminates the need for /auth/me calls.
 *
 * @param enabled - Whether to actually fetch (pass `user.role === 'agent'`)
 * @returns The React Query result (data, isLoading, error) for optional callers
 */
export function useRefreshAgentProfile(enabled: boolean) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);

  const query = useQuery({
    queryKey: queryKeys.agents.profile(),
    queryFn: agentsService.getProfile,
    select: (res) => res.data.data,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 min — don't refetch too often
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setAgent(query.data));

      // Sync agent-level fields back into the User store so consumers reading
      // from selectUser get the latest verification/onboarding status without
      // needing a separate /auth/me call.
      if (currentUser && (
        currentUser.emailVerified !== query.data.emailVerified ||
        currentUser.onboardingCompleted !== query.data.onboardingCompleted
      )) {
        dispatch(updateUser({
          ...currentUser,
          emailVerified: query.data.emailVerified,
          onboardingCompleted: query.data.onboardingCompleted,
        }));
      }
    }
  }, [query.data, dispatch, currentUser]);

  return query;
}
