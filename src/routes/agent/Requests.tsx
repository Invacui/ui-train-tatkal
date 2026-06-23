/**
 * @file Agent booking requests page
 * @module routes/agent/Requests
 * @description Lists pending booking requests from customers. Agents can
 *   view full request details (navigates to /agent/requests/:bookingId)
 *   and accept requests which assigns them to the booking.
 */

import { useCallback } from 'react';

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Router navigation
import { useNavigate } from 'react-router-dom';

// Redux hooks
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, selectAgent, setAgent } from '@/store/auth.slice';

// Agents service for fetching profile
import { agentsService } from '@/services/agents.service';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Email verification guard
import { EmailVerificationPrompt } from '@/components/auth/EmailVerificationPrompt';

// Custom hook for fetching pending agent requests
import { useAgentRequests } from '@/hooks/agents/useAgentRequests';

// Custom hook for accepting a booking request
import { useAcceptRequest } from '@/hooks/agents/useAcceptRequest';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for request items
import { Card, CardContent } from '@/components/ui/card';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Formatting utility for currency display
import { formatCurrency } from '@/lib/utils';

// Route constants
import { ROUTES } from '@/constants/routes';

// Icons
import { Eye, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * AgentRequests (page component)
 * @description Fetches pending booking requests and renders them as cards
 *   with train info, route, passenger count, and Accept / View Details buttons.
 *   View Details navigates to /agent/requests/:bookingId for a full-page view.
 *   If the agent's email is not verified, a warning banner is shown instead of
 *   blocking the entire page — requests are still visible but accepting is blocked.
 */
export default function AgentRequests() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  // debugger;
  const agent = useAppSelector(selectAgent);
  const dispatch = useAppDispatch();
  const { data: requests, isLoading, error } = useAgentRequests();
  const { mutate: accept, isPending: isAccepting } = useAcceptRequest();

  // Use agent-profile emailVerified if available, fall back to user's
  const emailVerified = agent?.emailVerified ?? user?.emailVerified;

  const checkAgentEmailVerification = useCallback(async () => {
    const res = await agentsService.getProfile();
    const profile = res.data.data;
    dispatch(setAgent(profile));
    return { emailVerified: profile.emailVerified };
  }, [dispatch]);

  const handleAccept = (bookingId: string) => {
    accept(bookingId);
  };

  if (error) return <ErrorState message="Failed to load requests" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Booking Requests" description="Pending booking requests from customers" />

        {/* Verification warning banner — doesn't block the page, just warns */}
        {!emailVerified && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                  Email not verified
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  You need to verify your email before you can accept booking requests.
                  Requests are visible below but the Accept button will be disabled.
                </p>
                <div className="mt-2">
                  <EmailVerificationPrompt
                    title="Verify Email to Accept Requests"
                    description="You need to verify your email before you can accept booking requests."
                    onVerified={() => {}}
                    checkStatusFn={checkAgentEmailVerification}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}

        {requests?.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No pending requests</div>
        )}

        {requests?.map((req) => (
          <Card key={req.bookingId}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{req.trainName || req.trainNumber}</p>
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
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(ROUTES.agent.requestDetail(req.bookingId))}
                    className="gap-1.5"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAccept(req.bookingId)}
                    disabled={isAccepting || !emailVerified}
                    className="gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
