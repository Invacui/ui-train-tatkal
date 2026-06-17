/**
 * @file Dashboard overview page
 * @module routes/dashboard/Overview
 * @description Main landing page after login. Shows a welcome message, quick
 *   stats (upcoming trips, past bookings, active bookings), and recent bookings.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Link for navigation to search and bookings pages
import { Link } from 'react-router-dom';

// Search and Ticket icons for action buttons
import { Search, Ticket } from 'lucide-react';

// UI button component
import { Button } from '@/components/ui/button';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Card components for stats display
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Redux hooks for accessing auth state
import { useAppSelector } from '@/store/hooks';

// Selector to access current user info
import { selectUser } from '@/store/auth.slice';

// Custom hook for fetching user bookings
import { useBookings } from '@/hooks/bookings/useBookings';

// Card component for individual booking display
import { BookingCard } from '@/components/bookings/BookingCard';

// Route constants for navigation links
import { ROUTES } from '@/constants/routes';

/**
 * Overview (page component)
 * @description Renders the dashboard home page displaying a welcome greeting,
 *   quick stats cards (upcoming/past/active bookings), and a list of recent
 *   bookings with a link to view all.
 */
export default function Overview() {
  const user = useAppSelector(selectUser);
  const { data } = useBookings({ page: 1, limit: 5 });

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-6">
        <PageHeader
          title={`Welcome back, ${user?.name ?? 'there'}!`}
          description="Search trains, manage bookings, and track your journeys."
        >
          <Button asChild>
            <Link to={ROUTES.searchTrips} className="gap-2">
              <Search className="h-4 w-4" />
              Search Trains
            </Link>
          </Button>
        </PageHeader>

        {/* Quick stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data?.bookings?.filter(b => ['confirmed', 'pending_agent', 'pnr_submitted'].includes(b.status)).length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Past Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data?.bookings?.filter(b => ['completed', 'delivered'].includes(b.status)).length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data?.pagination?.totalItems ?? 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent bookings */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to={ROUTES.bookings} className="gap-2">
                <Ticket className="h-4 w-4" />
                View all
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {data?.bookings?.length ? (
              data.bookings.map((booking) => (
                <BookingCard key={booking.bookingId} booking={booking} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                  <Ticket className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No bookings yet</p>
                  <Button size="sm" asChild>
                    <Link to={ROUTES.searchTrips}>Book your first trip</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
