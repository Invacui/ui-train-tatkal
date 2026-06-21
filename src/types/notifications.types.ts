/**
 * @file Notification types
 * @description Types for in-app notifications
 * @module types
 */

// User-facing notification (normalised from API shape)
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  /** Arbitrary payload from the backend (e.g. { bookingId, ... }) */
  data?: Record<string, any>;
}
