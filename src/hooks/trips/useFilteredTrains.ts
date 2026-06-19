/**
 * @file useFilteredTrains.ts
 * @description React hook that applies client-side filters to a list of trains.
 *   Supports text search, Tatkal-only, AC-only, departure time range, rating, and category.
 * @module hooks/trips/useFilteredTrains
 */

import { useMemo } from 'react';
import type { Train } from '@/types/trips.types';
import type { SearchFilters } from '@/types/filters.types';

/**
 * useFilteredTrains
 * @description Applies client-side filters to a list of trains using useMemo.
 * Returns the filtered list and a count of how many filters are active.
 * @param trains - The full list of trains to filter.
 * @param filters - The active search filters.
 * @returns An object with filteredTrains array and appliedFilterCount.
 */
export function useFilteredTrains(trains: Train[] | undefined, filters: SearchFilters) {
  return useMemo(() => {
    if (!trains) return { filteredTrains: [] as Train[], appliedFilterCount: 0 };

    // Count active filters
    let count = 0;
    if (filters.query) count++;
    if (filters.tatkalOnly) count++;
    if (filters.acClassesOnly) count++;
    if (filters.departureTimeRange) count++;
    if (filters.minRating) count++;
    if (filters.categories?.length) count++;

    let filtered = [...trains];

    // 1. Text search (name or number, case-insensitive)
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.train_display_name?.toLowerCase().includes(q) ||
          t.train_identifier_id?.toLowerCase().includes(q) ||
          t.trainNumber?.toLowerCase().includes(q) ||
          t.trainName?.toLowerCase().includes(q),
      );
    }

    // 2. Tatkal only — has at least one bookable Tatkal quota class
    if (filters.tatkalOnly) {
      filtered = filtered.filter((t) =>
        t.class_availability?.some(
          (ca) => ca.quota_code === 'TQ' && ca.is_bookable,
        ),
      );
    }

    // 3. AC classes only — has at least one AC class
    if (filters.acClassesOnly) {
      const acClasses = ['1A', '2A', '3A', 'EC', 'EA'];
      filtered = filtered.filter((t) =>
        t.class_availability?.some((ca) => acClasses.includes(ca.travel_class_code)),
      );
    }

    // 4. Departure time range
    if (filters.departureTimeRange) {
      const { from, to } = filters.departureTimeRange;
      filtered = filtered.filter((t) => {
        const dep = t.departure_time_24h || t.departureTime;
        if (!dep) return true;
        // Handle overnight ranges (e.g. 18:00 - 00:00 or 00:00 - 06:00)
        if (from < to) {
          return dep >= from && dep < to;
        } else {
          // Overnight range
          return dep >= from || dep < to;
        }
      });
    }

    // 5. Minimum rating
    if (filters.minRating) {
      filtered = filtered.filter(
        (t) => t.train_rating != null && t.train_rating >= filters.minRating!,
      );
    }

    // 6. Train categories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((t) =>
        filters.categories!.includes(t.train_category),
      );
    }

    return { filteredTrains: filtered, appliedFilterCount: count };
  }, [trains, filters]);
}
