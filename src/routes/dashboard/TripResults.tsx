/**
 * @file Trip search results page
 * @module routes/dashboard/TripResults
 * @description Displays train search results with a centered search input
 *   section (like PNR check), calendar date strip, filter sidebar,
 *   pagination, and train cards. URL-driven — shareable/bookmarkable results.
 *   A back button lets you return to edit the search.
 */

import { useState, useCallback, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Train,
  Filter,
  X,
  Search,
  ArrowLeft,
  CalendarIcon,
} from 'lucide-react';
import { useTripSearch } from '@/hooks/trips/useTripSearch';
import { useFilteredTrains } from '@/hooks/trips/useFilteredTrains';
import { usePricingConfig } from '@/hooks/pricing/usePricingConfig';
import { CalendarDateStrip } from '@/components/trips/CalendarDateStrip';
import { TripFilters } from '@/components/trips/TripFilters';
import { PaginationControls } from '@/components/trips/PaginationControls';
import { TripCard } from '@/components/trips/TripCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimationContainer } from '@/components/marketing/animations/AnimationContainer';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn, formatDateForApi } from '@/lib/utils';
import type { SearchFilters, PageSize } from '@/types/filters.types';

const SKELETON_COUNT = 5;

/**
 * TripResults (page component)
 * @description Search train results page. When no URL params are provided,
 *   shows a centered search form (like PNR check). When source/destination/
 *   date are in the URL, fetches and displays results with a back button
 *   to return to the search form.
 */
export default function TripResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = (Number(searchParams.get('pageSize')) || 20) as PageSize;

  const hasSearch = !!(source && destination && date);

  // ── Local search form state (used when no URL params) ──
  const [formSource, setFormSource] = useState('');
  const [formDest, setFormDest] = useState('');
  const [formDate, setFormDate] = useState('');

  // ── Data ──
  const { data: trains, isLoading, error } = useTripSearch(
    { source, destination, date },
    hasSearch,
  );

  // ── Pre-warm pricing config cache for PriceBreakdownDialog ──
  usePricingConfig();

  // ── Filters ──
  const [filters, setFilters] = useState<SearchFilters>({});
  const { filteredTrains, appliedFilterCount } = useFilteredTrains(trains, filters);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filteredTrains.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedTrains = filteredTrains.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  // ── Mobile filters drawer ──
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Handlers ──
  const updateURL = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, val]) => {
          if (val) next.set(key, val);
          else next.delete(key);
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!formSource || !formDest || !formDate) return;
    updateURL({
      source: formSource.toUpperCase(),
      destination: formDest.toUpperCase(),
      date: formDate,
      page: '1',
    });
  };

  const handleBack = () => {
    // Clear URL params to return to search form, pre-fill with previous values
    setFormSource(source);
    setFormDest(destination);
    setFormDate(date);
    setSearchParams({});
  };

  const handleDateSelect = (newDate: string) => {
    const [day, month, year] = newDate.split('-');
    const isoDate = `${year}-${month}-${day}`;
    updateURL({ date: isoDate, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: PageSize) => {
    updateURL({ pageSize: String(newSize), page: '1' });
  };

  // ── Date for calendar strip ──
  const calendarDate = date
    ? formatDateForApi(date)
    : formatDateForApi(new Date());

  // ── Shared search input section ──
  const searchInputSection = (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-left text-xs font-medium text-muted-foreground">From station code</label>
            <Input
              placeholder="e.g. NDLS"
              value={formSource}
              onChange={(e) => setFormSource(e.target.value)}
              className="h-12 text-base uppercase"
              disabled={hasSearch}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-left text-xs font-medium text-muted-foreground">To station code</label>
            <Input
              placeholder="e.g. BCT"
              value={formDest}
              onChange={(e) => setFormDest(e.target.value)}
              className="h-12 text-base uppercase"
              disabled={hasSearch}
            />
          </div>
          <div className="sm:w-48">
            <label className="mb-1 block text-left text-xs font-medium text-muted-foreground">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={hasSearch}
                  className={cn(
                    'h-12 w-full justify-start gap-3 text-left font-normal',
                    !formDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  {formDate ? (
                    <span className="text-base">{format(new Date(formDate + 'T12:00:00'), 'EEE, MMM d, yyyy')}</span>
                  ) : (
                    <span className="text-base">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formDate ? new Date(formDate + 'T12:00:00') : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setFormDate(format(date, 'yyyy-MM-dd'));
                    }
                  }}
                  disabled={(date) => date < new Date(new Date().toDateString())}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-end">
            <Button type="submit" size="lg" className="h-12 gap-2 px-6">
              <Search className="h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <Helmet>
        <title>
          {hasSearch
            ? `${source} → ${destination} | ${date} — TripTatkal`
            : 'Search Trains — TripTatkal'}
        </title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {!hasSearch ? (
        /* ═══ NO SEARCH YET — SHOW CENTERED SEARCH FORM ═══ */
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:py-20">
            <AnimationContainer variant="fadeInUp">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Train className="h-8 w-8 text-primary" />
              </div>
            </AnimationContainer>

            <AnimationContainer variant="fadeInUp" delay={0.1}>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Search Trains
              </h1>
            </AnimationContainer>

            <AnimationContainer variant="fadeInUp" delay={0.2}>
              <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
                Enter your source and destination station codes along with your travel date.
              </p>
            </AnimationContainer>

            <AnimationContainer variant="fadeInUp" delay={0.3}>
              <div className="mx-auto mt-8 flex justify-center">
                {searchInputSection}
              </div>
            </AnimationContainer>
          </div>
        </section>
      ) : (
        /* ═══ RESULTS VIEW ═══ */
        <div className="flex flex-col gap-5">
          {/* ── SEARCH SUMMARY BAR ── */}
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-9 w-9 shrink-0"
                title="Change search"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <Train className="h-4 w-4 text-primary" />
                <span>
                  <span className="font-semibold text-foreground">{source}</span>
                  {' → '}
                  <span className="font-semibold text-foreground">{destination}</span>
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">{date}</span>
              </div>
            </div>
          </div>

          {/* ── CALENDAR DATE STRIP ── */}
          {hasSearch && !isLoading && trains && trains.length > 0 && (
            <CalendarDateStrip
              source={source}
              destination={destination}
              selectedDate={calendarDate}
              onDateSelect={handleDateSelect}
            />
          )}

          {/* ── RESULTS AREA ── */}
          {hasSearch && (
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Filter sidebar — desktop */}
              <div className="hidden lg:block">
                <TripFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>

              {/* Mobile filter button */}
              <div className="flex items-center justify-between lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {appliedFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {appliedFilterCount}
                    </Badge>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground">
                  {trains?.length ?? 0} train{trains?.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Mobile filter drawer */}
              <TripFilters
                filters={filters}
                onFiltersChange={setFilters}
                mobile
                mobileOpen={mobileFiltersOpen}
                onMobileClose={() => setMobileFiltersOpen(false)}
              />

              {/* ═══ RESULTS LIST ═══ */}
              <div className="flex-1 space-y-4">
                {/* Results summary — desktop */}
                {!isLoading && trains && trains.length > 0 && (
                  <div className="hidden items-center justify-between lg:flex">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{filteredTrains.length}</span>{' '}
                      train{filteredTrains.length !== 1 ? 's' : ''} found
                      {appliedFilterCount > 0 && (
                        <span className="ml-1 text-muted-foreground">
                          ({appliedFilterCount} filter{appliedFilterCount !== 1 ? 's' : ''} active)
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Loading state */}
                {isLoading && (
                  <div className="space-y-3">
                    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                      <Skeleton key={i} className="h-36 w-full rounded-lg" />
                    ))}
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <ErrorState message="Failed to load trains. Please try again." />
                )}

                {/* Empty state */}
                {!isLoading && !error && trains && trains.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
                    <TrainIcon />
                    <p className="text-lg font-medium">No trains found</p>
                    <p className="text-sm">
                      No trains available from {source} to {destination} on {date}.
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      Try a different date or check nearby stations.
                    </p>
                    <Button variant="outline" size="sm" onClick={handleBack} className="mt-2 gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Change search
                    </Button>
                  </div>
                )}

                {/* No results after filtering */}
                {!isLoading && !error && trains && trains.length > 0 && filteredTrains.length === 0 && (
                  <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
                    <Filter className="h-8 w-8" />
                    <p className="text-lg font-medium">No matching trains</p>
                    <p className="text-sm">
                      Try adjusting your filters to see more results.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({})}
                      className="mt-2"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Clear filters
                    </Button>
                  </div>
                )}

                {/* Train list */}
                {!isLoading && !error && paginatedTrains.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {paginatedTrains.map((train, idx) => (
                        <TripCard key={train.trainNumber || train.train_identifier_id || train.train_number || idx} train={train} searchDate={date} source={source} destination={destination} />
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="pt-2">
                      <PaginationControls
                        currentPage={safePage}
                        totalPages={totalPages}
                        totalItems={filteredTrains.length}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/** Inline train icon for empty states */
function TrainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground/30"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M8 20l-2 2" />
      <path d="M16 20l2 2" />
    </svg>
  );
}
