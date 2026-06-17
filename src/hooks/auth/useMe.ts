/**
 * @file useMe.ts
 * @description React Query query hook for fetching the current authenticated user's profile.
 * @module hooks/auth/useMe
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Auth service API calls
import { authService } from '@/services/auth.service';

// User type
import type { User } from '@/types/auth.types';

/**
 * useMe
 * @description Fetches the currently authenticated user's profile data. This is used to check authentication status on app load and to retrieve user details for the UI. Disables retry on failure (e.g., when not authenticated).
 * @returns A React Query result object containing the User data, or null/undefined if not authenticated.
 */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authService.me,
    select: (res) => res.data.data as User,
    retry: false,
  });
}
