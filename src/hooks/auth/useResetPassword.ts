/**
 * @file useResetPassword.ts
 * @description React Query mutation hook for resetting the user's password using a token and new password, then navigating to the login page.
 * @module hooks/auth/useResetPassword
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// React Router navigation hook
import { useNavigate } from 'react-router-dom';

// Toast notifications
import { toast } from 'sonner';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Route constants
import { ROUTES } from '@/constants/routes';

// Reset password DTO type
import type { ResetPasswordDto } from '@/types/auth.types';

/**
 * useResetPassword
 * @description Resets the user's password using the reset token and new password from the DTO. On success, shows a success toast and navigates to the login page so the user can log in with their new password.
 * @returns A React Query mutation object for triggering the reset-password mutation.
 */
export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: ResetPasswordDto) => authService.resetPassword(dto),
    onSuccess: () => {
      toast.success('Password reset successfully. Please login.');
      navigate(ROUTES.login);
    },
  });
}
