/**
 * @file useSignup.ts
 * @description React Query mutation hook for registering a new user, dispatching auth state to Redux.
 *   Navigation is handled by individual pages in their onSuccess callbacks.
 * @module hooks/auth/useSignup
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Redux dispatch hook
import { useAppDispatch } from '@/store/hooks';

// Redux auth actions
import { setAuth } from '@/store/auth.slice';

// Signup DTO type
import type { SignupDto } from '@/types/auth.types';

/**
 * useSignup
 * @description Registers a new user with the provided signup data. On success, dispatches the user
 *   and tokens to Redux, and shows a welcome toast. Navigation is handled by the calling page
 *   via the onSuccess callback. On failure, displays an error toast with the server message
 *   or a fallback message.
 * @returns A React Query mutation object for triggering the signup mutation.
 */
export function useSignup() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (dto: SignupDto) => authService.signup(dto),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data.data;
      dispatch(setAuth({ user, accessToken, refreshToken }));
      toast.success('Account created! Please verify your email.');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
}
