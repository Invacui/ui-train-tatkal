/**
 * @file Admin types
 * @description Types for admin dashboard, extended agent/booking/user models, and admin API responses
 * @module types
 */

// Reused downstream types
import type { Booking } from './bookings.types';
// Agent and user types used in admin contexts
import type { Agent } from './agents.types';
import type { User } from './auth.types';

// Admin dashboard summary statistics
export interface DashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  activeAgents: number;
  completionRate: number;
  recentBookings: Booking[];
}

// Agent record extended with admin-only fields
export interface AdminAgent extends Agent {
  userId: string;
  verificationDocs: string[];
  createdAt: string;
}

// Booking record extended with admin-only fields
export interface AdminBooking extends Booking {
  userId: string;
  agentId?: string;
  agentName?: string;
}

// User record extended with admin-only fields
export interface AdminUser extends User {
  totalBookings: number;
  agentId?: string;
}

// Pagination metadata for admin API responses
export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Paginated admin agents list response
export interface AdminAgentsResponse {
  success: boolean;
  data: AdminAgent[];
  pagination: AdminPagination;
}

// Paginated admin bookings list response
export interface AdminBookingsResponse {
  success: boolean;
  data: AdminBooking[];
  pagination: AdminPagination;
}

// Paginated admin users list response
export interface AdminUsersResponse {
  success: boolean;
  data: AdminUser[];
  pagination: AdminPagination;
}
