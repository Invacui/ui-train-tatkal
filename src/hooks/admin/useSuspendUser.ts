/**
 * @file useSuspendUser.ts
 * @description React Query mutation hook for an admin to suspend a user account, invalidating the user detail and users list caches.
 * @module hooks/admin/useSuspendUser
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Admin service API calls
import { adminService } from '@/services/admin.service';

// Suspend user DTO type
import type { SuspendUserDto } from '@/types/admin.types';

/**
 * useSuspendUser
 * @description Suspends a user account by user ID with the provided suspension details (reason, duration). On success, invalidates the user detail and users list caches, and shows a success toast. On failure, shows the error message.
 * @param {string} userId - The unique identifier of the user to suspend.
 * @returns A React Query mutation object for triggering the user suspension mutation.
 */
export function useSuspendUser(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: SuspendUserDto) => adminService.suspendUser(userId, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.admin.user(userId) });
      void qc.invalidateQueries({ queryKey: queryKeys.admin.users() });
      toast.success('User suspended.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
