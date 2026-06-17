/**
 * @file Agent dashboard overview page
 * @module routes/agent/Overview
 * @description Landing page for authenticated agents showing quick stats
 *   (pending requests, completion rate, earnings) and a link to requests.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Link for navigation to requests page
import { Link } from 'react-router-dom';

// Icons for stat cards
import { ClipboardList, TrendingUp, Wallet } from 'lucide-react';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for stats display
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Route constants for navigation links
import { ROUTES } from '@/constants/routes';

/**
 * AgentOverview (page component)
 * @description Renders the agent dashboard home with stat cards (pending
 *   requests, completion rate, earnings) and a link to view booking requests.
 */
export default function AgentOverview() {
  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Agent Dashboard" description="Manage your bookings and requests">
          <Button asChild>
            <Link to={ROUTES.agent.requests}>View Requests</Link>
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ClipboardList className="h-4 w-4" /> Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">—</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" /> Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">—</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="h-4 w-4" /> Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">—</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
