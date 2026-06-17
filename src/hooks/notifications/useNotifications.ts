/**
 * @file useNotifications.ts
 * @description React Query query hook for fetching the authenticated user's notifications with automatic polling.
 * @module hooks/notifications/useNotifications
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Notifications service API calls
import { notificationsService } from '@/services/notifications.service';

/**
 * useNotifications
 * @description Fetches the list of notifications for the authenticated user. Automatically polls every 30 seconds to pick up new notifications in real-time.
 * @returns A React Query result containing the notification list data.
 */
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: notificationsService.list,
    select: (res) => res.data.data,
    refetchInterval: 30_000,
  });
}
