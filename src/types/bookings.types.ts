/**
 * @file Booking types
 * @description Types for bookings, booking statuses, pricing, and booking DTOs
 * @module types
 */

// Passenger type used in booking records
import type { Passenger } from './passengers.types';

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
  | 'completed';

// Pricing breakdown for a booking
export interface BookingPricing {
  baseFare: number;
  irctcCharges: number;
  tatkalCharges: number;
  convenienceFee: number;
  gst: number;
  agentFee: number;
  discount: number;
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
  createdAt: string;
  updatedAt: string;
}

// Payload for creating a new booking
export interface CreateBookingDto {
  fromStation: string;
  toStation: string;
  travelDate: string;
  dateFlexibility?: boolean;
  trainFlexibility?: boolean;
  stationFlexibility?: boolean;
  preferredClasses?: string[];
  passengers: {
    name: string;
    age: number;
    gender: string;
    idType: string;
    idNumber: string;
  }[];
}
