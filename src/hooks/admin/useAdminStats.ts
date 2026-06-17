/**
 * @file useAdminStats.ts
 * @description React Query query hook for fetching admin dashboard statistics (without polling, unlike useAdminDashboard).
 * @module hooks/admin/useAdminStats
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Admin service API calls
import { adminService } from '@/services/admin.service';

/**
 * useAdminStats
 * @description Fetches admin dashboard statistics (total bookings, revenue, agent counts, user activity). Unlike useAdminDashboard, this hook does not enable polling, making it suitable for one-off stats views.
 * @returns A React Query result containing the DashboardStats object.
 */
export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: adminService.getDashboard,
    select: (res) => res.data.data,
  });
}
