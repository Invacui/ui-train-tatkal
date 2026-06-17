/**
 * @file Bookings list page
 * @module routes/dashboard/BookingsList
 * @description Displays all bookings for the authenticated user with loading
 *   skeletons, error handling, and an empty state.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Ticket icon for empty state illustration
import { Ticket } from 'lucide-react';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Card component for individual booking display
import { BookingCard } from '@/components/bookings/BookingCard';

// Custom hook for fetching user bookings
import { useBookings } from '@/hooks/bookings/useBookings';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

/**
 * BookingsList (page component)
 * @description Fetches all bookings via useBookings hook and renders a list of
 *   BookingCard components. Handles loading, error, and empty states.
 */
export default function BookingsList() {
  const { data, isLoading, error } = useBookings();

  if (error) return <ErrorState message="Failed to load bookings" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="My Bookings" description="View and manage your train bookings" />

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        )}

        {data?.bookings?.length ? (
          <div className="space-y-3">
            {data.bookings.map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No bookings yet</p>
            <p className="text-sm text-muted-foreground">Search trains to book your first trip.</p>
          </div>
        )}
      </div>
    </>
  );
}
