/**
 * @file useBooking.ts
 * @description React Query query hook for fetching detailed information about a specific booking by its ID.
 * @module hooks/bookings/useBooking
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Bookings service API calls
import { bookingsService } from '@/services/bookings.service';

/**
 * useBooking
 * @description Fetches detailed information about a specific booking identified by its ID. The query is disabled when no ID is provided, allowing the hook to be called with an empty string before the ID is available.
 * @param {string} id - The unique booking identifier.
 * @returns A React Query result containing the Booking detail object.
 */
export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => bookingsService.getBooking(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}
