/**
 * @file Trip Card component
 * @module components/trips/TripCard
 * @description Displays a train trip summary in a card: train name/number,
 *   departure/arrival times, duration, available classes with fares,
 *   and a "Book Now" button that navigates to the train detail page.
 */

// Router navigation hook
import { useNavigate } from 'react-router-dom';

// Icons for trip display
import { Clock, Train, ArrowRight } from 'lucide-react';

// Shadcn card components
import { Card, CardContent } from '@/components/ui/card';

// Shadcn button and badge
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Application route constants
import { ROUTES } from '@/constants/routes';

// Utility functions for formatting
import { formatDuration, formatCurrency } from '@/lib/utils';

// Train type import
import type { Train as TrainType } from '@/types/trips.types';

interface TripCardProps {
  /** Train data to display */
  train: TrainType;
  /** The date used for the search (passed to booking flow) */
  searchDate: string;
}

/**
 * TripCard
 * @description Renders a card summarizing a train trip: train name, number,
 *   departure/arrival times, duration, Tatkal availability, class badges
 *   with fares, and a "Book Now" button linking to the train detail page.
 * @param props TripCardProps
 * @returns A clickable trip summary card
 */
export function TripCard({ train, searchDate }: TripCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Train info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">{train.trainName}</h3>
                <p className="text-xs text-muted-foreground">{train.trainNumber}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold">{train.departureTime}</p>
                <p className="text-xs text-muted-foreground">{train.sourceStationCode}</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{formatDuration(train.duration)}</span>
                <div className="h-px w-12 bg-border" />
              </div>
              <div className="text-center">
                <p className="font-semibold">{train.arrivalTime}</p>
                <p className="text-xs text-muted-foreground">{train.destinationStationCode}</p>
              </div>
            </div>

            {train.hasTatkal && (
              <Badge variant="secondary" className="mt-2 text-xs">
                Tatkal Available
              </Badge>
            )}
          </div>

          {/* Classes & Fare */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {train.classes.slice(0, 4).map((cls) => (
                <Badge
                  key={cls.code}
                  variant={cls.availableSeats > 0 ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {cls.code} {cls.availableSeats > 0 ? `₹${cls.fare}` : 'NA'}
                </Badge>
              ))}
              {train.classes.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{train.classes.length - 4} more
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => navigate(ROUTES.trainDetail(train.trainNumber))}
              className="gap-1"
            >
              Book Now
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
