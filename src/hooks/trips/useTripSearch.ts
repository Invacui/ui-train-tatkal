/**
 * @file useTripSearch.ts
 * @description React Query query hook for searching trains based on source, destination, date, and optional filters.
 * @module hooks/trips/useTripSearch
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Trips service API calls
import { tripsService } from '@/services/trips.service';

// Trip search parameters type
import type { TripSearchParams } from '@/types/trips.types';

/**
 * useTripSearch
 * @description Searches for available trains using the provided search parameters (source, destination, date, class, quota, etc.). The query is disabled until required fields (source, destination, date) are provided and the `enabled` flag is true. Results are cached for 2 minutes since train data changes infrequently.
 * @param {TripSearchParams} params - The search parameters including source, destination, date, and optional filters.
 * @param {boolean} [enabled=true] - Whether the query should execute. Defaults to true but also requires source, destination, and date to be truthy.
 * @returns A React Query result with an array of Train objects matching the search criteria.
 */
export function useTripSearch(params: TripSearchParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.trips.search(params),
    queryFn: () => tripsService.searchTrains(params),
    select: (res) => res.data.data,
    enabled: enabled && !!params.source && !!params.destination && !!params.date,
    staleTime: 120_000, // Train data changes infrequently
  });
}
