/**
 * @file useVerifyEmail.ts
 * @description React Query hooks for sending email verification and verifying email tokens. Exports two hooks: useSendEmailVerification and useVerifyEmail.
 * @module hooks/auth/useVerifyEmail
 */

// React Query mutation and query hooks
import { useMutation, useQuery } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

/**
 * useSendEmailVerification
 * @description Sends a verification email to the specified email address.
 *   Takes { email, isEmailNew } where isEmailNew causes the backend to update
 *   the user's email and reset emailVerified before sending the link.
 * @returns A React Query mutation object for triggering the email verification send mutation.
 */
export function useSendEmailVerification() {
  return useMutation({
    mutationFn: (dto?: { email?: string; isEmailNew?: boolean }) =>
      authService.sendEmailVerification(dto ?? { email: '' }),
    onSuccess: () => toast.success('Verification email sent'),
    onError: () => toast.error('Failed to send verification email'),
  });
}

/**
 * useVerifyEmail
 * @description Verifies the user's email using a token and user ID obtained from the verification link. On success, shows a success toast. On failure, shows an error toast indicating the link may have expired.
 * @returns A React Query mutation object for triggering the email verification mutation.
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: ({ token, userId }: { token: string; userId: string }) =>
      authService.verifyEmail(token, userId),
    onSuccess: () => toast.success('Email verified successfully'),
    onError: () => toast.error('Verification failed or link expired'),
  });
}
