/**
 * @file useAdminBooking.ts
 * @description React Query query hook for fetching detailed information about a specific booking from the admin perspective.
 * @module hooks/admin/useAdminBooking
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Admin service API calls
import { adminService } from '@/services/admin.service';

/**
 * useAdminBooking
 * @description Fetches detailed information about a specific booking by ID from the admin perspective. The query is disabled when no ID is provided.
 * @param {string} id - The unique booking identifier.
 * @returns A React Query result containing the AdminBooking detail object.
 */
export function useAdminBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.booking(id),
    queryFn: () => adminService.getBooking(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}
