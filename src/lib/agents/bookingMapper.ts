/**
 * @file Booking mapper
 * @description Maps raw backend Booking responses to the frontend Booking type.
 *   The backend schema uses different field names (fromStation, toStation, etc.)
 *   and flat pricing fields. This mapper normalizes them into the shape the
 *   frontend components expect, avoiding changes to every consumer.
 * @module lib/agents/bookingMapper
 */

import type { Booking, BookingStatus } from '@/types/bookings.types';
import type { Passenger } from '@/types/passengers.types';

/**
 * Raw booking as returned by the backend (GET /agents/requests, /agents/bookings, etc.)
 * Field names and structure come from the OpenAPI spec's Booking schema.
 */
export interface BackendBookingRaw {
  _id: string;
  customerId: string;
  agentId?: string;
  teamMemberId?: string;
  fromStation: string;
  toStation: string;
  travelDate: string;
  travelTime?: string;
  travelTimeFlexibility?: boolean;
  originalTravelDate?: string;
  dateFlexibility?: boolean;
  trainFlexibility?: boolean;
  stationFlexibility?: boolean;
  preferredTrainNumber?: string;
  preferredClasses?: string[];
  preferredTravelClass?: string;
  bookedClass?: string;
  quotaCode?: string;
  needHomeDelivery?: boolean;
  passengers?: Passenger[];
  status: string;
  isBroadcasted?: boolean;
  agentRequestSent?: boolean;
  pnr?: string;
  pnrStatus?: string;
  bookingMode?: string;
  ticketPhotoUrl?: string;
  eTicketUrl?: string;
  deliveryAddress?: Record<string, unknown>;
  userLat?: number;
  userLon?: number;
  calculatedDistance?: number;

  // Flat pricing fields
  ticketFare?: number;
  platformFee?: number;
  convenienceFee?: number;
  deliveryCharge?: number;
  gst?: number;
  totalAmount?: number;

  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus?: string;
  refundAmount?: number;
  refundTriggeredAt?: string;
  refundType?: string;
  formStage?: number;
  assignedAt?: string;
  bookedAt?: string;
  slaDeadline?: string;
  deliveredAt?: string;
  confirmedByCustomerAt?: string;
  agentPaidAt?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  refundInitiatedAt?: string;
  refundCompletedAt?: string;
  refundStatus?: string;
  refundPaymentId?: string;
  failureReason?: string;
  failedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * mapBooking
 * @description Converts a raw backend booking response into the frontend Booking type.
 *   Handles field renames (_id → bookingId), flattens pricing, and provides
 *   sensible defaults for fields the backend doesn't return (trainName, etc.).
 * @param raw - Raw booking from the API
 * @returns A normalized Booking object
 */
export function mapBooking(raw: BackendBookingRaw): Booking {
  return {
    bookingId: raw._id,
    trainNumber: raw.preferredTrainNumber ?? '',
    trainName: '', // Backend Booking schema has no trainName
    sourceStationCode: raw.fromStation,
    destinationStationCode: raw.toStation,
    journeyDate: raw.travelDate,
    departureTime: '', // Backend Booking has no departure/arrival time
    arrivalTime: '',
    travelClass: raw.preferredTravelClass ?? '',
    status: raw.status as BookingStatus,
    passengers: raw.passengers ?? [],
    pricing: raw.totalAmount != null
      ? {
          baseFare: raw.ticketFare ?? 0,
          irctcCharges: raw.platformFee ?? 0,
          tatkalCharges: 0,
          convenienceFee: raw.convenienceFee ?? 0,
          gst: raw.gst ?? 0,
          agentFee: 0,
          discount: 0,
          totalAmount: raw.totalAmount,
        }
      : undefined,
    pnrNumber: raw.pnr ?? '',
    paymentId: raw.paymentId,
    razorpayOrderId: raw.razorpayOrderId,
    bookingMode: raw.bookingMode,
    paymentStatus: raw.paymentStatus,
    refundAmount: raw.refundAmount,
    deliveryAddress: raw.deliveryAddress as Booking['deliveryAddress'],
    agentId: raw.agentId,
    dateFlexibility: raw.dateFlexibility,
    trainFlexibility: raw.trainFlexibility,
    stationFlexibility: raw.stationFlexibility,
    preferredClasses: raw.preferredClasses,
    needHomeDelivery: raw.needHomeDelivery,
    userLat: raw.userLat,
    userLon: raw.userLon,
    calculatedDistance: raw.calculatedDistance,
    formStage: raw.formStage ?? 0,
    travelTime: raw.travelTime,
    travelTimeFlexibility: raw.travelTimeFlexibility,
    cancellationReason: raw.cancellationReason,
    cancelledAt: raw.cancelledAt,
    cancelledBy: raw.cancelledBy,
    refundTriggeredAt: raw.refundTriggeredAt,
    refundType: raw.refundType,
    isBroadcasted: raw.isBroadcasted,
    agentRequestSent: raw.agentRequestSent,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/**
 * mapBookingArray
 * @description Maps an array of raw backend bookings to frontend Booking objects.
 * @param rawArray - Array of raw bookings from the API
 * @returns Array of normalized Booking objects (filters out nulls)
 */
export function mapBookingArray(rawArray: BackendBookingRaw[]): Booking[] {
  return (rawArray ?? []).map(mapBooking);
}
