/**
 * @file Agent dashboard overview page
 * @module routes/agent/Overview
 * @description Landing page for authenticated agents showing real stats
 *   (pending requests, active bookings, completion rate, earnings),
 *   recent booking requests, and performance summary.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Link for navigation to other agent pages
import { Link } from 'react-router-dom';

// Icons for stat cards
import { ClipboardList, Ticket, TrendingUp, Wallet, ArrowRight } from 'lucide-react';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for stats display
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Badge component
import { Badge } from '@/components/ui/badge';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Error state component
import { ErrorState } from '@/components/common/ErrorState';

// Route constants for navigation links
import { ROUTES } from '@/constants/routes';

// Custom hooks for agent data
import { useAgentStats } from '@/hooks/agents/useAgentStats';
import { useAgentRequests } from '@/hooks/agents/useAgentRequests';
import { useAgentEarnings } from '@/hooks/agents/useAgentEarnings';
import { useAcceptRequest } from '@/hooks/agents/useAcceptRequest';

// Formatting utilities
import { formatCurrency } from '@/lib/utils';

/**
 * AgentOverview (page component)
 * @description Renders the agent dashboard home with real data:
 *   stat cards (pending requests, active bookings, completion rate, earnings),
 *   recent booking requests with accept buttons, and a performance summary.
 */
export default function AgentOverview() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useAgentStats();
  const { data: requests, isLoading: requestsLoading } = useAgentRequests();
  const { data: earnings, isLoading: earningsLoading } = useAgentEarnings();
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptRequest();

  const recentRequests = requests?.slice(0, 3) ?? [];
  const pendingCount = requests?.length ?? 0;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Agent Dashboard" description="Manage your bookings and requests">
          <Button asChild>
            <Link to={ROUTES.agent.requests}>View Requests</Link>
          </Button>
        </PageHeader>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Pending Requests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ClipboardList className="h-4 w-4" /> Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{stats?.totalBookings ?? pendingCount}</p>
              )}
            </CardContent>
          </Card>

          {/* Active Bookings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Ticket className="h-4 w-4" /> Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{stats?.successfulBookings ?? '—'}</p>
              )}
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" /> Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">
                  {stats ? `${stats.successRate.toFixed(0)}%` : '—'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* This Month Earnings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="h-4 w-4" /> This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {earningsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">
                  {earnings?.thisMonth != null ? formatCurrency(earnings.thisMonth) : '—'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Booking Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Booking Requests</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to={ROUTES.agent.requests}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No pending booking requests
              </div>
            ) : (
              <div className="divide-y">
                {recentRequests.map((req) => (
                  <div key={req.bookingId} className="flex items-center justify-between py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {req.trainName || req.trainNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.sourceStationCode} → {req.destinationStationCode}
                        {req.journeyDate && ` | ${req.journeyDate}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.passengers?.length || 0} passenger(s)
                        {req.pricing && ` | ${formatCurrency(req.pricing.totalAmount)}`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => acceptRequest(req.bookingId)}
                      disabled={isAccepting}
                      className="ml-4 shrink-0"
                    >
                      Accept
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Performance Summary</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to={ROUTES.agent.stats}>
                View Full Stats <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {statsError ? (
              <ErrorState message="Failed to load stats" />
            ) : statsLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Requests</p>
                  <p className="text-xl font-bold">{stats.totalBookings}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{stats.successfulBookings}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Failed</p>
                  <p className="text-xl font-bold">{stats.failedBookings}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-xl font-bold">{stats.rating.toFixed(1)}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
