/**
 * @file useCalculatePrice.ts
 * @description Hook for fetching server-side price breakdown for booking.
 * @module hooks/bookings
 */

import { useMutation } from '@tanstack/react-query';

import { bookingsService } from '@/services/bookings.service';

import type { CalculatePriceDto, PriceBreakdown } from '@/types/bookings.types';

/**
 * useCalculatePrice
 * @description Mutation that sends booking parameters to the server and returns
 *   a full PriceBreakdown computed from the active PricingConfig.
 * @returns React Query mutation with PriceBreakdown as data.
 */
export function useCalculatePrice() {
  return useMutation<PriceBreakdown, Error, CalculatePriceDto>({
    mutationFn: async (dto: CalculatePriceDto) => {
      const res = await bookingsService.calculatePrice(dto);
      return res.data.data;
    },
  });
}
