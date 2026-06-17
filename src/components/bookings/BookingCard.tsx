/**
 * @file Booking Card component
 * @module components/bookings/BookingCard
 * @description Displays a booking summary in a card: train name/number,
 *   PNR, route, journey date, status badge, pricing, and a "View Details"
 *   button linking to the booking detail page.
 */

// Router navigation hook
import { useNavigate } from 'react-router-dom';

// Shadcn card components
import { Card, CardContent } from '@/components/ui/card';

// Shadcn button component
import { Button } from '@/components/ui/button';

// Common status badge component
import { StatusBadge } from '@/components/common/StatusBadge';

// Application route constants
import { ROUTES } from '@/constants/routes';

// Utility functions for formatting
import { formatDate, formatCurrency } from '@/lib/utils';

// Booking type import
import type { Booking } from '@/types/bookings.types';

interface BookingCardProps {
  /** The booking data to display */
  booking: Booking;
}

/**
 * BookingCard
 * @description Renders a card with booking details: train name/number, PNR,
 *   source-destination, journey date, departure-arrival times, status badge,
 *   total amount, and a "View Details" button.
 * @param props BookingCardProps
 * @returns A booking summary card
 */
export function BookingCard({ booking }: BookingCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{booking.trainName}</h3>
              <span className="text-xs text-muted-foreground">({booking.trainNumber})</span>
            </div>
            {booking.pnrNumber && (
              <p className="text-sm text-muted-foreground">
                PNR: <span className="font-mono font-medium">{booking.pnrNumber}</span>
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{booking.sourceStationCode} → {booking.destinationStationCode}</span>
              <span>{formatDate(booking.journeyDate)}</span>
              <span>{booking.departureTime} - {booking.arrivalTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={booking.status} />
              {booking.pricing && (
                <span className="text-sm font-medium">{formatCurrency(booking.pricing.totalAmount)}</span>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.bookingDetail(booking.bookingId))}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
