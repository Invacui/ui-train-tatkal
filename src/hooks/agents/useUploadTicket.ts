/**
 * @file useUploadTicket.ts
 * @description React Query mutation hook for an agent to upload a ticket photo/URL for a booking, invalidating the booking detail cache.
 * @module hooks/agents/useUploadTicket
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
 * useUploadTicket
 * @description Uploads the ticket photo/image URL for a booking after the agent has procured the ticket. On success, invalidates the booking detail cache and shows a success toast.
 * @returns A React Query mutation object for triggering the ticket upload mutation.
 */
export function useUploadTicket() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, ticketPhotoUrl }: { bookingId: string; ticketPhotoUrl: string }) =>
      agentsService.uploadTicket(bookingId, ticketPhotoUrl),
    onSuccess: (_res, { bookingId }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.agents.booking(bookingId) });
      toast.success('Ticket uploaded');
    },
  });
}
