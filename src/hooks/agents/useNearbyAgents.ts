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
 * Raw agent record as returned by the API.
 * Field names differ from the frontend AgentGeolocation interface.
 */
interface NearbyAgentResponse {
  agentId: string;
  userId: string;
  businessName: string;
  city: string;
  rating: number;
  totalBookings: number;
  completionRate: number;
  distanceKm: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  isOnline?: boolean;
}

/**
 * mapNearbyAgentResponse
 * @description Transforms raw API response fields to match AgentGeolocation.
 */
function mapNearbyAgentResponse(raw: NearbyAgentResponse): AgentGeolocation {
  return {
    id: raw.agentId,
    agencyName: raw.businessName,
    ownerName: '',
    phone: '',
    rating: raw.rating,
    completedBookings: raw.totalBookings,
    completionRate: raw.completionRate,
    distance: raw.distanceKm,
    location: raw.location,
    isOnline: raw.isOnline ?? false,
  };
}

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
      const raw = res.data.data as unknown as NearbyAgentResponse[];
      return (raw ?? []).map(mapNearbyAgentResponse);
    },
    enabled: !!params && !!params.currUserLat && !!params.currUserLong,
    staleTime: 60 * 1000, // 1 min — agent locations change
  });
}
