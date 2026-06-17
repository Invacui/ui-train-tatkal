/**
 * @file useAdminAgents.ts
 * @description React Query query hook for fetching a paginated list of all agents from the admin panel.
 * @module hooks/admin/useAdminAgents
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Admin service API calls
import { adminService } from '@/services/admin.service';

/**
 * useAdminAgents
 * @description Fetches a paginated list of all agents in the system, optionally filtered by status (pending, approved, suspended). Returns both the agent list and pagination metadata.
 * @param {{ page?: number; limit?: number; status?: string }} [params] - Optional pagination and status filter parameters.
 * @returns A React Query result containing an object with `agents` (array of AdminAgent) and `pagination` (pagination metadata).
 */
export function useAdminAgents(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.agents(params),
    queryFn: () => adminService.listAgents(params),
    select: (res) => ({
      agents: res.data.data,
      pagination: res.data.pagination,
    }),
  });
}
