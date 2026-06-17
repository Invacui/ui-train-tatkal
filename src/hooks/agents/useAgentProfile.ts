/**
 * @file useAgentProfile.ts
 * @description React Query query hook for fetching the authenticated agent's profile information.
 * @module hooks/agents/useAgentProfile
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

/**
 * useAgentProfile
 * @description Fetches the authenticated agent's profile data, including business details and status.
 * @returns A React Query result containing the AgentProfile object.
 */
export function useAgentProfile() {
  return useQuery({
    queryKey: queryKeys.agents.profile(),
    queryFn: agentsService.getProfile,
    select: (res) => res.data.data,
  });
}
