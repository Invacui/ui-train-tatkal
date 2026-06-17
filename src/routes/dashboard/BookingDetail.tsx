/**
 * @file Booking detail page
 * @module routes/dashboard/BookingDetail
 * @description Shows full details of a specific booking including journey info,
 *   passenger list, pricing breakdown, and actions (cancel, confirm delivery).
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

// Badge component for booking status
import { Badge } from '@/components/ui/badge';

// Custom hook for single booking fetch
import { useBooking } from '@/hooks/bookings/useBooking';

// Custom hook for cancelling a booking
import { useCancelBooking } from '@/hooks/bookings/useCancelBooking';

// Custom hook for confirming ticket delivery
import { useConfirmDelivery } from '@/hooks/bookings/useConfirmDelivery';

// Pricing breakdown card component
import { BookingPricingCard } from '@/components/bookings/BookingPricingCard';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Confirmation dialog for destructive actions
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

// Formatting utilities
import { formatDate, formatDateTime, formatCurrency, getStatusLabel } from '@/lib/utils';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// React state for managing cancel confirmation dialog
import { useState } from 'react';

/**
 * BookingDetail (page component)
 * @description Fetches a booking by ID from route params. Displays journey
 *   details, passenger information, pricing breakdown, and action buttons
 *   (cancel booking, confirm delivery) based on booking status.
 */
export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);
  const { data: booking, isLoading, error } = useBooking(id || '');
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const { mutate: confirmDelivery, isPending: isConfirming } = useConfirmDelivery();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 w-full rounded-lg" /></div>;
  if (error || !booking) return <ErrorState message="Booking not found" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{booking.trainName}</h1>
            <p className="text-sm text-muted-foreground">Booking #{booking.bookingId}</p>
          </div>
          <Badge variant="outline" className="text-sm">{getStatusLabel(booking.status)}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Journey Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Route</p>
              <p className="font-medium">{booking.sourceStationCode} → {booking.destinationStationCode}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(booking.journeyDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium">{booking.departureTime} - {booking.arrivalTime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Class</p>
              <p className="font-medium">{booking.travelClass}</p>
            </div>
            {booking.pnrNumber && (
              <div>
                <p className="text-xs text-muted-foreground">PNR</p>
                <p className="font-mono font-medium">{booking.pnrNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {booking.passengers && booking.passengers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Passengers ({booking.passengers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {booking.passengers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.age} yrs, {p.gender}</p>
                    </div>
                    <div className="text-right text-sm">
                      {p.seatNumber && <p>Seat: {p.seatNumber}</p>}
                      {p.status && <p className="text-muted-foreground">{p.status}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {booking.pricing && <BookingPricingCard pricing={booking.pricing} />}

        <div className="flex items-center gap-3">
          {(booking.status === 'confirmed' || booking.status === 'delivered') && booking.status !== 'completed' && (
            <Button
              variant="outline"
              onClick={() => confirmDelivery(booking.bookingId)}
              disabled={isConfirming}
            >
              Confirm Delivery
            </Button>
          )}
          {['payment_pending', 'pending_agent', 'agent_assigned', 'at_counter', 'booking_in_progress'].includes(booking.status) && (
            <Button
              variant="destructive"
              onClick={() => setShowCancel(true)}
              disabled={isCancelling}
            >
              Cancel Booking
            </Button>
          )}
        </div>

        <ConfirmDialog
          open={showCancel}
          onOpenChange={setShowCancel}
          title="Cancel booking?"
          description="Cancellation charges may apply. Refund will be processed as per IRCTC rules."
          onConfirm={() => {
            cancelBooking(booking.bookingId);
            setShowCancel(false);
          }}
        />
      </div>
    </>
  );
}
