/**
 * @file usePnrStatus.ts
 * @description React Query query hook for looking up PNR status by a 10-digit PNR number.
 * @module hooks/pnr/usePnrStatus
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { pnrService } from '@/services/pnr.service';
import type { CustomPNRStatusModel } from '@/types/pnr.types';

/**
 * usePnrStatus
 * @description Fetches the current status of a booking by its 10-digit PNR number.
 * The query is disabled until `enabled` is true and the PNR is exactly 10 digits.
 * Results are cached for 30 seconds since PNR status can change (especially near chart preparation).
 * @param {string} pnr - The 10-digit PNR record identifier.
 * @param {boolean} [enabled=true] - Whether the query should execute. Also requires pnr.length === 10.
 * @returns A React Query result with the PNR status model, or null if not loaded.
 */
export function usePnrStatus(pnr: string, enabled = true) {
  return useQuery<CustomPNRStatusModel | null>({
    queryKey: queryKeys.pnr.status(pnr),
    queryFn: () => pnrService.getStatus(pnr),
    select: (res: any) => res.data?.data ?? null,
    enabled: enabled && pnr.length === 10,
    staleTime: 30_000, // 30 seconds — PNR status can change
    retry: false,       // Don't retry on invalid PNR
  });
}
