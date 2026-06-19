/**
 * @file useSignup.ts
 * @description React Query mutation hook for registering a new user, dispatching auth state to Redux,
 *   and performing role-based navigation.
 * @module hooks/auth/useSignup
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// React Router navigation hook
import { useNavigate } from 'react-router-dom';

// Toast notifications
import { toast } from 'sonner';

// Auth service API calls
import { authService } from '@/services/auth.service';

// Redux dispatch hook
import { useAppDispatch } from '@/store/hooks';

// Redux auth actions
import { setAuth } from '@/store/auth.slice';

// Route constants for navigation
import { ROUTES } from '@/constants/routes';

// Signup DTO type
import type { SignupDto } from '@/types/auth.types';

/**
 * useSignup
 * @description Registers a new user with the provided signup data. On success, dispatches the user
 *   and tokens to Redux, shows a welcome toast, and redirects based on the user's role
 *   (admin, agent, or regular user). On failure, displays an error toast with the server message
 *   or a fallback message.
 * @returns A React Query mutation object for triggering the signup mutation.
 */
export function useSignup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: SignupDto) => authService.signup(dto),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data.data;
      dispatch(setAuth({ user, accessToken, refreshToken }));
      toast.success('Account created! Welcome to TripTatkal.');

      // Role-based redirect (same as useLogin)
      if (user.role === 'admin') navigate(ROUTES.admin.root);
      else if (user.role === 'agent') navigate(ROUTES.agent.root);
      else navigate(ROUTES.dashboard);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
}
