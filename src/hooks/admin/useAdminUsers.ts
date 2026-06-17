/**
 * @file useAdminUsers.ts
 * @description React Query query hook for fetching a list of all registered users from the admin panel.
 * @module hooks/admin/useAdminUsers
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Admin service API calls
import { adminService } from '@/services/admin.service';

/**
 * useAdminUsers
 * @description Fetches the list of all registered users in the system from the admin panel.
 * @returns A React Query result containing an array of AdminUser objects.
 */
export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: adminService.listUsers,
    select: (res) => res.data.data,
  });
}
