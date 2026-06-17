/**
 * @file useUpdateAgentProfile.ts
 * @description React Query mutation hook for updating the authenticated agent's profile, invalidating the profile cache.
 * @module hooks/agents/useUpdateAgentProfile
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

/**
 * useUpdateAgentProfile
 * @description Updates the agent's profile with the provided fields. On success, invalidates the agent profile cache so the UI reflects the changes, and shows a success toast.
 * @returns A React Query mutation object for triggering the profile update mutation.
 */
export function useUpdateAgentProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => agentsService.updateProfile(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.agents.profile() });
      toast.success('Profile updated');
    },
  });
}
