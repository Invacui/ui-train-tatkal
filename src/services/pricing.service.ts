/**
 * @file pricing.service.ts
 * @description Pricing configuration API service for fetching and updating pricing config.
 * @module services/pricing.service
 */

import { api } from '@/lib/axios';

import type { ApiResponse } from '@/types/api.types';
import type { PricingConfig, PricingConfigUpdateDto } from '@/types/pricing.types';

/**
 * pricingService
 * @description Provides methods for pricing configuration operations.
 */
export const pricingService = {
  /**
   * getConfig
   * @description Fetches the active pricing configuration from the backend.
   * @returns A promise resolving to the active PricingConfig.
   */
  getConfig: () =>
    api.get<ApiResponse<PricingConfig>>('/pricing/config'),

  /**
   * updateConfig
   * @description Updates the pricing configuration (admin only). Partial update supported.
   * @param {PricingConfigUpdateDto} dto - Partial pricing config fields to update.
   * @returns A promise resolving to the updated PricingConfig.
   */
  updateConfig: (dto: PricingConfigUpdateDto) =>
    api.put<ApiResponse<PricingConfig>>('/admin/pricing/config', dto),
};
