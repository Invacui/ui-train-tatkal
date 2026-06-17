/**
 * @file useBookings.ts
 * @description React Query query hook for fetching a paginated list of the authenticated user's bookings with optional status filter.
 * @module hooks/bookings/useBookings
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Bookings service API calls
import { bookingsService } from '@/services/bookings.service';

// Pagination parameters type
import type { PaginationParams } from '@/types/api.types';

/**
 * useBookings
 * @description Fetches the authenticated user's bookings as a paginated list, optionally filtered by booking status. Returns both the booking list and pagination metadata.
 * @param {PaginationParams & { status?: string }} [params] - Optional pagination parameters and status filter.
 * @returns A React Query result containing an object with `bookings` (array of Booking) and `pagination` (pagination metadata).
 */
export function useBookings(params?: PaginationParams & { status?: string }) {
  return useQuery({
    queryKey: queryKeys.bookings.list(params),
    queryFn: () => bookingsService.listBookings(params),
    select: (res) => ({
      bookings: res.data.data,
      pagination: res.data.pagination,
    }),
  });
}
