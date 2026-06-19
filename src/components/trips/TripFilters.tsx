/**
 * @file Trip Filters component
 * @module components/trips/TripFilters
 * @description Filter panel for train search results. Uses shadcn Collapsible
 *   for collapsible filter sections and shadcn Switch for toggles.
 *   Desktop: sidebar panel. Mobile: bottom drawer via shadcn Dialog.
 */

import { useState, useCallback, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TRAIN_CATEGORIES, TIME_RANGES } from '@/constants/enums.constant';
import { cn } from '@/lib/utils';
import type {
  SearchFilters,
  DepartureTimeRange,
  TimeRangePreset,
} from '@/types/filters.types';
import { TIME_RANGE_PRESETS } from '@/types/filters.types';

interface TripFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  /** Class to apply to the desktop sidebar container */
  className?: string;
  /** Whether to show as mobile drawer */
  mobile?: boolean;
  /** Controls mobile drawer open state */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const ratingOptions = [3, 4];

/**
 * TripFilters
 * @description Collapsible filter panel for train search results.
 * Desktop: inline sidebar. Mobile: bottom drawer via Headless UI Dialog.
 */
export function TripFilters({
  filters,
  onFiltersChange,
  className,
  mobile = false,
  mobileOpen = false,
  onMobileClose,
}: TripFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const update = useCallback(
    (patch: Partial<SearchFilters>) => {
      const next = { ...localFilters, ...patch };
      setLocalFilters(next);
      onFiltersChange(next);
    },
    [localFilters, onFiltersChange],
  );

  const clearAll = () => {
    const cleared: SearchFilters = {};
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const activeCount = Object.values(localFilters).filter(
    (v) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0),
  ).length;

  const content = (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-semibold">Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search by name/number */}
      <Collapsible defaultOpen={!!localFilters.query} className="group">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
          <span>Search</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2 pb-2 pt-1">
          <Input
            placeholder="Train name or number..."
            value={localFilters.query ?? ''}
            onChange={(e) => update({ query: e.target.value })}
            className="h-8 text-xs"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Tatkal toggle */}
      <Collapsible className="group">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
          <span>Availability</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2 pb-2 pt-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="tatkal-only"
                checked={localFilters.tatkalOnly ?? false}
                onCheckedChange={(val) => update({ tatkalOnly: val })}
              />
              <Label htmlFor="tatkal-only" className="text-sm font-normal">Tatkal only</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="ac-classes-only"
                checked={localFilters.acClassesOnly ?? false}
                onCheckedChange={(val) => update({ acClassesOnly: val })}
              />
              <Label htmlFor="ac-classes-only" className="text-sm font-normal">AC classes only</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Departure time */}
      <Collapsible className="group">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
          <span>Departure Time</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2 pb-2 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {TIME_RANGES.map((range) => {
              const preset = TIME_RANGE_PRESETS[range.value];
              const isActive =
                localFilters.departureTimeRange?.from === preset.from &&
                localFilters.departureTimeRange?.to === preset.to;
              return (
                <button
                  key={range.value}
                  type="button"
                  onClick={() =>
                    update({
                      departureTimeRange: isActive ? undefined : preset,
                    })
                  }
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs transition-colors',
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  {range.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rating */}
      <Collapsible className="group">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
          <span>Rating</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2 pb-2 pt-1">
          <div className="flex gap-1.5">
            {ratingOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() =>
                  update({
                    minRating: localFilters.minRating === r ? undefined : r,
                  })
                }
                className={cn(
                  'rounded-md border px-3 py-1 text-xs transition-colors',
                  localFilters.minRating === r
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50',
                )}
              >
                {r}+ ★
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Train category */}
      <Collapsible className="group">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
          <span>Train Type</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2 pb-2 pt-1">
          <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
            {TRAIN_CATEGORIES.map((cat) => {
              const isActive = localFilters.categories?.includes(cat) ?? false;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    update({
                      categories: isActive
                        ? (localFilters.categories ?? []).filter((c) => c !== cat)
                        : [...(localFilters.categories ?? []), cat],
                    })
                  }
                  className={cn(
                    'rounded-md border px-2 py-1 text-xs transition-colors',
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  {cat.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  // Mobile drawer
  if (mobile) {
    return (
      <Dialog open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <DialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn('w-56 shrink-0', className)}>
      {content}
    </div>
  );
}
