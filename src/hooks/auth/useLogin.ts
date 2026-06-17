/**
 * @file useLogin.ts
 * @description React Query mutation hook for authenticating a user with email/password, dispatching auth state to Redux, and performing role-based navigation.
 * @module hooks/auth/useLogin
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

// Route constants for role-based redirects
import { ROUTES } from '@/constants/routes';

// Login DTO type
import type { LoginDto } from '@/types/auth.types';

/**
 * useLogin
 * @description Authenticates the user with email and password via the auth service. On success, dispatches the user and tokens to Redux, shows a welcome toast, and redirects based on the user's role (admin, agent, or regular user). On failure, displays an error toast.
 * @returns A React Query mutation object for triggering the login mutation.
 */
export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data.data;
      dispatch(setAuth({ user, accessToken, refreshToken }));
      toast.success('Welcome back!');

      // Role-based redirect
      if (user.role === 'admin') navigate(ROUTES.admin.root);
      else if (user.role === 'agent') navigate(ROUTES.agent.root);
      else navigate(ROUTES.dashboard);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    },
  });
}
