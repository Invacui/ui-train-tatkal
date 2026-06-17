/**
 * @file useAdminAgentApprove.ts
 * @description React Query mutation hook for an admin to approve an agent's onboarding application.
 * @module hooks/admin/useAdminAgentApprove
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
 * useAdminAgentApprove
 * @description Approves a pending agent application by agent ID. On success, invalidates the agents list cache and shows a success toast.
 * @returns A React Query mutation object for triggering the agent approval mutation.
 */
export function useAdminAgentApprove() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.approveAgent(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.admin.agents() });
      toast.success('Agent approved');
    },
  });
}
