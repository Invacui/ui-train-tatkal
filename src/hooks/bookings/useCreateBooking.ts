/**
 * @file useCreateBooking.ts
 * @description React Query mutation hook for creating a new train ticket booking, invalidating the bookings list cache and navigating to the booking detail page on success.
 * @module hooks/bookings/useCreateBooking
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// React Router navigation hook
import { useNavigate } from 'react-router-dom';

// Toast notifications
import { toast } from 'sonner';

// Bookings service API calls
import { bookingsService } from '@/services/bookings.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Route constants
import { ROUTES } from '@/constants/routes';

// Create booking DTO type
import type { CreateBookingDto } from '@/types/bookings.types';

/**
 * useCreateBooking
 * @description Creates a new booking with the provided booking data. On success, invalidates the bookings list cache, shows a success toast, and navigates to the new booking's detail page. On failure, shows an error toast with the server message.
 * @returns A React Query mutation object for triggering the create-booking mutation.
 */
export function useCreateBooking() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: CreateBookingDto) => bookingsService.createBooking(dto),
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: queryKeys.bookings.list() });
      toast.success('Booking created successfully!');
      navigate(ROUTES.bookingDetail(res.data.data.bookingId));
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Booking failed');
    },
  });
}
