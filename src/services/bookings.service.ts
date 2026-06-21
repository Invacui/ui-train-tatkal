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
import type { Booking, CreateBookingDto, UpdateBookingDto, CancelBookingDto, PriceBreakdown, CalculatePriceDto } from '@/types/bookings.types';

/**
 * Normalise a raw booking object from the backend into the frontend Booking shape.
 * Backend returns fields like _id, fromStation, toStation, travelDate, preferredTrainNumber
 * and flat pricing — this maps them to the frontend's expected field names.
 */
function normaliseBooking(raw: any): Booking {
  return {
    bookingId: raw._id || raw.bookingId || '',
    trainNumber: raw.preferredTrainNumber || raw.train_number || raw.trainNumber || '',
    trainName: raw.trainName || raw.train_name || raw.train_display_name || raw.preferredTrainNumber || '',
    sourceStationCode: raw.fromStation || raw.sourceStationCode || '',
    destinationStationCode: raw.toStation || raw.destinationStationCode || '',
    journeyDate: raw.travelDate || raw.journeyDate,
    departureTime: raw.departureTime || raw.departure_time_24h || '',
    arrivalTime: raw.arrivalTime || raw.arrival_time_24h || '',
    travelClass: raw.preferredTravelClass || raw.travelClass || raw.bookedClass || '',
    needHomeDelivery: raw.needHomeDelivery ?? false,
    status: raw.status,
    passengers: (raw.passengers || []).map((p: any) => ({
      name: p.name,
      age: p.age,
      gender: p.gender,
      berthPreference: p.berthPreference,
      seatNumber: p.seatNumber,
      pnr: p.pnr,
      idCardType: p.idCardType || p.idType,
      idCardNumber: p.idCardNumber || p.idNumber,
      status: p.status,
    })),
    pricing: raw.pricing || {
      baseFare: raw.ticketFare || 0,
      irctcCharges: (raw.platformFee || 0) + (raw.convenienceFee || 0),
      tatkalCharges: raw.tatkalCharges || 0,
      convenienceFee: raw.convenienceFee || 0,
      gst: raw.gst || 0,
      agentFee: raw.agentFee || 0,
      discount: raw.discount || 0,
      totalAmount: raw.totalAmount || 0,
    },
    pnrNumber: raw.pnr || raw.pnrNumber,
    paymentId: raw.paymentId,
    razorpayOrderId: raw.razorpayOrderId,
    deliveryAddress: raw.deliveryAddress,
    agentId: raw.agentId,
    dateFlexibility: raw.dateFlexibility,
    trainFlexibility: raw.trainFlexibility,
    stationFlexibility: raw.stationFlexibility,
    preferredClasses: raw.preferredClasses,
    userLat: raw.userLat,
    userLon: raw.userLon,
    calculatedDistance: raw.calculatedDistance,
    formStage: raw.formStage || 1,
    travelTime: raw.travelTime,
    travelTimeFlexibility: raw.travelTimeFlexibility,
    bookingMode: raw.bookingMode,
    paymentStatus: raw.paymentStatus,
    refundAmount: raw.refundAmount ?? 0,
    /** Cancellation & refund fields */
    cancellationReason: raw.cancellationReason || raw.cancellation_reason,
    cancelledAt: raw.cancelledAt || raw.cancelled_at,
    cancelledBy: raw.cancelledBy || raw.cancelled_by,
    refundTriggeredAt: raw.refundTriggeredAt || raw.refund_triggered_at,
    refundType: raw.refundType || raw.refund_type,
    isBroadcasted: raw.isBroadcasted ?? false,
    agentRequestSent: raw.agentRequestSent ?? false,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

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
  createBooking: async (dto: CreateBookingDto) => {
    const res = await api.post<ApiResponse<any>>('/bookings', dto);
    res.data.data = normaliseBooking(res.data.data);
    return res as unknown as { data: { data: Booking } };
  },

  /**
   * listBookings
   * @description Retrieves a paginated list of bookings for the authenticated user, optionally filtered by status.
   * @param {PaginationParams & { status?: string }} [params] - Optional pagination and status filter parameters.
   * @returns A promise resolving to a paginated API response containing Booking objects.
   */
  listBookings: async (params?: PaginationParams & { status?: string }) => {
    const res = await api.get<PaginatedResponse<any>>('/bookings', { params });
    res.data.data = res.data.data.map(normaliseBooking);
    return res as unknown as { data: PaginatedResponse<Booking> };
  },

  /**
   * getBooking
   * @description Fetches detailed information about a specific booking by its ID.
   * @param {string} id - The unique booking identifier.
   * @returns A promise resolving to an API response containing the Booking details.
   */
  getBooking: async (id: string) => {
    const res = await api.get<ApiResponse<any>>(`/bookings/${id}`);
    res.data.data = normaliseBooking(res.data.data);
    return res as unknown as { data: { data: Booking } };
  },

  /**
   * cancelBooking
   * @description Cancels an existing booking by ID with a reason.
   *   POST /bookings/:id/cancel with { reason, cancelledBy }.
   *   Returns status "cancelled" or "cancelled_with_refund".
   */
  cancelBooking: (id: string, dto: CancelBookingDto) =>
    api.post<ApiResponse<{ bookingId: string; status: string; refundAmount?: number; }>>(`/bookings/${id}/cancel`, dto),

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

  /**
   * updateBooking
   * @description Partially updates an existing booking (e.g. assign agent, add delivery address).
   * @param {string} id - The unique booking identifier.
   * @param {UpdateBookingDto} dto - The partial fields to update.
   * @returns A promise resolving to the updated Booking object.
   */
  updateBooking: async (id: string, dto: UpdateBookingDto) => {
    const res = await api.patch<ApiResponse<any>>(`/bookings/${id}`, dto);
    if (res.data.data) {
      res.data.data = normaliseBooking(res.data.data);
    }
    return res as unknown as { data: { data: Booking } };
  },

  /**
   * calculatePrice
   * @description Fetches a server-side price breakdown for the given booking parameters.
   *   The backend uses the active PricingConfig and returns an itemised breakdown.
   * @param {CalculatePriceDto} dto - The price calculation parameters.
   * @returns A promise resolving to the full PriceBreakdown.
   */
  calculatePrice: (dto: CalculatePriceDto) =>
    api.post<ApiResponse<PriceBreakdown>>('/bookings/calculate-price', dto),
};
