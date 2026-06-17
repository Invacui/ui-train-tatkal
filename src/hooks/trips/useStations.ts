/**
 * @file useStations.ts
 * @description React Query query hook for searching train stations by name or code query string.
 * @module hooks/trips/useStations
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Trips service API calls
import { tripsService } from '@/services/trips.service';

/**
 * useStations
 * @description Searches for stations matching the given query string (station name or code). The query is enabled only when the query length is at least 2 characters to avoid premature API calls. Results are cached for 5 minutes since station data is stable.
 * @param {string} query - The search query (station name or code).
 * @returns A React Query result with an array of Station objects matching the search.
 */
export function useStations(query: string) {
  return useQuery({
    queryKey: queryKeys.trips.stations(query),
    queryFn: () => tripsService.searchStations(query),
    select: (res) => res.data.data,
    enabled: query.length >= 2,
    staleTime: 300_000, // Station data is stable
  });
}
