/**
 * @file notifications.service.ts
 * @description Notification-related API service for listing notifications and marking them as read.
 * @module services/notifications.service
 */

// Axios API handler
import { api } from '@/lib/axios';

// Notification list response type
import type { NotificationListResponse } from '@/types/notifications.types';

/**
 * notificationsService
 * @description Provides methods for notification-related API operations, including fetching the user's notifications and marking individual or all notifications as read.
 */
export const notificationsService = {

  /**
   * list
   * @description Fetches the list of notifications for the authenticated user.
   * @returns A promise resolving to the notification list response.
   */
  list: () => api.get<NotificationListResponse>('/notifications'),

  /**
   * markRead
   * @description Marks a single notification as read by its ID.
   * @param {string} id - The unique notification identifier.
   * @returns A promise resolving to the API response.
   */
  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  /**
   * markAllRead
   * @description Marks all unread notifications as read for the authenticated user.
   * @returns A promise resolving to the API response.
   */
  markAllRead: () =>
    api.patch('/notifications/read-all'),
};
