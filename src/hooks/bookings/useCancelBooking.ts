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

// Cancel booking DTO type
import type { CancelBookingDto } from '@/types/bookings.types';

interface CancelVariables {
  bookingId: string;
  dto: CancelBookingDto;
}

/**
 * useCancelBooking
 * @description Cancels a booking by its ID with a reason. On success, invalidates caches
 *   and shows a toast with the refund amount (if any). On failure, shows an error toast.
 * @returns A React Query mutation object for triggering the cancel-booking mutation.
 */
export function useCancelBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, dto }: CancelVariables) =>
      bookingsService.cancelBooking(bookingId, dto),
    onSuccess: (res, { bookingId }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.bookings.detail(bookingId) });
      void qc.invalidateQueries({ queryKey: queryKeys.bookings.list() });
      const msg =
        res.data.data.status === 'cancelled_with_refund'
          ? `Booking cancelled. Refund: ₹${res.data.data.refundAmount}`
          : 'Booking cancelled.';
      toast.success(msg);
    },
    onError: () => toast.error('Failed to cancel booking'),
  });
}
