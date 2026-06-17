/**
 * @file Admin booking detail page
 * @module routes/admin/AdminBookingDetail
 * @description Shows full details of a specific booking for admin review,
 *   including journey info, pricing breakdown, and a process-refund action.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Route params to extract booking ID, navigation for back button
import { useParams, useNavigate } from 'react-router-dom';

// ArrowLeft icon for back button
import { ArrowLeft } from 'lucide-react';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Custom hook for fetching a single booking (admin view)
import { useAdminBooking } from '@/hooks/admin/useAdminBooking';

// Custom hook for processing a refund
import { useAdminRefund } from '@/hooks/admin/useAdminRefund';

// Status badge for booking state display
import { StatusBadge } from '@/components/common/StatusBadge';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Formatting utilities for date and currency
import { formatDate, formatCurrency } from '@/lib/utils';

// Confirmation dialog for refund action
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

// React state for managing refund confirmation dialog
import { useState } from 'react';

/**
 * AdminBookingDetail (page component)
 * @description Fetches a booking by ID and displays journey details and pricing.
 *   Provides a "Process Refund" button with confirmation dialog for admin use.
 */
export default function AdminBookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRefund, setShowRefund] = useState(false);
  const { data: booking, isLoading, error } = useAdminBooking(id || '');
  const { mutate: refund } = useAdminRefund();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 w-full rounded-lg" /></div>;
  if (error || !booking) return <ErrorState message="Booking not found" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <PageHeader title={`Booking #${booking.bookingId}`} description="Admin booking management">
          <StatusBadge status={booking.status} />
        </PageHeader>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Journey Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Train:</span> {booking.trainName} ({booking.trainNumber})</p>
              <p><span className="text-muted-foreground">Route:</span> {booking.sourceStationCode} → {booking.destinationStationCode}</p>
              <p><span className="text-muted-foreground">Date:</span> {formatDate(booking.journeyDate)}</p>
              <p><span className="text-muted-foreground">Time:</span> {booking.departureTime} - {booking.arrivalTime}</p>
              {booking.pnrNumber && <p><span className="text-muted-foreground">PNR:</span> <span className="font-mono">{booking.pnrNumber}</span></p>}
            </CardContent>
          </Card>

          {booking.pricing && (
            <Card>
              <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="flex justify-between"><span>Base Fare</span><span>{formatCurrency(booking.pricing.baseFare)}</span></p>
                <p className="flex justify-between"><span>Total</span><span className="font-semibold">{formatCurrency(booking.pricing.totalAmount)}</span></p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Button variant="destructive" onClick={() => setShowRefund(true)} disabled={booking.status === 'refunded'}>
            Process Refund
          </Button>
        </div>

        <ConfirmDialog
          open={showRefund}
          onOpenChange={setShowRefund}
          title="Process refund?"
          description="This will issue a refund for this booking."
          onConfirm={() => { refund(booking.bookingId); setShowRefund(false); }}
        />
      </div>
    </>
  );
}
