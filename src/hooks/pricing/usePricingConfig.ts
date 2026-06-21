/**
 * @file usePricingConfig.ts
 * @description Hooks for fetching and updating the pricing configuration.
 * @module hooks/pricing
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { pricingService } from '@/services/pricing.service';
import { queryKeys } from '@/lib/queryKeys';

import type { PricingConfig, PricingConfigUpdateDto } from '@/types/pricing.types';

/**
 * usePricingConfig
 * @description Fetches the active pricing configuration from the backend.
 * @returns React Query result containing PricingConfig data.
 */
export function usePricingConfig() {
  return useQuery<PricingConfig>({
    queryKey: queryKeys.pricing.config(),
    queryFn: async () => {
      const res = await pricingService.getConfig();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min — config changes infrequently
  });
}

/**
 * useUpdatePricingConfig
 * @description Mutation to update pricing configuration (admin only).
 *   Invalidates the pricing config cache on success.
 */
export function useUpdatePricingConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: PricingConfigUpdateDto) => {
      const res = await pricingService.updateConfig(dto);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.config() });
    },
  });
}
