/**
 * @file useAgentOnboard.ts
 * @description React Query mutation hook for submitting an agent onboarding application.
 * @module hooks/agents/useAgentOnboard
 */

// React Query mutation hook
import { useMutation } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

// Agent onboarding DTO type
import type { AgentOnboardDto } from '@/types/agents.types';

/**
 * useAgentOnboard
 * @description Submits an agent onboarding application with the provided details. On success, shows a toast informing the user the application is under review. On failure, shows an error toast with the server message.
 * @returns A React Query mutation object for triggering the agent onboarding mutation.
 */
export function useAgentOnboard() {
  return useMutation({
    mutationFn: (dto: AgentOnboardDto) => agentsService.onboard(dto),
    onSuccess: () => toast.success('Onboarding application submitted for review'),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Onboarding failed');
    },
  });
}
