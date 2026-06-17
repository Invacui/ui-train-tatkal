/**
 * @file useChangePassword.ts
 * @description React Query mutation hook for changing the authenticated user's password.
 * @module hooks/auth/useChangePassword
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Change password DTO type
import type { ChangePasswordDto } from '@/types/auth.types';

/**
 * useChangePassword
 * @description Changes the current user's password by sending the current and new passwords to the server. On success, shows a success toast. On failure, shows an error toast with the server message or a fallback.
 * @returns A React Query mutation object for triggering the password change mutation.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (dto: ChangePasswordDto) => authService.changePassword(dto),
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    },
  });
}
