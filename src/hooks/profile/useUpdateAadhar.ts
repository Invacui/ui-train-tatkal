/**
 * @file useUpdateAadhar.ts
 * @description React Query mutation hook for updating the user's Aadhar details via PATCH /auth/me/aadhar.
 *   Syncs the updated user into Redux and invalidates the profile query so the
 *   Settings page always reflects the latest server state.
 * @module hooks/profile/useUpdateAadhar
 */

// React Query mutation hook
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Redux dispatch hook
import { useAppDispatch } from '@/store/hooks';

// Redux auth action to sync updated user into store
import { updateUser } from '@/store/auth.slice';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// DTO type
import type { UpdateAadharDto } from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';
import type { User } from '@/types/auth.types';

/**
 * useUpdateAadhar
 * @description Updates the authenticated user's Aadhar ID and/or document URL.
 *   On success, dispatches the updated user to Redux and invalidates the
 *   profile query cache so the Settings page re-fetches fresh data.
 * @returns A React Query mutation object for triggering the aadhar update.
 */
export function useUpdateAadhar() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateAadharDto) => {
      const res = await authService.updateAadhar(dto);
      return res.data as ApiResponse<User>;
    },
    onSuccess: (data) => {
      dispatch(updateUser(data.data));
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}
