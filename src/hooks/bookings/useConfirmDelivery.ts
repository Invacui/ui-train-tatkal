/**
 * @file useConfirmDelivery.ts
 * @description React Query mutation hook for confirming ticket delivery for a booking, invalidating the booking detail cache.
 * @module hooks/bookings/useConfirmDelivery
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Bookings service API calls
import { bookingsService } from '@/services/bookings.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

/**
 * useConfirmDelivery
 * @description Confirms that a ticket has been delivered to the customer for the specified booking ID. On success, invalidates the booking detail cache and shows a success toast. Used primarily by agents after ticket procurement.
 * @returns A React Query mutation object for triggering the confirm-delivery mutation.
 */
export function useConfirmDelivery() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsService.confirmDelivery(id),
    onSuccess: (_res, id) => {
      void qc.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      toast.success('Delivery confirmed! Enjoy your journey.');
    },
  });
}
