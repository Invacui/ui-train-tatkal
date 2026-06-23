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
 *   Has a 2-minute staleTime so it doesn't refetch on every window focus — agent profiles don't
 *   change frequently outside of explicit updates.
 *
 * @param enabled - Whether the query is enabled (default true). Pass false to skip fetching,
 *   e.g. during onboarding where AgentSidebar doesn't need the profile data yet.
 * @returns A React Query result containing the AgentProfile object.
 */
export function useAgentProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.agents.profile(),
    queryFn: agentsService.getProfile,
    select: (res) => res.data.data,
    enabled,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
