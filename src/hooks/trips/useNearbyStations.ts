/**
 * @file useNearbyStations.ts
 * @description React Query query hook for fetching train stations near the user's current location coordinates.
 * @module hooks/trips/useNearbyStations
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Trips service API calls
import { tripsService } from '@/services/trips.service';

/**
 * useNearbyStations
 * @description Fetches train stations near the provided latitude and longitude coordinates. The query is enabled only when both lat and lng are provided. Results are cached for 5 minutes since station locations are stable.
 * @param {number} [lat] - The latitude coordinate.
 * @param {number} [lng] - The longitude coordinate.
 * @returns A React Query result with an array of nearby Station objects.
 */
export function useNearbyStations(lat?: number, lng?: number) {
  return useQuery({
    queryKey: queryKeys.trips.nearby(),
    queryFn: () => tripsService.getNearbyStations(lat, lng),
    select: (res) => res.data.data,
    enabled: !!lat && !!lng,
    staleTime: 300_000,
  });
}
