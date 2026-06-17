/**
 * @file Seat types
 * @description Types for seat maps, coaches, and seat selection
 * @module types
 */

// Availability status of a seat
export type SeatStatus = 'available' | 'booked' | 'rac' | 'waitlist' | 'ladies' | 'premium';

// Individual seat within a coach
export interface Seat {
  number: string;
  coach: string;
  row: number;
  column: number;
  status: SeatStatus;
  berthType: 'lower' | 'middle' | 'upper' | 'side_lower' | 'side_upper';
  passengerName?: string;
}

// A coach containing multiple seats
export interface Coach {
  name: string;
  class: string;
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
}

// Full seat map for a train journey
export interface SeatMap {
  trainNumber: string;
  journeyDate: string;
  coaches: Coach[];
}

// User's selected seats for booking
export interface SeatSelection {
  coachName: string;
  seatNumbers: string[];
}
