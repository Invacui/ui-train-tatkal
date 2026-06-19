/**
 * @file Calendar Date Strip component
 * @module components/trips/CalendarDateStrip
 * @description Horizontal scrollable date strip showing availability states
 *   from the API. Each card shows a day with a colored indicator based on
 *   availability. Selected date is highlighted. Clicking a date triggers
 *   re-search with that date.
 */

import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useAvailabilityCalendar } from '@/hooks/trips/useAvailabilityCalendar';
import { formatDateForApi, getAvailabilityLabel, getAvailabilityTextColor, getDayName, cn } from '@/lib/utils';
import type { CalendarDay } from '@/types/calendar.types';

interface CalendarDateStripProps {
  source: string;
  destination: string;
  selectedDate: string;       // DD-MM-YYYY
  onDateSelect: (date: string) => void;
}

/**
 * CalendarDateStrip
 * @description Renders a horizontal scrollable strip of date cards with
 *   availability state indicators. Always starts from today so users can
 *   scroll back. Auto-scrolls to the selected date on load.
 */
export function CalendarDateStrip({
  source,
  destination,
  selectedDate,
  onDateSelect,
}: CalendarDateStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Always fetch from today so the user can scroll back to present
  const today = formatDateForApi(new Date());
  const { data: calendar, isLoading, error } = useAvailabilityCalendar(
    source,
    destination,
    today,
    16,
  );

  // Auto-scroll to the selected date when data loads
  useEffect(() => {
    if (!scrollRef.current || !calendar?.days.length) return;
    const selectedIndex = calendar.days.findIndex(
      (d) => d.calendar_date === selectedDate,
    );
    if (selectedIndex < 0) return;
    const child = scrollRef.current.children[selectedIndex] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [calendar, selectedDate]);

  const days: CalendarDay[] = calendar?.days ?? [];

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 120;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 overflow-hidden py-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="shimmer h-[76px] w-[100px] shrink-0 rounded-lg"
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error || days.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <span>Calendar unavailable for this route</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left scroll button */}
      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute -left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="scrollbar-thin flex gap-2 overflow-x-auto py-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {days.map((day) => {
          const isSelected = day.calendar_date === selectedDate;
          const label = day.display_title ?? getAvailabilityLabel(day.availability_state);
          const textColor = getAvailabilityTextColor(day.availability_state);

          return (
            <button
              key={day.calendar_date}
              type="button"
              onClick={() => onDateSelect(day.calendar_date)}
              style={{ scrollSnapAlign: 'start' }}
              className={cn(
                'flex w-[100px] shrink-0 flex-col items-center gap-1 rounded-lg border px-2 py-2 transition-all',
                'hover:border-primary/50 hover:shadow-sm',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card',
              )}
            >
              {/* Day name */}
              <span className="text-[11px] font-medium text-muted-foreground uppercase">
                {getDayName(day.calendar_date)}
              </span>

              {/* Date number */}
              <span
                className={cn(
                  'text-sm font-semibold',
                  isSelected ? 'text-primary' : 'text-foreground',
                )}
              >
                {day.calendar_date.split('-')[0]}
              </span>

              {/* Availability text label */}
              <span className={cn('text-[10px] font-semibold leading-tight', textColor)}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute -right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
