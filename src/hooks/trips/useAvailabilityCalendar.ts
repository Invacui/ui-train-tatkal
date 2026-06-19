/**
 * @file useAvailabilityCalendar.ts
 * @description React Query query hook for fetching the train availability calendar for a route over a date range.
 * @module hooks/trips/useAvailabilityCalendar
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { tripsService } from '@/services/trips.service';
import type { CustomAvailabilityCalendar } from '@/types/calendar.types';

/**
 * useAvailabilityCalendar
 * @description Fetches daily availability states for a route over a date range.
 * Used to power the date-picker / availability heatmap on search results.
 * The query is disabled until source, destination, and startDate are provided.
 * @param {string} source - Origin station code (e.g. "NDLS").
 * @param {string} destination - Destination station code (e.g. "MMCT").
 * @param {string} startDate - Start date in DD-MM-YYYY format (required by API).
 * @param {number} [days=16] - Number of days to include (max 30).
 * @returns A React Query result with the availability calendar data, or null if not loaded.
 */
export function useAvailabilityCalendar(
  source: string,
  destination: string,
  startDate: string,
  days = 16,
) {
  return useQuery<CustomAvailabilityCalendar | null>({
    queryKey: queryKeys.trips.calendar({ source, destination, startDate, days }),
    queryFn: () => tripsService.getAvailabilityCalendar(source, destination, startDate, days),
    select: (res: any) => res.data?.data ?? null,
    enabled: !!(source && destination && startDate),
    staleTime: 60_000, // 1 minute — calendar data changes more frequently
  });
}
