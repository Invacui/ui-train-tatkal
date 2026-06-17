/**
 * @file bookings.service.ts
 * @description Booking-related API service for creating, listing, retrieving, cancelling bookings, confirming delivery, and fetching tickets.
 * @module services/bookings.service
 */

// Axios API handler
import { api } from '@/lib/axios';

// API response types including paginated responses and pagination parameters
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';

// Booking data types and create-booking DTO
import type { Booking, CreateBookingDto } from '@/types/bookings.types';

/**
 * bookingsService
 * @description Provides methods for booking-related API operations, allowing users to create new bookings, list their bookings, retrieve booking details, cancel bookings, confirm ticket delivery, and download tickets.
 */
export const bookingsService = {

  /**
   * createBooking
   * @description Creates a new train ticket booking with the provided details (train, passengers, class, etc.).
   * @param {CreateBookingDto} dto - The booking creation payload containing train details, passengers, and payment info.
   * @returns A promise resolving to an API response containing the created Booking object.
   */
  createBooking: (dto: CreateBookingDto) =>
    api.post<ApiResponse<Booking>>('/bookings', dto),

  /**
   * listBookings
   * @description Retrieves a paginated list of bookings for the authenticated user, optionally filtered by status.
   * @param {PaginationParams & { status?: string }} [params] - Optional pagination and status filter parameters.
   * @returns A promise resolving to a paginated API response containing Booking objects.
   */
  listBookings: (params?: PaginationParams & { status?: string }) =>
    api.get<PaginatedResponse<Booking>>('/bookings', { params }),

  /**
   * getBooking
   * @description Fetches detailed information about a specific booking by its ID.
   * @param {string} id - The unique booking identifier.
   * @returns A promise resolving to an API response containing the Booking details.
   */
  getBooking: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}`),

  /**
   * cancelBooking
   * @description Cancels an existing booking by ID and processes the applicable refund amount.
   * @param {string} id - The unique booking identifier to cancel.
   * @returns A promise resolving to an API response containing the cancellation status and refund amount.
   */
  cancelBooking: (id: string) =>
    api.delete<ApiResponse<{ bookingId: string; status: string; refundAmount: number }>>(`/bookings/${id}`),

  /**
   * confirmDelivery
   * @description Confirms that the ticket has been delivered to the customer, typically used by agents.
   * @param {string} id - The unique booking identifier.
   * @returns A promise resolving to the API response.
   */
  confirmDelivery: (id: string) =>
    api.patch(`/bookings/${id}/confirm-delivery`),

  /**
   * getTicket
   * @description Fetches the ticket/reservation details for a specific booking, typically returning a PDF or ticket data.
   * @param {string} id - The unique booking identifier.
   * @returns A promise resolving to the ticket data.
   */
  getTicket: (id: string) =>
    api.get(`/bookings/${id}/ticket`),
};
