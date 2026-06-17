/**
 * @file Admin bookings list page
 * @module routes/admin/AdminBookings
 * @description Lists all platform bookings in a table with booking ID, train,
 *   route, date, status, and amount columns. Rows link to booking detail.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Navigation to booking detail page
import { useNavigate } from 'react-router-dom';

// Table components for booking listing
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Status badge for booking state display
import { StatusBadge } from '@/components/common/StatusBadge';

// Custom hook for fetching all platform bookings
import { useAdminBookings } from '@/hooks/admin/useAdminBookings';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Formatting utilities for date and currency
import { formatDate, formatCurrency } from '@/lib/utils';

// Route constants for navigation
import { ROUTES } from '@/constants/routes';

/**
 * AdminBookings (page component)
 * @description Fetches all bookings via useAdminBookings hook and renders them
 *   in a table. Clicking a row navigates to the admin booking detail page.
 */
export default function AdminBookings() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAdminBookings();

  if (error) return <ErrorState message="Failed to load bookings" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Bookings" description="All platform bookings" />

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Train</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-20" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.bookings?.length ? (
                data.bookings.map((booking) => (
                  <TableRow key={booking.bookingId} className="cursor-pointer" onClick={() => navigate(ROUTES.admin.bookingDetail(booking.bookingId))}>
                    <TableCell className="font-mono text-xs">{booking.bookingId.slice(0, 8)}…</TableCell>
                    <TableCell className="font-medium">{booking.trainName}</TableCell>
                    <TableCell>{booking.sourceStationCode}→{booking.destinationStationCode}</TableCell>
                    <TableCell>{formatDate(booking.journeyDate)}</TableCell>
                    <TableCell><StatusBadge status={booking.status} /></TableCell>
                    <TableCell>{booking.pricing ? formatCurrency(booking.pricing.totalAmount) : '—'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No bookings found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
