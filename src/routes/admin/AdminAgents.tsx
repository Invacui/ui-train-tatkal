/**
 * @file Admin agents list page
 * @module routes/admin/AdminAgents
 * @description Lists all registered railway booking agents in a table with
 *   agency info, status, tier, rating, and actions to view details.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Navigation to agent detail page
import { useNavigate } from 'react-router-dom';

// Table components for agent listing
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// UI button component
import { Button } from '@/components/ui/button';

// Badge component for agent tier
import { Badge } from '@/components/ui/badge';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Status badge for agent status display
import { StatusBadge } from '@/components/common/StatusBadge';

// Custom hook for fetching all agents
import { useAdminAgents } from '@/hooks/admin/useAdminAgents';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Route constants for navigation
import { ROUTES } from '@/constants/routes';

/**
 * AdminAgents (page component)
 * @description Fetches all agents via useAdminAgents hook and renders them
 *   in a sortable/clickable table. Navigates to agent detail on row click.
 */
export default function AdminAgents() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAdminAgents();

  if (error) return <ErrorState message="Failed to load agents" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Agents" description="Manage railway booking agents" />

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-20" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.agents?.length ? (
                data.agents.map((agent) => (
                  <TableRow key={agent.id} className="cursor-pointer" onClick={() => navigate(ROUTES.admin.agentDetail(agent.id))}>
                    <TableCell className="font-medium">{agent.agencyName}</TableCell>
                    <TableCell>{agent.ownerName}</TableCell>
                    <TableCell><StatusBadge status={agent.status} /></TableCell>
                    <TableCell><Badge variant="outline">{agent.tier}</Badge></TableCell>
                    <TableCell>{agent.rating?.toFixed(1)}</TableCell>
                    <TableCell>{agent.totalBookings}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No agents found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
