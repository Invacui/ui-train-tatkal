/**
 * @file Trip Card component
 * @module components/trips/TripCard
 * @description Shadcn-styled train card in 2-column grid. Perk icons near
 *   header, big severity-colored class chips (horizontally scrollable),
 *   timing pulled to bottom with top-border separator, rating + actions footer.
 */

import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, isBefore, parse } from 'date-fns';
import {
  Train,
  ArrowRight,
  Star,
  Utensils,
  Wifi,
  Plug,
  Bed,
  Soup,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/constants/routes';
import type { Train as TrainType, CustomClassAvailability } from '@/types/trips.types';
import { formatDuration, formatCurrency, cn } from '@/lib/utils';
import { PriceBreakdownDialog } from './PriceBreakdownDialog';

interface TripCardProps {
  train: TrainType;
  searchDate: string;
  source?: string;
  destination?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function relativeTimeAgo(timestamp: string | null): string {
  if (!timestamp) return '';
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch {
    return '';
  }
}

type Severity = 'confirmed' | 'rac' | 'waitlist' | 'regret' | 'default';

function getSeverity(label: string): Severity {
  const s = label.toUpperCase();
  if (/^(CNF|CONFIRM|AVAILABLE|BOOKING CONFIRMED)/.test(s)) return 'confirmed';
  if (/^RAC\b/.test(s)) return 'rac';
  if (/^WL\b|^W\/L|WAITLIST/.test(s)) return 'waitlist';
  if (/CAN\b|CANCELLED|REGRET|REGERT|NOT AVAILABLE|NO BERTH/.test(s)) return 'regret';
  return 'default';
}

const severityBorder: Record<Severity, string> = {
  confirmed: 'border-green-300 dark:border-green-700',
  rac:       'border-blue-300 dark:border-blue-700',
  waitlist:  'border-amber-300 dark:border-amber-700',
  regret:    'border-red-300 dark:border-red-700',
  default:   'border-border',
};

const severityBg: Record<Severity, string> = {
  confirmed: 'bg-green-50 dark:bg-green-950',
  rac:       'bg-blue-50 dark:bg-blue-950',
  waitlist:  'bg-amber-50 dark:bg-amber-950',
  regret:    'bg-red-50 dark:bg-red-950',
  default:   'bg-card',
};

const severityDot: Record<Severity, string> = {
  confirmed: 'bg-green-500',
  rac:       'bg-blue-500',
  waitlist:  'bg-amber-500',
  regret:    'bg-red-500',
  default:   'bg-muted-foreground',
};

// ─── Amenity perks ───────────────────────────────────────────────────────

interface Amenity {
  key: string;
  icon: typeof Wifi;
  label: string;
  show: (train: TrainType) => boolean;
}

const amenities: Amenity[] = [
  { key: 'wifi', icon: Wifi, label: 'WiFi onboard', show: (t) => t.has_wifi },
  { key: 'meal', icon: Soup, label: 'Meal included', show: (t) => t.has_meal },
  { key: 'pantry', icon: Utensils, label: 'Pantry car', show: (t) => t.has_pantry },
  { key: 'charging', icon: Plug, label: 'Mobile charging', show: (t) => t.has_charging },
  { key: 'blanket', icon: Bed, label: 'Blanket / Bedroll', show: (t) => t.has_blanket || t.has_bedroll },
];

// ─── Component ───────────────────────────────────────────────────────────

/**
 * TripCard
 * @description Train listing card in 2-column grid. Layout:
 *   top: name+number / perk icons / class chips (scrollable)
 *   bottom (border-separated): timing / footer (rating + actions)
 */
export function TripCard({ train, searchDate, source, destination }: TripCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CustomClassAvailability | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const availableClasses = train.class_availability?.filter((c) => c.is_bookable) ?? [];
  const activeAmenities = amenities.filter((a) => a.show(train));

  /** Check if the train has already departed for the given search date */
  const isDeparted = useMemo(() => {
    if (!searchDate) return false;
    try {
      // Combine search date (YYYY-MM-DD) with departure time (HH:mm)
      const depTime = train.departure_time_24h || train.departureTime;
      if (!depTime) return false;
      const departure = parse(`${searchDate} ${depTime}`, 'yyyy-MM-dd HH:mm', new Date());
      return isBefore(departure, new Date());
    } catch {
      return false;
    }
  }, [searchDate, train.departure_time_24h, train.departureTime]);

  /** Check if there are any bookable classes */
  const hasBookableClasses = availableClasses.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(train.train_identifier_id || train.trainNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <TooltipProvider>
      <Card className="group h-full transition-all duration-200 hover:border-primary/30 hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-3 p-4">
          {/* ═══════════════════════════════════════════════════════════════
              TOP SECTION
          ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-3">
            {/* ── Departed banner ── */}
            {isDeparted && (
              <div className="rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 text-center">
                This train has already departed
              </div>
            )}
            {/* ── ROW 1: Train name (left) + number + copy (right) ── */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">
                  {train.train_display_name || train.trainName}
                </h3>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-1 py-0.5 text-[10px] font-medium uppercase">
                    {train.train_category?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="font-mono text-xs text-muted-foreground">
                  {train.train_identifier_id || train.trainNumber}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rounded p-0.5 text-muted-foreground/60 transition-colors hover:text-foreground"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{copied ? 'Copied!' : 'Copy train number'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* ── ROW 2: Class chips (big square info-grid, scrollable hidden scrollbar) ── */}
            {availableClasses.length > 0 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none" style={{ scrollSnapType: 'x mandatory' }}>
                {availableClasses.map((cls) => {
                  const statusLabel = cls.availability_display_label || cls.availability_status_text || '';
                  const severity = getSeverity(statusLabel);

                  return (
                    <button
                      key={`${cls.travel_class_code}-${cls.quota_code}`}
                      type="button"
                      onClick={() => {
                        setSelectedClass(cls);
                      }}
                      style={{ scrollSnapAlign: 'start' }}
                      className={cn(
                        'flex w-[148px] shrink-0 flex-col rounded-lg border-2 p-2.5 text-xs text-left transition-all',
                        severityBorder[severity],
                        severityBg[severity],
                        selectedClass === cls
                          ? 'ring-2 ring-primary ring-offset-1'
                          : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1',
                      )}
                    >
                      {/* Chip Row 1: Class + Tatkal tag | Fare */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          {cls.travel_class_code}
                          {cls.quota_code === 'TQ' && (
                            <span className="rounded-sm bg-amber-100 px-1 text-[9px] font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                              Tatkal
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                          {formatCurrency(cls.fare_amount)}
                        </span>
                      </div>

                      {/* Chip Row 2: Severity dot + Status label (big, centered) */}
                      <div className="  flex flex-col items-center justify-center gap-0.5 py-1.5">
                        <span className="flex items-center gap-1.5 text-sm font-bold leading-tight -ml-4 tracking-tight text-foreground">
                          <span className={cn('h-2 w-2 rounded-full', severityDot[severity])} />
                          {statusLabel}
                        </span>
                        {/* Chance directly under status */}
                        {cls.booking_prediction_percentage != null && (
                          <span className="text-[10px] text-muted-foreground">
                            {cls.booking_prediction_percentage}% Chance
                          </span>
                        )}
                      </div>

                      {/* Chip Row 3: Age (bottom-right) */}
                      <div className="flex items-center capitalize border-gray-700 pt-1 border-t-[1px] text center justify-center text-[10px] text-muted-foreground/60">
                        {relativeTimeAgo(cls.data_timestamp)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fallback for no availability data */}
            {availableClasses.length === 0 && train.classes && train.classes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {train.classes.slice(0, 4).map((cls) => (
                  <Badge
                    key={cls.code}
                    variant={cls.availableSeats > 0 ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {cls.code} {cls.availableSeats > 0 ? formatCurrency(cls.fare) : 'NA'}
                  </Badge>
                ))}
                {train.classes.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{train.classes.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              BOTTOM SECTION — clearly border-separated
          ════════════════════════════════════════════════════════════════ */}

          {/* Visible separator */}
          <hr className="mt-auto border-border" />

          {/* ── ROW 4: Timing (departure → duration → arrival) ── */}
          <div className="pt-2">
            <div className="flex items-center gap-2">
              {/* Departure */}
              <div className="flex-1 text-center">
                <p className="text-lg font-bold leading-tight text-foreground">
                  {train.departure_time_24h || train.departureTime}
                </p>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {train.origin_station_code || train.sourceStationCode}
                </p>
                <p className="mx-auto max-w-[80px] truncate text-[10px] text-muted-foreground/60">
                  {train.origin_station_name}
                </p>
              </div>

              {/* Duration line */}
              <div className="flex flex-[2] flex-col items-center gap-0.5 px-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  {train.travel_duration_minutes
                    ? formatDuration(String(train.travel_duration_minutes))
                    : formatDuration(train.travel_duration_tt || train.duration || '')}
                </span>
                <div className="relative flex h-px w-full items-center">
                  <div className="h-px flex-1 bg-border" />
                  <div className="mx-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50">
                  {train.total_halts_count > 0 && (
                    <span>{train.total_halts_count} halt{train.total_halts_count !== 1 ? 's' : ''}</span>
                  )}
                  {train.total_distance_km != null && (
                    <span>~{train.total_distance_km} km</span>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div className="flex-1 text-center">
                <p className="text-lg font-bold leading-tight text-foreground">
                  {train.arrival_time_24h || train.arrivalTime}
                </p>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {train.destination_station_code || train.destinationStationCode}
                </p>
                <p className="mx-auto max-w-[80px] truncate text-[10px] text-muted-foreground/60">
                  {train.destination_station_name}
                </p>
              </div>
            </div>
          </div>

          {/* ── ROW 5: Footer — Perk icons + Rating (left) + Actions (right) ── */}
          <hr className="border-border" />
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {/* Perk icons next to rating */}
              {activeAmenities.length > 0 && activeAmenities.map((amenity) => (
                <Tooltip key={amenity.key}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                      <amenity.icon className="h-3 w-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{amenity.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {train.is_tejas && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950">
                      <Train className="h-3 w-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Tejas Express</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {train.train_rating != null && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-medium text-foreground">{train.train_rating.toFixed(1)}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                disabled={!selectedClass || isDeparted}
                onClick={() => {
                  if (selectedClass) setDialogOpen(true);
                }}
              >
                <Info className="mr-1 h-3 w-3" />
                Details
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1 text-xs"
                disabled={!hasBookableClasses || isDeparted}
                onClick={() => {
                  const id = train.train_identifier_id || train.trainNumber;
                  if (id) {
                    const params = new URLSearchParams();
                    if (source) params.set('source', source);
                    if (destination) params.set('destination', destination);
                    if (searchDate) params.set('date', searchDate);
                    const qs = params.toString();
                    navigate(`${ROUTES.booking(id)}${qs ? `?${qs}` : ''}`, {
                      state: { trainData: train },
                    });
                  }
                }}
              >
                Book
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown Dialog */}
      {selectedClass && (
        <PriceBreakdownDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          cls={selectedClass}
          trainName={train.train_display_name || train.trainName}
          trainNumber={train.train_identifier_id || train.trainNumber}
          isDeparted={isDeparted}
          train={train}
          source={source}
          destination={destination}
          date={searchDate}
        />
      )}
    </TooltipProvider>
  );
}
