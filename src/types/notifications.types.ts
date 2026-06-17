/**
 * @file Notification types
 * @description Types for in-app notifications
 * @module types
 */

// User-facing notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

// Wrapper for notification list API response
export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
}
