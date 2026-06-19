/**
 * @file PNR status types
 * @description Types for PNR status checking, passenger manifest, and derived journey status
 * @module types
 */

/** Derived journey-level status computed from the passenger manifest */
export type DerivedJourneyStatus =
  | 'CONFIRMED'
  | 'RAC'
  | 'WAITING_LIST'
  | 'CANCELLED'
  | 'PARTIALLY_CONFIRMED'
  | 'CHART_NOT_PREPARED';

/** A single passenger's details within a PNR response */
export interface PNRPassenger {
  sequence_no: number;
  booked_status_label: string;    // e.g. "CNF", "W/L 5"
  current_status_label: string;   // e.g. "CNF", "WL 15"
  assigned_coach: string | null;  // e.g. "B1"
  assigned_berth: number | null;  // berth number
}

/** Full PNR status response from the ACL */
export interface CustomPNRStatusModel {
  pnr_record_id: string;                       // 10-digit PNR
  associated_train_number: string;
  associated_train_name: string;
  journey_commence_date: string;               // YYYY-MM-DD
  boarding_station_code: string;
  destination_station_code: string;
  origin_station_code: string;
  terminus_station_code: string;
  travel_class_code: string;                   // e.g. "3A", "SL", "2S"
  chart_preparation_state: string;             // e.g. "CHART NOT PREPARED"
  derived_journey_status: DerivedJourneyStatus;
  passenger_manifest: PNRPassenger[];
}

/** Input payload for PNR status lookup */
export interface PnrStatusLookup {
  pnr: string;
}
