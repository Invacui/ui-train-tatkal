/**
 * @file useAgentStats.ts
 * @description React Query query hook for fetching the authenticated agent's performance statistics.
 * @module hooks/agents/useAgentStats
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

/**
 * useAgentStats
 * @description Fetches the agent's performance statistics, such as total bookings, acceptance rate, completed bookings, and other metrics.
 * @returns A React Query result containing the AgentStats object.
 */
export function useAgentStats() {
  return useQuery({
    queryKey: queryKeys.agents.stats(),
    queryFn: agentsService.getStats,
    select: (res) => res.data.data,
  });
}
