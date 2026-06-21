/**
 * @file useNearbyAgents.ts
 * @description Hook for finding nearby agents based on user geolocation.
 * @module hooks/agents
 */

import { useQuery } from '@tanstack/react-query';

import { geolocationService } from '@/services/geolocation.service';
import { queryKeys } from '@/lib/queryKeys';

import type { AgentGeolocation, NearbyAgentQuery } from '@/types/geolocation.types';

/**
 * useNearbyAgents
 * @description Fetches nearby agents for a given user location. The query is
 *   disabled until valid lat/lon params are provided.
 * @param {NearbyAgentQuery | null} params - Query params including user lat/lon.
 *   Pass null to keep the query disabled.
 * @returns React Query result with AgentGeolocation[].
 */
export function useNearbyAgents(params: NearbyAgentQuery | null) {
  return useQuery<AgentGeolocation[]>({
    queryKey: params ? queryKeys.agents.nearby(params) : ['agents', 'nearby', 'disabled'],
    queryFn: async () => {
      if (!params) return [];
      const res = await geolocationService.findNearbyAgents(params);
      return res.data.data;
    },
    enabled: !!params && !!params.currUserLat && !!params.currUserLong,
    staleTime: 60 * 1000, // 1 min — agent locations change
  });
}
