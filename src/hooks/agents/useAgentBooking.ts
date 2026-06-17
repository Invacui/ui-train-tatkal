/**
 * @file useAgentBooking.ts
 * @description React Query query hook for fetching a specific booking's details from the agent's perspective.
 * @module hooks/agents/useAgentBooking
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

/**
 * useAgentBooking
 * @description Fetches detailed information about a specific booking assigned to the agent, identified by its booking ID. The query is disabled when no booking ID is provided.
 * @param {string} bookingId - The unique booking identifier.
 * @returns A React Query result containing the Booking detail object.
 */
export function useAgentBooking(bookingId: string) {
  return useQuery({
    queryKey: queryKeys.agents.booking(bookingId),
    queryFn: () => agentsService.getBooking(bookingId),
    select: (res) => res.data.data,
    enabled: !!bookingId,
  });
}
