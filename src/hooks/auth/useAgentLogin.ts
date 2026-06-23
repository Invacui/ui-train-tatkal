/**
 * @file useAgentLogin.ts
 * @description React Query mutation hook for authenticating an agent via POST /auth/agent/login.
 *   Only accepts role: 'agent' users. Dispatches auth state to Redux and navigates to the
 *   onboarding carousel if requiresOnboarding is true.
 * @module hooks/auth/useAgentLogin
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

// Agent login DTO type
import type { AgentLoginDto } from '@/types/auth.types';

/**
 * useAgentLogin
 * @description Authenticates an agent via POST /auth/agent/login.
 *   On success, dispatches user + agent + tokens to Redux, shows a welcome toast,
 *   and navigates to the onboarding carousel if requiresOnboarding is true,
 *   otherwise to the agent dashboard.
 * @returns A React Query mutation object for triggering the agent login mutation.
 */
export function useAgentLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: AgentLoginDto) => authService.agentLogin(dto),
    onSuccess: (res) => {
      const { user, agent, accessToken, refreshToken, requiresOnboarding } = res.data.data;
      dispatch(setAuth({ user, agent, accessToken, refreshToken }));
      toast.success('Welcome back!');

      if (requiresOnboarding) {
        navigate(ROUTES.agent.onboarding);
      } else {
        navigate(ROUTES.agent.root);
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    },
  });
}
