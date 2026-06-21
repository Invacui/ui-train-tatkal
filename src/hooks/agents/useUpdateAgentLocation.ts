/**
 * @file useUpdateAgentLocation.ts
 * @description Hook for agents to upsert their current geolocation.
 * @module hooks/agents
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { geolocationService } from '@/services/geolocation.service';

/**
 * useUpdateAgentLocation
 * @description Mutation to update the authenticated agent's current location.
 * @returns React Query mutation with mutate function accepting { lat, lon }.
 */
export function useUpdateAgentLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: { lat: number; lon: number }) => {
      const res = await geolocationService.updateAgentLocation(location);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', 'profile'] });
    },
  });
}
