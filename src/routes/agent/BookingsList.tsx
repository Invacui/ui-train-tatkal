/**
 * @file Agent bookings list page
 * @module routes/agent/BookingsList
 * @description Displays all bookings assigned to the current agent with
 *   loading skeletons, error handling, and an empty state.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Custom hook for fetching agent's assigned bookings
import { useAgentBookings } from '@/hooks/agents/useAgentBookings';

// Card component for individual booking display
import { BookingCard } from '@/components/bookings/BookingCard';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

/**
 * AgentBookingsList (page component)
 * @description Fetches all bookings assigned to the agent via useAgentBookings
 *   hook and renders them as BookingCard components.
 */
export default function AgentBookingsList() {
  const { data, isLoading, error } = useAgentBookings();

  if (error) return <ErrorState message="Failed to load bookings" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="My Bookings" description="Bookings assigned to you" />

        {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}

        {data?.bookings?.length ? (
          <div className="space-y-3">
            {data.bookings.map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} agentView />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground">No bookings assigned</div>
        )}
      </div>
    </>
  );
}
