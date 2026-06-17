/**
 * @file useAdminAgentSuspend.ts
 * @description React Query mutation hook for an admin to suspend an agent's account.
 * @module hooks/admin/useAdminAgentSuspend
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Admin service API calls
import { adminService } from '@/services/admin.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

/**
 * useAdminAgentSuspend
 * @description Suspends an agent's account by agent ID, preventing them from accepting or processing new bookings. On success, invalidates the agents list cache and shows a success toast.
 * @returns A React Query mutation object for triggering the agent suspension mutation.
 */
export function useAdminAgentSuspend() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.suspendAgent(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.admin.agents() });
      toast.success('Agent suspended');
    },
  });
}
