/**
 * @file useUpdateBooking.ts
 * @description React Query mutation hook for partially updating an existing booking
 *   (e.g. assigning an agent, updating delivery address, adding flexibility flags).
 * @module hooks/bookings/useUpdateBooking
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Bookings service API calls
import { bookingsService } from '@/services/bookings.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Types
import type { UpdateBookingDto, Booking } from '@/types/bookings.types';
import type { ApiResponse } from '@/types/api.types';

/**
 * useUpdateBooking
 * @description Mutation to partially update an existing booking. On success,
 *   invalidates the booking detail cache so the UI reflects the changes.
 * @returns A React Query mutation that accepts (bookingId, UpdateBookingDto).
 */
export function useUpdateBooking() {
  const qc = useQueryClient();

  return useMutation<ApiResponse<Booking>, Error, { bookingId: string; dto: UpdateBookingDto }>({
    mutationFn: ({ bookingId, dto }) => bookingsService.updateBooking(bookingId, dto),
    onSuccess: (_res, { bookingId }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.bookings.detail(bookingId) });
    },
  });
}
