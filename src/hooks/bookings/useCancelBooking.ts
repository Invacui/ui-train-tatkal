/**
 * @file useCancelBooking.ts
 * @description React Query mutation hook for cancelling a booking, invalidating the relevant caches, and displaying the refund amount.
 * @module hooks/bookings/useCancelBooking
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
 * useCancelBooking
 * @description Cancels a booking by its ID. On success, invalidates the booking detail and bookings list caches so the UI reflects the updated status, and shows a toast with the refund amount. On failure, shows an error toast.
 * @returns A React Query mutation object for triggering the cancel-booking mutation.
 */
export function useCancelBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsService.cancelBooking(id),
    onSuccess: (res, id) => {
      void qc.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      void qc.invalidateQueries({ queryKey: queryKeys.bookings.list() });
      toast.success(`Booking cancelled. Refund: ₹${res.data.data.refundAmount}`);
    },
    onError: () => toast.error('Failed to cancel booking'),
  });
}
