/**
 * @file useGoogleAuth.ts
 * @description React Query mutation hook for authenticating with Google OAuth, dispatching the user and tokens to Redux on success.
 * @module hooks/auth/useGoogleAuth
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Redux dispatch hook
import { useAppDispatch } from '@/store/hooks';

// Redux auth actions
import { setAuth } from '@/store/auth.slice';

// Google auth DTO type
import type { GoogleAuthDto } from '@/types/auth.types';

// User type
import type { User } from '@/types/auth.types';

/**
 * useGoogleAuth
 * @description Authenticates the user via Google OAuth using the provided credential. On success, dispatches the user, access token, and refresh token to Redux. Does not handle navigation or toast notifications, giving the calling component flexibility.
 * @returns A React Query mutation object for triggering the Google auth mutation.
 */
export function useGoogleAuth() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (dto: GoogleAuthDto) => authService.googleAuth(dto),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data.data;
      dispatch(setAuth({ user, accessToken, refreshToken }));
    },
  });
}
