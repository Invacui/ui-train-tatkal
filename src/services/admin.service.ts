/**
 * @file admin.service.ts
 * @description Admin panel API service for managing agents, bookings, user administration, and dashboard statistics.
 * @module services/admin.service
 */

// Axios API handler
import { api } from '@/lib/axios';

// Generic API response wrapper
import type { ApiResponse } from '@/types/api.types';

// Admin data types
import type {
  DashboardStats,
  AdminAgent,
  AdminBooking,
  AdminUser,
  AdminAgentsResponse,
  AdminBookingsResponse,
  AdminUsersResponse,
} from '@/types/admin.types';

/**
 * adminService
 * @description Provides methods for admin panel API operations, including managing agents (list, approve, suspend), managing bookings (list, detail, refund), viewing dashboard statistics, and managing users.
 */
export const adminService = {
  // Agents

  /**
   * listAgents
   * @description Retrieves a paginated list of all agents, optionally filtered by status (pending, approved, suspended).
   * @param {{ page?: number; limit?: number; status?: string }} [params] - Optional pagination and status filter parameters.
   * @returns A promise resolving to the admin agents response with pagination.
   */
  listAgents: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<AdminAgentsResponse>('/admin/agents', { params }),

  /**
   * approveAgent
   * @description Approves an agent's onboarding application, activating their agent account.
   * @param {string} id - The unique agent or user identifier.
   * @returns A promise resolving to an API response containing the approved AdminAgent.
   */
  approveAgent: (id: string) =>
    api.patch<ApiResponse<AdminAgent>>(`/admin/agents/${id}/approve`),

  /**
   * suspendAgent
   * @description Suspends an agent's account, preventing them from accepting or processing bookings.
   * @param {string} id - The unique agent or user identifier.
   * @returns A promise resolving to an API response containing the suspended AdminAgent.
   */
  suspendAgent: (id: string) =>
    api.patch<ApiResponse<AdminAgent>>(`/admin/agents/${id}/suspend`),

  // Bookings

  /**
   * listBookings
   * @description Retrieves a paginated list of all bookings in the system, optionally filtered by status and date range.
   * @param {{ page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }} [params] - Optional pagination, status, and date range filters.
   * @returns A promise resolving to the admin bookings response with pagination.
   */
  listBookings: (params?: { page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }) =>
    api.get<AdminBookingsResponse>('/admin/bookings', { params }),

  /**
   * getBooking
   * @description Fetches detailed information about a specific booking by ID from an admin perspective.
   * @param {string} id - The unique booking identifier.
   * @returns A promise resolving to an API response containing the AdminBooking details.
   */
  getBooking: (id: string) =>
    api.get<ApiResponse<AdminBooking>>(`/admin/bookings/${id}`),

  /**
   * refundBooking
   * @description Processes a refund for a specific booking, updating its status and recording the refund amount.
   * @param {string} id - The unique booking identifier to refund.
   * @returns A promise resolving to an API response containing the refund status and amount.
   */
  refundBooking: (id: string) =>
    api.patch<ApiResponse<{ bookingId: string; refundAmount: number }>>(`/admin/bookings/${id}/refund`),

  // Dashboard

  /**
   * getDashboard
   * @description Fetches dashboard statistics including total bookings, revenue, agent counts, and user activity.
   * @returns A promise resolving to an API response containing the DashboardStats.
   */
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),

  // Users

  /**
   * listUsers
   * @description Retrieves a paginated list of all registered users in the system.
   * @param {{ page?: number; limit?: number }} [params] - Optional pagination parameters.
   * @returns A promise resolving to the admin users response with pagination.
   */
  listUsers: (params?: { page?: number; limit?: number }) =>
    api.get<AdminUsersResponse>('/admin/users', { params }),

  /**
   * getUser
   * @description Fetches detailed information about a specific user by ID from an admin perspective.
   * @param {string} id - The unique user identifier.
   * @returns A promise resolving to an API response containing the AdminUser details.
   */
  getUser: (id: string) =>
    api.get<ApiResponse<AdminUser>>(`/admin/users/${id}`),
};
