/**
 * @file useSubmitPNR.ts
 * @description React Query mutation hook for an agent to submit a PNR number for a booking, invalidating relevant caches.
 * @module hooks/agents/useSubmitPNR
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

/**
 * useSubmitPNR
 * @description Submits the PNR (Passenger Name Record) number for a specific booking after ticket confirmation. On success, invalidates the booking detail and bookings list caches, and shows a success toast. On failure, shows an error toast.
 * @returns A React Query mutation object for triggering the PNR submission mutation.
 */
export function useSubmitPNR() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, pnr }: { bookingId: string; pnr: string }) =>
      agentsService.submitPNR(bookingId, pnr),
    onSuccess: (_res, { bookingId }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.agents.booking(bookingId) });
      void qc.invalidateQueries({ queryKey: queryKeys.agents.bookings() });
      toast.success('PNR submitted successfully');
    },
    onError: () => toast.error('Failed to submit PNR'),
  });
}
