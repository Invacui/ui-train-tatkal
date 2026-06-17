/**
 * @file Agent earnings page
 * @module routes/agent/Earnings
 * @description Shows the agent's earnings overview including total earnings,
 *   current month earnings, pending payout, and last payout details.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Card components for stats display
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Custom hook for fetching agent earnings data
import { useAgentEarnings } from '@/hooks/agents/useAgentEarnings';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Formatting utilities for currency and date
import { formatCurrency, formatDate } from '@/lib/utils';

/**
 * AgentEarnings (page component)
 * @description Fetches earnings data via useAgentEarnings hook and displays
 *   total earnings, this month's earnings, pending payout, and last payout
 *   in a grid of stat cards.
 */
export default function AgentEarnings() {
  const { data: earnings, isLoading, error } = useAgentEarnings();

  if (error) return <ErrorState message="Failed to load earnings" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Earnings" description="Your earnings overview" />
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : earnings ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(earnings.totalEarnings)}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">This Month</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(earnings.thisMonth)}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending Payout</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(earnings.pendingPayout)}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Last Payout</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(earnings.lastPayout)}</p>{earnings.lastPayoutDate && <p className="text-xs text-muted-foreground">{formatDate(earnings.lastPayoutDate)}</p>}</CardContent></Card>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
