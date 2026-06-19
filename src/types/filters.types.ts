/**
 * @file Filter types
 * @description Types for train search filters, sorting, and pagination
 * @module types
 */

/** Departure time range filter */
export interface DepartureTimeRange {
  from: string;  // HH:mm
  to: string;    // HH:mm
}

/** Named time range presets */
export type TimeRangePreset = 'morning' | 'afternoon' | 'evening' | 'night';

/** Client-side search filters applied to train results */
export interface SearchFilters {
  query?: string;                    // Train name/number text filter
  tatkalOnly?: boolean;              // Only show trains with Tatkal availability
  acClassesOnly?: boolean;           // Only AC classes (1A, 2A, 3A)
  berthType?: string;                // LOWER, UPPER, etc.
  departureTimeRange?: DepartureTimeRange;
  minRating?: number;                // Minimum train_rating
  categories?: string[];             // MAIL_EXPRESS, SUPERFAST, SHATABDI, etc.
}

/** Sort options for train results */
export type SortOption = 'departure' | 'duration' | 'fare' | 'rating' | 'name';

/** Pagination state */
export interface PaginationState {
  page: number;
  pageSize: number;
}

/** Map of page size numbers to display labels */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

/** Time range preset definitions */
export const TIME_RANGE_PRESETS: Record<TimeRangePreset, DepartureTimeRange> = {
  morning: { from: '06:00', to: '12:00' },
  afternoon: { from: '12:00', to: '18:00' },
  evening: { from: '18:00', to: '00:00' },
  night: { from: '00:00', to: '06:00' },
} as const;
