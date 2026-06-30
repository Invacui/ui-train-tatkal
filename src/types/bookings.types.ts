/**
 * @file Booking types
 * @description Types for bookings, booking statuses, pricing, and booking DTOs
 * @module types
 */

// Passenger type used in booking records
import type { Passenger } from './passengers.types';

// Address type used in booking delivery
import type { UserAddress } from './auth.types';

/**
 * PriceBreakdown
 * @description Full pricing breakdown returned by the server-side calculate-price
 *   endpoint. The API returns nested objects so that both the percentage and the
 *   computed rupee amount are available for display.
 *
 *   Shape (as of API v2):
 *     baseFare:       { perPassenger, total }
 *     passengerCount: number
 *     agentFee:       { pct, amount }
 *     platformFee:    { pct, amount }
 *     gst:            { pct, amount }
 *     deliveryCharge: { amount }
 *     totalAmount:    number
 */
export interface PriceBreakdown {
  baseFare: { perPassenger: number; total: number };
  passengerCount: number;
  agentFee: { pct: number; amount: number };
  platformFee: { pct: number; amount: number };
  gst: { pct: number; amount: number };
  deliveryCharge: { amount: number };
  totalAmount: number;
}

/** DTO for requesting a price calculation from the server */
export interface CalculatePriceDto {
  baseFare: number;
  passengerCount?: number;
  needHomeDelivery?: boolean;
}

// Lifecycle status of a booking
export type BookingStatus =
  | 'payment_pending'
  | 'pending_agent'
  | 'agent_assigned'
  | 'at_counter'
  | 'booking_in_progress'
  | 'pnr_submitted'
  | 'confirmed'
  | 'waiting_list'
  | 'failed'
  | 'refunded'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'cancelled_with_refund'
  | 'cancellation_failed';

// Pricing breakdown for a booking
export interface BookingPricing {
  baseFare: number;
  platformFee: number;
  convenienceFee: number;
  gst: number;
  agentFee: number;
  discount: number;
  deliveryCharge?: number;
  totalAmount: number;
}

// Complete booking record
export interface Booking {
  bookingId: string;
  trainNumber: string;
  trainName: string;
  sourceStationCode: string;
  destinationStationCode: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  status: BookingStatus;
  passengers: Passenger[];
  pricing: BookingPricing;
  pnrNumber?: string;
  ticketPhotoUrl?: string;
  eTicketUrl?: string;
  pnrStatus?: string;
  /** Payment tracking */
  paymentId?: string;
  razorpayOrderId?: string;
  /** Raw booking mode (online / agent) */
  bookingMode?: string;
  /** Payment status from the raw booking */
  paymentStatus?: string;
  /** Refund amount processed */
  refundAmount?: number;
  /** Delivery address (if home delivery requested) */
  deliveryAddress?: UserAddress;
  /** Assigned agent */
  agentId?: string;
  /** Flexibility flags set during checkout */
  dateFlexibility?: boolean;
  trainFlexibility?: boolean;
  stationFlexibility?: boolean;
  preferredClasses?: string[];
  /** Whether home delivery was requested */
  needHomeDelivery?: boolean;
  /** User geolocation captured at booking time */
  userLat?: number;
  userLon?: number;
  /** Distance from user to assigned agent in km */
  calculatedDistance?: number;
  /** Current form stage for resume (1-9) */
  formStage: number;
  travelTime?: string;
  travelTimeFlexibility?: boolean;
  /** Cancellation & refund info */
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  refundTriggeredAt?: string;
  refundType?: string;
  /** Broadcasting / agent-request flags */
  isBroadcasted?: boolean;
  agentRequestSent?: boolean;
  /** Agent who accepted the booking */
  acceptedBy?: { name: string; email: string };
  /** When the agent was assigned */
  assignedAt?: string;
  /** SLA deadline for the agent to book */
  slaDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

// DTO for updating an existing booking (partial update via PATCH)
export interface UpdateBookingDto {
  agentId?: string;
  deliveryAddress?: UserAddress;
  needHomeDelivery?: boolean;
  passengers?: {
    name: string;
    age: number;
    gender: string;
    berthPreference?: string;
    idType?: string;
    idNumber?: string;
  }[];
  dateFlexibility?: boolean;
  trainFlexibility?: boolean;
  stationFlexibility?: boolean;
  userLat?: number;
  userLon?: number;
  /** Pricing fields — patched after price calculation step */
  ticketFare?: number;
  totalAmount?: number;
  /** Form stage for resume */
  formStage?: number;
  travelTime?: string;
  travelTimeFlexibility?: boolean;
}

// Payload for creating a new booking
export interface CreateBookingDto {
  fromStation: string;
  toStation: string;
  travelDate: string;
  preferredTrainNumber: string;
  preferredTravelClass: string;
  ticketFare: number;
  quotaCode?: string;
  needHomeDelivery?: boolean;
  dateFlexibility?: boolean;
  trainFlexibility?: boolean;
  stationFlexibility?: boolean;
  preferredClasses?: string[];
  userLat?: number;
  userLon?: number;
  /** Form stage for resume */
  formStage?: number;
  travelTime?: string;
  travelTimeFlexibility?: boolean;
  passengers?: {
    name: string;
    age: number;
    gender: string;
    berthPreference?: string;
    idType?: string;
    idNumber?: string;
  }[];
}

// Payload for cancelling a booking
export interface CancelBookingDto {
  reason: string;
  cancelledBy: 'customer' | 'agent' | 'admin';
}