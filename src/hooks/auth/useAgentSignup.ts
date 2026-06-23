/**
 * @file useAgentSignup.ts
 * @description React Query mutation hook for registering a new agent via POST /auth/agent/register.
 *   Dispatches auth state to Redux (including agent profile) and navigates to the onboarding
 *   carousel if requiresOnboarding is true.
 * @module hooks/auth/useAgentSignup
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

// Agent signup DTO type
import type { AgentSignupDto } from '@/types/auth.types';

/**
 * useAgentSignup
 * @description Registers a new agent via POST /auth/agent/register.
 *   On success, dispatches user + agent + tokens to Redux, shows a success toast,
 *   and navigates to the onboarding carousel if requiresOnboarding is true,
 *   otherwise to the agent dashboard.
 * @returns A React Query mutation object for triggering the agent signup mutation.
 */
export function useAgentSignup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: AgentSignupDto) => authService.agentSignup(dto),
    onSuccess: (res) => {
      const { user, agent, accessToken, refreshToken, requiresOnboarding } = res.data.data;
      dispatch(setAuth({ user, agent, accessToken, refreshToken }));
      toast.success('Agent account created!');

      if (requiresOnboarding) {
        navigate(ROUTES.agent.onboarding);
      } else {
        navigate(ROUTES.agent.root);
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Agent registration failed';
      toast.error(message);
    },
  });
}
