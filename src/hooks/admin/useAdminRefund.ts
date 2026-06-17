/**
 * @file useAdminRefund.ts
 * @description React Query mutation hook for an admin to process a refund on a booking, invalidating relevant caches.
 * @module hooks/admin/useAdminRefund
 */

// React Query mutation and cache hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Toast notifications
import { toast } from 'sonner';

// Admin service API calls
import { adminService } from '@/services/admin.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

/**
 * useAdminRefund
 * @description Processes a refund for a specific booking by ID from the admin panel. On success, invalidates the booking detail, bookings list, and dashboard caches to reflect the updated data, and shows a toast with the refund amount.
 * @returns A React Query mutation object for triggering the refund mutation.
 */
export function useAdminRefund() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.refundBooking(id),
    onSuccess: (res, id) => {
      void qc.invalidateQueries({ queryKey: queryKeys.admin.booking(id) });
      void qc.invalidateQueries({ queryKey: queryKeys.admin.bookings() });
      void qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
      toast.success(`Refund processed: ₹${res.data.data.refundAmount}`);
    },
  });
}
