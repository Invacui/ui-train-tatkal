/**
 * @file Trip / train detail page
 * @module routes/dashboard/TripDetail
 * @description Shows detailed information for a specific train including route,
 *   timing, duration, and available classes with fares and seat availability.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Route params to extract trainNumber, navigation for back button
import { useParams, useNavigate } from 'react-router-dom';

// ArrowLeft, Clock, and Train icons
import { ArrowLeft, Clock, Train } from 'lucide-react';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for layout
import { Card, CardContent } from '@/components/ui/card';

// Badge component for Tatkal status
import { Badge } from '@/components/ui/badge';

// Custom hook for train detail fetch
import { useTrainDetail } from '@/hooks/trips/useTrainDetail';

// Route constants for navigation
import { ROUTES } from '@/constants/routes';

// Formatting utilities
import { formatDuration, formatCurrency } from '@/lib/utils';

// Page header component
import { PageHeader } from '@/components/common/PageHeader';

// Error state component
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

/**
 * TripDetail (page component)
 * @description Fetches and displays detailed info for a train identified by
 *   trainNumber route param. Shows train name/number, route timing, duration,
 *   and a grid of available classes with fares and seat counts.
 */
export default function TripDetail() {
  const { trainNumber } = useParams<{ trainNumber: string }>();
  const navigate = useNavigate();
  const { data: train, isLoading, error } = useTrainDetail(trainNumber || '');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !train) {
    return <ErrorState message="Train not found" onRetry={() => navigate(ROUTES.searchTrips)} />;
  }

  // Resolve train identifier — prefer new API field, fall back to legacy
  const id = train.train_identifier_id || train.trainNumber;

  // Use either new class_availability or legacy classes
  const classList = train.class_availability?.length
    ? train.class_availability.map((c) => ({
        code: c.travel_class_code,
        name: c.quota_code === 'TQ' ? `${c.travel_class_code} Tatkal` : c.travel_class_code,
        fare: c.fare_amount,
        availableSeats: c.is_bookable ? 1 : 0,
      }))
    : (train.classes || []);

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Train className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{train.train_display_name || train.trainName}</h1>
                <p className="text-sm text-muted-foreground">Train #{id}</p>
              </div>
              {train.hasTatkal && <Badge className="ml-auto">Tatkal Available</Badge>}
            </div>

            <div className="mt-6 flex items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-bold">{train.departure_time_24h || train.departureTime}</p>
                <p className="text-sm text-muted-foreground">{train.origin_station_code || train.sourceStationCode}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {train.travel_duration_minutes
                    ? formatDuration(String(train.travel_duration_minutes))
                    : formatDuration(train.duration)}
                </span>
                <div className="h-px w-24 bg-border" />
              </div>
              <div>
                <p className="text-2xl font-bold">{train.arrival_time_24h || train.arrivalTime}</p>
                <p className="text-sm text-muted-foreground">{train.destination_station_code || train.destinationStationCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-lg font-semibold">Available Classes</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classList.map((cls) => (
            <Card
              key={cls.code}
              className={`transition-colors ${cls.availableSeats > 0 ? 'hover:border-primary/50 cursor-pointer' : 'opacity-50'}`}
              onClick={() => {
                if (cls.availableSeats > 0 && id) {
                  navigate(ROUTES.booking(id), {
                    state: { trainData: train, selectedClassCode: cls.code },
                  });
                }
              }}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{cls.code}</p>
                  <p className="text-sm text-muted-foreground">{cls.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(cls.fare)}</p>
                  <Badge variant={cls.availableSeats > 0 ? 'default' : 'outline'} className="text-xs">
                    {cls.availableSeats > 0 ? `${cls.availableSeats} seats` : 'Not available'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
