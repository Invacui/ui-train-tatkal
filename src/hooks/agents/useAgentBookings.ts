/**
 * @file useAgentBookings.ts
 * @description React Query query hook for fetching the authenticated agent's paginated list of bookings.
 * @module hooks/agents/useAgentBookings
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
 * useAgentBookings
 * @description Fetches the agent's bookings with optional pagination. Returns both the booking list and pagination metadata.
 * @param {{ page?: number; limit?: number }} [params] - Optional pagination parameters (page number and limit per page).
 * @returns A React Query result containing an object with `bookings` (array of Booking) and `pagination` (pagination metadata).
 */
export function useAgentBookings(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.agents.bookings(params),
    queryFn: () => agentsService.getBookings(params),
    select: (res) => ({
      bookings: mapBookingArray(res.data.data),
      pagination: res.data.pagination,
    }),
  });
}
