/**
 * @file Checkout page
 * @module routes/dashboard/Checkout
 * @description Booking checkout page showing train details, available classes
 *   with fares, and seat selection. Currently a demo page with full flow
 *   (passenger forms, payment) planned for a future update.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Route params to extract tripId
import { useParams } from 'react-router-dom';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Badge component for seat availability
import { Badge } from '@/components/ui/badge';

// UI button component
import { Button } from '@/components/ui/button';

// Custom hook for train detail fetch
import { useTrainDetail } from '@/hooks/trips/useTrainDetail';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Formatting utility for currency display
import { formatCurrency } from '@/lib/utils';

/**
 * Checkout (page component)
 * @description Renders the checkout page for a specific train trip identified
 *   by tripId route param. Shows train info, available classes with fares,
 *   and seat availability. Includes a demo notice for the full booking flow.
 */
export default function Checkout() {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: train, isLoading, error } = useTrainDetail(tripId || '');

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64 w-full rounded-lg" /></div>;
  if (error || !train) return <ErrorState message="Trip not found" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your booking</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{train.trainName} ({train.trainNumber})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Route:</span> {train.sourceStationCode} → {train.destinationStationCode}</div>
              <div><span className="text-muted-foreground">Duration:</span> {train.duration}</div>
              <div><span className="text-muted-foreground">Departure:</span> {train.departureTime}</div>
              <div><span className="text-muted-foreground">Arrival:</span> {train.arrivalTime}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {train.classes.map((cls) => (
              <div key={cls.code} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{cls.code} - {cls.name}</p>
                  <Badge variant={cls.availableSeats > 0 ? 'default' : 'outline'} className="mt-1">
                    {cls.availableSeats > 0 ? `${cls.availableSeats} seats` : 'Not available'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{formatCurrency(cls.fare)}</p>
                  <Button size="sm" disabled={cls.availableSeats === 0}>Select</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-sm text-yellow-800">
            This is a demo checkout page. Full booking flow (passenger forms, seat selection, payment) will be available in the next update.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
