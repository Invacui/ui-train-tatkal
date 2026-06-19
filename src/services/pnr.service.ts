/**
 * @file pnr.service.ts
 * @description PNR status API service for looking up booking status by PNR number.
 * @module services/pnr.service
 */

import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { CustomPNRStatusModel } from '@/types/pnr.types';

/**
 * pnrService
 * @description Provides methods for PNR-related API operations, including status lookup.
 */
export const pnrService = {

  /**
   * getStatus
   * @description Fetches the current status of a booking by its 10-digit PNR number.
   * Returns train details, journey info, chart status, and the passenger manifest
   * with per-passenger booking/current statuses.
   * @param {string} pnr - The 10-digit PNR record identifier.
   * @returns A promise resolving to an API response containing the PNR status model.
   */
  getStatus: (pnr: string) =>
    api.get<ApiResponse<CustomPNRStatusModel>>('/pnr/status', {
      params: { pnr },
    }),
};
