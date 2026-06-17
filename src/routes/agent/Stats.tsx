/**
 * @file Agent performance stats page
 * @module routes/agent/Stats
 * @description Displays the agent's performance metrics including total requests,
 *   accepted/completed bookings, completion rate, rating, and current load.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Card components for stats display
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Custom hook for fetching agent performance stats
import { useAgentStats } from '@/hooks/agents/useAgentStats';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

/**
 * AgentStats (page component)
 * @description Fetches agent stats via useAgentStats hook and renders them in
 *   a grid of metric cards (total requests, accepted, completed, completion
 *   rate, rating, current load).
 */
export default function AgentStats() {
  const { data: stats, isLoading, error } = useAgentStats();

  if (error) return <ErrorState message="Failed to load stats" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Performance Stats" description="Your booking metrics" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? [1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          )) : stats && (
            <>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Requests</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.totalRequests}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Accepted</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.acceptedRequests}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completed</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.completedBookings}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completion Rate</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{(stats.completionRate * 100).toFixed(0)}%</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Rating</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.rating.toFixed(1)}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Current Load</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.currentLoad}</p></CardContent></Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}
