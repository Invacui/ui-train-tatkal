/**
 * @file useUpdateProfile.ts
 * @description React Query mutation hook for updating the current user's profile, dispatching the updated user to Redux on success.
 * @module hooks/auth/useUpdateProfile
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Redux dispatch hook
import { useAppDispatch } from '@/store/hooks';

// Redux auth actions for profile update
import { updateUser } from '@/store/auth.slice';

// Update profile DTO type
import type { UpdateMeDto } from '@/types/auth.types';

/**
 * useUpdateProfile
 * @description Updates the authenticated user's profile with the provided fields. On success, dispatches the updated user data to the Redux store so the UI reflects the changes immediately. No toast is shown, allowing the caller to handle feedback.
 * @returns A React Query mutation object for triggering the profile update mutation.
 */
export function useUpdateProfile() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (dto: UpdateMeDto) => authService.updateMe(dto),
    onSuccess: (res) => {
      dispatch(updateUser(res.data.data));
    },
  });
}
