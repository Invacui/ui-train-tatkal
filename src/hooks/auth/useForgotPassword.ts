/**
 * @file useForgotPassword.ts
 * @description React Query mutation hook for initiating the forgot-password flow, sending an OTP to the user's email.
 * @module hooks/auth/useForgotPassword
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Forgot password DTO type
import type { ForgotPasswordDto } from '@/types/auth.types';

/**
 * useForgotPassword
 * @description Sends a password reset OTP to the provided email address if an account exists. Shows a success toast informing the user to check their email. No error toast is shown to avoid revealing whether the email is registered (security best practice).
 * @returns A React Query mutation object for triggering the forgot-password mutation.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (dto: ForgotPasswordDto) => authService.forgotPassword(dto),
    onSuccess: () => toast.success('OTP sent to your email if the account exists'),
  });
}
