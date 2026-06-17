/**
 * @file useAdminBookings.ts
 * @description React Query query hook for fetching a paginated list of all bookings from the admin panel with optional filters.
 * @module hooks/admin/useAdminBookings
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Admin service API calls
import { adminService } from '@/services/admin.service';

/**
 * useAdminBookings
 * @description Fetches a paginated list of all bookings in the system, optionally filtered by status and date range. Returns both the booking list and pagination metadata.
 * @param {{ page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }} [params] - Optional pagination, status, and date range filter parameters.
 * @returns A React Query result containing an object with `bookings` (array of AdminBooking) and `pagination` (pagination metadata).
 */
export function useAdminBookings(params?: { page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.bookings(params),
    queryFn: () => adminService.listBookings(params),
    select: (res) => ({
      bookings: res.data.data,
      pagination: res.data.pagination,
    }),
  });
}
