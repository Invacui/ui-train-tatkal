/**
 * @file useUploadTicketFile.ts
 * @description React Query mutation hook for direct multipart ticket file upload,
 *   transitioning booking status from at_counter to booking_in_progress.
 * @module hooks/agents/useUploadTicketFile
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
 * useUploadTicketFile
 * @description Uploads a ticket photo file via multipart POST, which transitions
 *   the booking status from at_counter to booking_in_progress in one call.
 *   On success, invalidates the booking detail and bookings list caches,
 *   and shows a success toast.
 * @returns A React Query mutation object for triggering the ticket file upload mutation.
 */
export function useUploadTicketFile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, file }: { bookingId: string; file: File }) =>
      agentsService.uploadTicketFile(bookingId, file),
    onSuccess: (_res, { bookingId }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.agents.booking(bookingId) });
      void qc.invalidateQueries({ queryKey: queryKeys.agents.bookings() });
      toast.success('Ticket uploaded successfully');
    },
    onError: () => toast.error('Failed to upload ticket'),
  });
}
