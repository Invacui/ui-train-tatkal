/**
 * @file notifications.service.ts
 * @description Notification-related API service for listing notifications and marking them as read.
 * @module services/notifications.service
 */

// Axios API handler
import { api } from '@/lib/axios';

// Notification types
import type { Notification } from '@/types/notifications.types';

/**
 * Normalise a raw notification object from the backend into the frontend Notification shape.
 * Backend sends `_id`, `read`, `body` — this maps them to `id`, `isRead`, `message`.
 */
function normaliseNotification(raw: any): Notification {
  return {
    id: raw._id || raw.id || '',
    userId: raw.userId,
    title: raw.title,
    message: raw.body || raw.message || '',
    type: raw.type,
    isRead: raw.read ?? raw.isRead ?? false,
    createdAt: raw.createdAt || raw.sentAt,
    /** Keep raw data for reference (e.g. bookingId link) */
    data: raw.data,
  };
}

/**
 * notificationsService
 * @description Provides methods for notification-related API operations, including fetching the user's notifications and marking individual or all notifications as read.
 */
export const notificationsService = {

  /**
   * list
   * @description Fetches the list of notifications for the authenticated user.
   * @returns A promise resolving to the notification list with normalised field names.
   */
  list: async () => {
    const res = await api.get<{ success: boolean; data: any[] }>('/notifications');
    res.data.data = res.data.data.map(normaliseNotification);
    return res as unknown as { data: { success: boolean; data: Notification[] } };
  },

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
