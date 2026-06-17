/**
 * @file Admin overview / dashboard page
 * @module routes/admin/AdminOverview
 * @description Landing page for the admin panel showing platform-level stats
 *   including total users, agents, bookings, revenue, and completion rate.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Card components for stats display
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Custom hook for fetching admin dashboard stats
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Formatting utility for currency display
import { formatCurrency } from '@/lib/utils';

/**
 * AdminOverview (page component)
 * @description Fetches platform stats via useAdminDashboard and renders them
 *   in a grid of stat cards (users, agents, bookings, revenue, etc.).
 */
export default function AdminOverview() {
  const { data: stats, isLoading, error } = useAdminDashboard();

  if (error) return <ErrorState message="Failed to load dashboard" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Admin Dashboard" description="Platform overview" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          ) : stats ? (
            <>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.totalUsers}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Agents</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.totalAgents}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Bookings</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.totalBookings}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Agents</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.activeAgents}</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completion Rate</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{(stats.completionRate * 100).toFixed(0)}%</p></CardContent></Card>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
