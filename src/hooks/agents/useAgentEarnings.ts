/**
 * @file useAgentEarnings.ts
 * @description React Query query hook for fetching the authenticated agent's earnings data.
 * @module hooks/agents/useAgentEarnings
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

/**
 * useAgentEarnings
 * @description Fetches the agent's earnings information, including commissions and payouts.
 * @returns A React Query result containing the AgentEarnings object.
 */
export function useAgentEarnings() {
  return useQuery({
    queryKey: queryKeys.agents.earnings(),
    queryFn: agentsService.getEarnings,
    select: (res) => res.data.data,
  });
}
