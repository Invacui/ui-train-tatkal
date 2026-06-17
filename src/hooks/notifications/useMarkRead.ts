/**
 * @file useMarkRead.ts
 * @description React Query mutation hook for marking a single notification as read, invalidating the notifications list cache.
 * @module hooks/notifications/useMarkRead
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Notifications service API calls
import { notificationsService } from '@/services/notifications.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

/**
 * useMarkRead
 * @description Marks a single notification as read by its ID. On success, invalidates the notifications list cache so the UI reflects the updated read/unread status.
 * @returns A React Query mutation object for triggering the mark-read mutation.
 */
export function useMarkRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.notifications.list() });
    },
  });
}
