/**
 * @file agents.service.ts
 * @description Agent-related API service for onboarding, profile management, team management, booking requests, PNR submission, ticket upload, stats, and earnings.
 * @module services/agents.service
 */

// Axios API handler
import { api } from '@/lib/axios';

// Standard and paginated API response types
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

// Agent data types
import type {
  AgentProfile,
  AgentStats,
  AgentEarnings,
  AgentEarningsEntry,
  AgentOnboardDto,
  TeamMemberDto,
} from '@/types/agents.types';

// Booking data type
import type { Booking } from '@/types/bookings.types';

/**
 * agentsService
 * @description Provides methods for agent-related API operations, including onboarding, profile and team management, viewing and accepting booking requests, submitting PNRs and tickets, and fetching stats and earnings.
 */
export const agentsService = {

  /**
   * onboard
   * @description Submits an agent onboarding application with personal and business details for admin review.
   * @param {AgentOnboardDto} dto - The onboarding payload containing agent details.
   * @returns A promise resolving to an API response containing the created AgentProfile.
   */
  onboard: (dto: AgentOnboardDto) =>
    api.post<ApiResponse<AgentProfile>>('/agents/onboard', dto),

  /**
   * getProfile
   * @description Fetches the authenticated agent's profile information.
   * @returns A promise resolving to an API response containing the agent's profile.
   */
  getProfile: () =>
    api.get<ApiResponse<AgentProfile>>('/agents/profile'),

  /**
   * updateProfile
   * @description Updates the authenticated agent's profile information (partial update).
   * @param {Partial<AgentOnboardDto>} dto - The profile fields to update.
   * @returns A promise resolving to an API response containing the updated AgentProfile.
   */
  updateProfile: (dto: Partial<AgentOnboardDto>) =>
    api.patch<ApiResponse<AgentProfile>>('/agents/profile', dto),

  /**
   * addTeamMember
   * @description Adds a new member to the agent's team.
   * @param {TeamMemberDto} dto - The team member details to add.
   * @returns A promise resolving to the API response.
   */
  addTeamMember: (dto: TeamMemberDto) =>
    api.post('/agents/team', dto),

  /**
   * removeTeamMember
   * @description Removes a member from the agent's team by member ID.
   * @param {string} memberId - The unique team member identifier.
   * @returns A promise resolving to the API response.
   */
  removeTeamMember: (memberId: string) =>
    api.delete(`/agents/team/${memberId}`),

  /**
   * getRequests
   * @description Retrieves all pending booking requests assigned to the agent for acceptance.
   * @returns A promise resolving to an API response containing an array of Booking requests.
   */
  getRequests: () =>
    api.get<ApiResponse<Booking[]>>('/agents/requests'),

  /**
   * acceptRequest
   * @description Accepts a booking request, assigning the booking to the agent for processing.
   * @param {string} bookingId - The unique booking identifier to accept.
   * @returns A promise resolving to the API response.
   */
  acceptRequest: (bookingId: string) =>
    api.post(`/agents/requests/${bookingId}/accept`),

  /**
   * getBookings
   * @description Retrieves a paginated list of bookings assigned to the authenticated agent.
   * @param {{ page?: number; limit?: number }} [params] - Optional pagination parameters.
   * @returns A promise resolving to a paginated API response containing Booking objects.
   */
  getBookings: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Booking>>('/agents/bookings', { params }),

  /**
   * submitPNR
   * @description Submits the PNR (Passenger Name Record) number for a booking, usually after ticket confirmation.
   * @param {string} bookingId - The unique booking identifier.
   * @param {string} pnr - The PNR number received after booking confirmation.
   * @returns A promise resolving to the API response.
   */
  submitPNR: (bookingId: string, pnr: string) =>
    api.patch(`/agents/bookings/${bookingId}/pnr`, { pnr }),

  /**
   * uploadTicket
   * @description Uploads the ticket photo/image URL for a booking after the ticket has been procured.
   * @param {string} bookingId - The unique booking identifier.
   * @param {string} ticketPhotoUrl - The URL of the uploaded ticket photo.
   * @returns A promise resolving to the API response.
   */
  uploadTicket: (bookingId: string, ticketPhotoUrl: string) =>
    api.patch(`/agents/bookings/${bookingId}/ticket`, { ticketPhotoUrl }),

  /**
   * uploadTicketFile
   * @description Uploads a ticket photo file via multipart POST.
   *   Transitions booking status from at_counter to booking_in_progress
   *   and saves the ticket photo URL in one call.
   * @param {string} bookingId - The unique booking identifier.
   * @param {File} file - The ticket photo file (JPEG, PNG, or WebP, max 5 MB).
   * @returns A promise resolving to an API response containing the uploaded URL.
   */
  uploadTicketFile: (bookingId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/agents/bookings/${bookingId}/upload/ticket`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * getBooking
   * @description Fetches detailed information about a specific booking assigned to the agent.
   * @param {string} bookingId - The unique booking identifier.
   * @returns A promise resolving to an API response containing the Booking details.
   */
  getBooking: (bookingId: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${bookingId}`),

  /**
   * getStats
   * @description Fetches the agent's performance statistics (e.g., total bookings, acceptance rate, etc.).
   * @returns A promise resolving to an API response containing the AgentStats.
   */
  getStats: () =>
    api.get<ApiResponse<AgentStats>>('/agents/stats'),

  /**
   * getEarnings
   * @description Fetches the agent's earnings data, including commissions and payout information.
   * @returns A promise resolving to an API response containing an array of AgentEarningsEntry.
   */
  getEarnings: () =>
    api.get<ApiResponse<AgentEarningsEntry[]>>('/agents/earnings'),

  /**
   * completeOnboarding
   * @description Marks the agent's onboarding carousel as completed.
   * @returns A promise resolving to the API response.
   */
  completeOnboarding: () =>
    api.post('/agents/complete-onboarding'),
};
