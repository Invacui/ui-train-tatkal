/**
 * @file Agent booking requests page
 * @module routes/agent/Requests
 * @description Lists pending booking requests from customers. Agents can
 *   accept requests which assigns them to the booking.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Custom hook for fetching pending agent requests
import { useAgentRequests } from '@/hooks/agents/useAgentRequests';

// Custom hook for accepting a booking request
import { useAcceptRequest } from '@/hooks/agents/useAcceptRequest';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for request items
import { Card, CardContent } from '@/components/ui/card';

// Badge component (unused in current render but imported)
import { Badge } from '@/components/ui/badge';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Formatting utility for currency display
import { formatCurrency } from '@/lib/utils';

/**
 * AgentRequests (page component)
 * @description Fetches pending booking requests and renders them as cards
 *   with train info, route, passenger count, and an Accept button.
 */
export default function AgentRequests() {
  const { data: requests, isLoading, error } = useAgentRequests();
  const { mutate: accept, isPending: isAccepting } = useAcceptRequest();

  if (error) return <ErrorState message="Failed to load requests" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Booking Requests" description="Pending booking requests from customers" />

        {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}

        {requests?.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No pending requests</div>
        )}

        {requests?.map((req) => (
          <Card key={req.bookingId}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{req.trainName} ({req.trainNumber})</p>
                <p className="text-sm text-muted-foreground">
                  {req.sourceStationCode} → {req.destinationStationCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {req.journeyDate} | {req.passengers?.length || 0} passenger(s)
                </p>
                {req.pricing && (
                  <p className="text-sm font-medium">{formatCurrency(req.pricing.totalAmount)}</p>
                )}
              </div>
              <Button onClick={() => accept(req.bookingId)} disabled={isAccepting}>
                Accept
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
