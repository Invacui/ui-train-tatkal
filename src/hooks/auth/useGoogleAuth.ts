/**
 * @file useGoogleAuth.ts
 * @description React Query mutation hook for authenticating with Google OAuth, dispatching the user and tokens to Redux on success. Supports both regular user and agent Google auth based on the `role` field.
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

/**
 * useGoogleAuth
 * @description Authenticates the user via Google OAuth using the provided credential.
 *   When `dto.role` is `'agent'`, calls the agent-specific Google auth endpoint
 *   and dispatches the agent profile to Redux along with user and tokens.
 *   Does not handle navigation or toast notifications, giving the calling
 *   component flexibility.
 * @returns A React Query mutation object for triggering the Google auth mutation.
 */
export function useGoogleAuth() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (dto: GoogleAuthDto) => {
      const { role, ...rest } = dto;
      if (dto.role === 'agent') {
        //remove role from dto before sending to agentGoogleAuth

        return authService.agentGoogleAuth(rest);
      }
      return authService.googleAuth(rest);
    },
    onSuccess: (res) => {
      const data = res.data.data as any;
      dispatch(setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        agent: data.agent, // present for agent auth, undefined for regular
      }));
    },
  });
}
