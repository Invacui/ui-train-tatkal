/**
 * @file useUpdateProfile.ts
 * @description React Query mutation hook for updating the current user's profile, dispatching the updated user to Redux on success and invalidating the profile query so the Settings page always shows fresh data.
 * @module hooks/auth/useUpdateProfile
 */

// React Query mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Redux dispatch hook
import { useAppDispatch } from '@/store/hooks';

// Redux auth actions for profile update
import { updateUser } from '@/store/auth.slice';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Update profile DTO type
import type { UpdateMeDto } from '@/types/auth.types';

/**
 * useUpdateProfile
 * @description Updates the authenticated user's profile with the provided fields. On success, dispatches the updated user data to the Redux store so the UI reflects the changes immediately, and invalidates the profile query to ensure the Settings page re-fetches fresh data on next mount.
 * @returns A React Query mutation object for triggering the profile update mutation.
 */
export function useUpdateProfile() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateMeDto) => authService.updateMe(dto),
    onSuccess: (res) => {
      dispatch(updateUser(res.data.data));
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
