/**
 * @file Trip and train types
 * @description Types for train data, search parameters, and stations
 * @module types
 */

// ─── Availability (from ConfirmTkt integration) ─────────────────────────

/** Per-class + per-quota availability from the ConfirmTkt integration */
export interface CustomClassAvailability {
  travel_class_code: string;             // e.g. "1A", "2A", "3A", "SL"
  quota_code: string;                    // "GN" = General, "TQ" = Tatkal
  availability_status_text: string;      // e.g. "RLWL13/WL11", "NOT AVAILABLE"
  availability_display_label: string;    // e.g. "WL 11", "AVAILABLE-0018"
  is_bookable: boolean;                  // false when closed (fare=0 + NOT AVAILABLE)
  fare_amount: number;                   // Fare in INR
  booking_prediction_percentage: number | null; // 0–100 booking chance
  data_timestamp: string | null;         // ISO timestamp of cache
}

// ─── Train / Search Result ─────────────────────────────────────────────

/**
 * Enhanced train search result returned by searchTrains().
 * Matches the CustomTrainSearchResult from the OpenAPI spec.
 */
export interface Train {
  /** Unique train identifier (e.g. "12301") */
  trainNumber: string;
  /** Human-readable train display name (e.g. "HOWRAH - NEW DELHI RAJDHANI EXPRESS") */
  trainName: string;
  /** Origin station code */
  sourceStationCode: string;
  /** Destination station code */
  destinationStationCode: string;
  /** Scheduled departure in HH:mm format */
  departureTime: string;
  /** Scheduled arrival in HH:mm format */
  arrivalTime: string;
  /** Travel duration string (e.g. "00:36") */
  duration: string;
  /** Available classes (backward-compat: derived from class_availability) */
  classes: TrainClass[];
  /** Whether the train is active */
  isActive: boolean;
  /** Whether the train has Tatkal quota (derived from class_availability) */
  hasTatkal: boolean;

  // ── New fields from CustomTrainSearchResult ──

  /** Raw train identifier from the API */
  train_identifier_id: string;
  /** Raw train display name from the API */
  train_display_name: string;
  /** Origin station code */
  origin_station_code: string;
  /** Origin station full name */
  origin_station_name: string;
  /** Destination station code */
  destination_station_code: string;
  /** Destination station full name */
  destination_station_name: string;
  /** Boarding station code */
  boarding_station_code: string;
  /** Boarding station name */
  boarding_station_name: string;
  /** Alighting station code */
  alighting_station_code: string;
  /** Alighting station name */
  alighting_station_name: string;
  /** Scheduled departure in HH:mm */
  departure_time_24h: string;
  /** Scheduled arrival in HH:mm */
  arrival_time_24h: string;
  /** Travel duration string (e.g. "00:36") */
  travel_duration_tt: string | null;
  /** 7-char binary running days (MTWTFSS), e.g. "1111111" */
  running_days_binary: string;
  /** Train category (MAIL_EXPRESS, SUPERFAST, GARIB_RATH, SHATABDI, etc.) */
  train_category: string;
  /** Total distance in km */
  total_distance_km: number | null;
  /** Number of halts */
  total_halts_count: number;
  /** Safety flag for corrupt data */
  is_data_corrupt: boolean;

  /** Per-class + per-quota availability entries */
  class_availability: CustomClassAvailability[];
  /** Travel duration in minutes */
  travel_duration_minutes: number | null;
  /** Whether the train has a pantry car */
  has_pantry: boolean;
  /** Whether the train is a Tejas service */
  is_tejas: boolean;
  /** User rating (1–5) */
  train_rating: number | null;

  // ── Amenities ──
  /** Whether WiFi is available on board */
  has_wifi: boolean;
  /** Whether mobile charging points are available */
  has_charging: boolean;
  /** Whether blankets are provided */
  has_blanket: boolean;
  /** Whether bedroll is provided */
  has_bedroll: boolean;
  /** Whether food/meal is included */
  has_meal: boolean;
}

/** A travel class available on a train (legacy shape) */
export interface TrainClass {
  code: string;
  name: string;
  availableSeats: number;
  fare: number;
}

// ─── Search ────────────────────────────────────────────────────────────

/** Parameters for searching train trips */
export interface TripSearchParams {
  source: string;
  destination: string;
  date: string;
  class?: string;
  page?: number;
  pageSize?: number;
}

/** Result of a trip search containing matching trains and station info */
export interface TripSearchResult {
  trains: Train[];
  sourceStation: Station;
  destinationStation: Station;
  searchDate: string;
}

// ─── Station ───────────────────────────────────────────────────────────

/** Railway station details */
export interface Station {
  code: string;
  name: string;
  city?: string;
  state?: string;
  zone?: string;
  latitude?: number;
  longitude?: number;
}
