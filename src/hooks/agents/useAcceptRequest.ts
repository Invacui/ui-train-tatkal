/**
 * @file useAcceptRequest.ts
 * @description React Query mutation hook for an agent to accept a booking request, invalidating the requests and bookings caches.
 * @module hooks/agents/useAcceptRequest
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
 * useAcceptRequest
 * @description Accepts a pending booking request assigned to the agent. On success, invalidates the agent's requests and bookings list caches to reflect the updated state, and shows a success toast.
 * @returns A React Query mutation object for triggering the accept-request mutation.
 */
export function useAcceptRequest() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => agentsService.acceptRequest(bookingId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.agents.requests() });
      void qc.invalidateQueries({ queryKey: queryKeys.agents.bookings() });
      toast.success('Booking request accepted');
    },
  });
}
