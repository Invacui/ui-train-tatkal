/**
 * @file Trip search results page
 * @module routes/dashboard/TripResults
 * @description Displays train search results based on source, destination,
 *   and date from query parameters. Includes a compact search form for refinements.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// URL search params to extract source, destination, and date
import { useSearchParams } from 'react-router-dom';

// Custom hook for trip search
import { useTripSearch } from '@/hooks/trips/useTripSearch';

// Trip search form component (compact variant)
import { TripSearchForm } from '@/components/trips/TripSearchForm';

// Card component for individual train listing
import { TripCard } from '@/components/trips/TripCard';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

/**
 * TripResults (page component)
 * @description Reads source, destination, and date from URL query params.
 *   Fetches matching trains via useTripSearch and renders a list of TripCard
 *   components. Shows loading skeletons, empty state, or error state as needed.
 */
export default function TripResults() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const hasSearch = source && destination && date;

  const { data: trains, isLoading, error } = useTripSearch(
    { source, destination, date },
    hasSearch,
  );

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Search Trains" description="Find trains between stations">
          <div className="w-full max-w-3xl">
            <TripSearchForm compact />
          </div>
        </PageHeader>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        )}

        {error && <ErrorState message="Failed to load trains. Please try again." />}

        {trains && trains.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            No trains found for this route on the selected date.
          </div>
        )}

        {trains && trains.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Showing {trains.length} train{trains.length > 1 ? 's' : ''} from {source} to {destination} on {date}
            </p>
            {trains.map((train) => (
              <TripCard key={train.trainNumber} train={train} searchDate={date} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
