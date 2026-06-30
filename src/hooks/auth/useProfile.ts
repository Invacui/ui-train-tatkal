/**
 * @file useProfile.ts
 * @description React Query hook for fetching the current user's profile from
 *   /auth/me and syncing it into Redux on every successful fetch. Used by the
 *   Settings page to ensure all profile data (address, family members, aadhar)
 *   is fresh on mount and after any mutation invalidates the query.
 * @module hooks/auth/useProfile
 */

import { useQuery } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/auth.slice';
import { queryKeys } from '@/lib/queryKeys';

import type { User } from '@/types/auth.types';

/**
 * useProfile
 * @description Fetches the authenticated user's full profile from /auth/me.
 *   On every successful fetch, dispatches the updated User to Redux so the
 *   UI (Settings, checkout, etc.) always reflects the latest server state.
 *
 *   staleTime: 0 ensures a fresh fetch on component mount. After any profile
 *   mutation (address, family, aadhar, name/email), invalidate queryKeys.auth.me()
 *   to trigger a refetch and Redux sync.
 *
 * @returns A React Query result object containing the User (or null).
 */
export function useProfile() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const res = await authService.me();
      const user = res.data.data as User;
      dispatch(updateUser(user));
      return user;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
