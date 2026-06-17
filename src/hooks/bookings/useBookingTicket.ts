/**
 * @file useBookingTicket.ts
 * @description React Query query hook for fetching the ticket/reservation details for a specific booking.
 * @module hooks/bookings/useBookingTicket
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Bookings service API calls
import { bookingsService } from '@/services/bookings.service';

/**
 * useBookingTicket
 * @description Fetches the ticket (reservation data, PDF, or ticket details) for a specific booking by ID. The query is disabled when no ID is provided. Retries are disabled since ticket data may be unavailable if the ticket is not yet generated.
 * @param {string} id - The unique booking identifier.
 * @returns A React Query result containing the ticket data.
 */
export function useBookingTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.ticket(id),
    queryFn: () => bookingsService.getTicket(id),
    enabled: !!id,
    retry: false,
  });
}
