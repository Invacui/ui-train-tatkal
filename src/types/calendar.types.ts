/**
 * @file Availability calendar types
 * @description Types for the train availability calendar endpoint
 * @module types
 */

/** Availability state for a given date */
export type AvailabilityState = 'Available' | 'FillingFast' | 'FewSeats' | 'Unknown';

/** A single day entry in the availability calendar */
export interface CalendarDay {
  calendar_date: string;           // "DD-MM-YYYY"
  availability_state: AvailabilityState;
  display_title: string | null;    // "Available", "Filling Fast", etc.
  accent_color_hex: string | null; // hex colour for UI rendering
}

/** Full availability calendar response */
export interface CustomAvailabilityCalendar {
  days: CalendarDay[];
  train_identifier_id: string;     // empty string when train-agnostic
  origin_station_code: string;
  destination_station_code: string;
}

/** Parameters for querying the availability calendar */
export interface CalendarSearchParams {
  source: string;
  destination: string;
  startDate: string;               // DD-MM-YYYY (required by API)
  days?: number;                   // default 16, max 30
}
