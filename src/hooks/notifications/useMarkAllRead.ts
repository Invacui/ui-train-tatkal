/**
 * @file useMarkAllRead.ts
 * @description React Query mutation hook for marking all notifications as read, invalidating the notifications list cache.
 * @module hooks/notifications/useMarkAllRead
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Notifications service API calls
import { notificationsService } from '@/services/notifications.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

/**
 * useMarkAllRead
 * @description Marks all unread notifications as read for the authenticated user. On success, invalidates the notifications list cache so the UI reflects all notifications as read.
 * @returns A React Query mutation object for triggering the mark-all-read mutation.
 */
export function useMarkAllRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationsService.markAllRead,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.notifications.list() });
    },
  });
}
