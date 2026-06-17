/**
 * @file useAdminDashboard.ts
 * @description React Query query hook for fetching admin dashboard statistics with automatic polling.
 * @module hooks/admin/useAdminDashboard
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Admin service API calls
import { adminService } from '@/services/admin.service';

/**
 * useAdminDashboard
 * @description Fetches admin dashboard statistics (total bookings, revenue, agent counts, user activity). Automatically polls every 60 seconds to keep dashboard data fresh.
 * @returns A React Query result containing the DashboardStats object.
 */
export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: adminService.getDashboard,
    select: (res) => res.data.data,
    refetchInterval: 60_000,
  });
}
