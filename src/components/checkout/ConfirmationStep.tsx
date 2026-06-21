/**
 * @file ConfirmationStep.tsx
 * @description Step 7 (final): Shows booking success details — PNR, train info, passengers,
 *   total paid — with links to view booking or start a new one.
 * @module components/checkout
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Train, Users, IndianRupee, Eye, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

import type { Booking } from '@/types/bookings.types';

interface ConfirmationStepProps {
  booking: Booking;
  onViewBooking: () => void;
  onNewBooking: () => void;
}

/**
 * ConfirmationStep
 * @description Final step showing a success message and booking summary after
 *   payment is verified and the booking is created.
 */
export function ConfirmationStep({ booking, onViewBooking, onNewBooking }: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-green-700">Booking Confirmed!</h2>
          <p className="text-sm text-green-600 mt-1">
            Your booking has been placed successfully.
          </p>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Train Info */}
          <div className="flex items-center gap-3">
            <Train className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {booking.trainName} ({booking.trainNumber})
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.sourceStationCode} → {booking.destinationStationCode}
              </p>
            </div>
            <Badge className="ml-auto">{booking.travelClass}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Journey Date</span>
              <p className="font-medium">{booking.journeyDate}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Timing</span>
              <p className="font-medium">
                {booking.departureTime} — {booking.arrivalTime}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Booking ID</span>
              <p className="font-mono font-medium">{booking.bookingId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">PNR</span>
              <p className="font-mono font-medium">
                {booking.pnrNumber || 'Awaiting PNR'}
              </p>
            </div>
          </div>

          {/* Passengers */}
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Passengers ({booking.passengers.length})</span>
            </div>
            <div className="space-y-1">
              {booking.passengers.map((p, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {p.name} · Age {p.age} · {p.gender}
                </p>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span className="font-semibold">Total Paid</span>
            </div>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(booking.pricing?.totalAmount || 0)}
            </span>
          </div>

          {/* Status */}
          <Badge variant="outline" className="text-xs">
            Status: {booking.status?.replace(/_/g, ' ')}
          </Badge>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onViewBooking}>
          <Eye className="h-4 w-4 mr-2" />
          View Booking
        </Button>
        <Button onClick={onNewBooking}>
          <Plus className="h-4 w-4 mr-2" />
          Book Another
        </Button>
      </div>
    </div>
  );
}
