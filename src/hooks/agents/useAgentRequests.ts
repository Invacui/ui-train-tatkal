/**
 * @file useAgentRequests.ts
 * @description React Query query hook for fetching pending booking requests assigned to the agent, with automatic polling.
 * @module hooks/agents/useAgentRequests
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

// Booking mapper
import { mapBookingArray } from '@/lib/agents/bookingMapper';

/**
 * useAgentRequests
 * @description Fetches all pending booking requests assigned to the authenticated agent. Automatically polls every 30 seconds to pick up new requests in real-time.
 * @returns A React Query result containing an array of Booking objects representing pending requests.
 */
export function useAgentRequests() {
  return useQuery({
    queryKey: queryKeys.agents.requests(),
    queryFn: agentsService.getRequests,
    select: (res) => mapBookingArray(res.data.data),
    refetchInterval: 30_000, // Poll for new requests
  });
}
