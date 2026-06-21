/**
 * @file PreferencesStep.tsx
 * @description Step 1: Allows the user to set flexibility toggles (date, train, station)
 *   before proceeding with the booking.
 * @module components/checkout
 */

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

import type { Train, CustomClassAvailability } from '@/types/trips.types';
import type { BookingFlexibility } from '@/store/booking-draft.slice';

const TRAVEL_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
  { value: 'evening', label: 'Evening (6 PM - 12 AM)' },
  { value: 'night', label: 'Night (12 AM - 6 AM)' },
];

interface PreferencesStepProps {
  train: Train;
  selectedClass: CustomClassAvailability;
  flexibility: BookingFlexibility;
  onFlexibilityChange: (flex: BookingFlexibility) => void;
  onBack: () => void;
  onNext: () => void;
}

/**
 * PreferencesStep
 * @description Shows the selected train summary, travel time preference,
 *   and flexibility toggles (date, train, station, travel time).
 */
export function PreferencesStep({
  train,
  selectedClass,
  flexibility,
  onFlexibilityChange,
  onBack,
  onNext,
}: PreferencesStepProps) {
  const toggle = (key: keyof BookingFlexibility) =>
    onFlexibilityChange({ ...flexibility, [key]: !flexibility[key] });

  const setTravelTime = (value: string) =>
    onFlexibilityChange({ ...flexibility, travelTime: value });

  return (
    <div className="space-y-6">
      {/* Train Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selected Train</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="font-semibold text-base">
                {train.train_display_name || train.trainName}
              </p>
              <p className="text-sm text-muted-foreground">
                {train.train_identifier_id || train.trainNumber}
              </p>
            </div>
            <Badge variant="secondary">{selectedClass.travel_class_code}</Badge>
            <span className="text-sm text-muted-foreground">
              {train.origin_station_code || train.sourceStationCode} →{' '}
              {train.destination_station_code || train.destinationStationCode}
            </span>
            <span className="text-sm font-medium ml-auto">
              ₹{selectedClass.fare_amount?.toLocaleString('en-IN')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Travel Time Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" /> Travel Time
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            When would you like to travel? This helps agents find the best train for you.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRAVEL_TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTravelTime(opt.value)}
                className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                  flexibility.travelTime === opt.value
                    ? 'border-primary bg-primary/5 font-medium'
                    : 'hover:bg-muted'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="travel-time-flex" className="font-medium">Flexible with travel time</Label>
              <p className="text-sm text-muted-foreground">
                Allow nearby time slots if preferred time is unavailable
              </p>
            </div>
            <Switch
              id="travel-time-flex"
              checked={!!flexibility.travelTimeFlexibility}
              onCheckedChange={() => toggle('travelTimeFlexibility')}
              disabled={!flexibility.travelTime}
            />
          </div>
        </CardContent>
      </Card>

      {/* Flexibility Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Flexibility</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enable flexibility to improve your chances of getting a confirmed booking.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="date-flex" className="font-medium">Date Flexibility</Label>
              <p className="text-sm text-muted-foreground">
                Allow booking nearby dates if no availability on selected date
              </p>
            </div>
            <Switch
              id="date-flex"
              checked={flexibility.dateFlexibility}
              onCheckedChange={() => toggle('dateFlexibility')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="train-flex" className="font-medium">Train Flexibility</Label>
              <p className="text-sm text-muted-foreground">
                Allow alternative trains if preferred train is unavailable
              </p>
            </div>
            <Switch
              id="train-flex"
              checked={flexibility.trainFlexibility}
              onCheckedChange={() => toggle('trainFlexibility')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="station-flex" className="font-medium">Station Flexibility</Label>
              <p className="text-sm text-muted-foreground">
                Allow nearby stations if no availability at selected stations
              </p>
            </div>
            <Switch
              id="station-flex"
              checked={flexibility.stationFlexibility}
              onCheckedChange={() => toggle('stationFlexibility')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} disabled={!flexibility.travelTime}>
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
