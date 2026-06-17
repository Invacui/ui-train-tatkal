/**
 * @file useTrainDetail.ts
 * @description React Query query hook for fetching detailed information about a specific train by its train number.
 * @module hooks/trips/useTrainDetail
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Trips service API calls
import { tripsService } from '@/services/trips.service';

/**
 * useTrainDetail
 * @description Fetches detailed information (schedule, route, availability) for a specific train identified by its train number. The query is disabled when no train number is provided. Results are cached for 2 minutes.
 * @param {string} trainNumber - The unique train number identifier.
 * @returns A React Query result containing the Train detail object.
 */
export function useTrainDetail(trainNumber: string) {
  return useQuery({
    queryKey: queryKeys.trips.detail(trainNumber),
    queryFn: () => tripsService.getTrainDetail(trainNumber),
    select: (res) => res.data.data,
    enabled: !!trainNumber,
    staleTime: 120_000,
  });
}
