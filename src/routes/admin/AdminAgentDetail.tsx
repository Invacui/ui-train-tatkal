/**
 * @file Admin agent detail page
 * @module routes/admin/AdminAgentDetail
 * @description Shows details for a specific agent and provides approve/suspend
 *   actions for admin management.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Route params to extract agent ID, navigation for back button
import { useParams, useNavigate } from 'react-router-dom';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Custom hook for approving an agent
import { useAdminAgentApprove } from '@/hooks/admin/useAdminAgentApprove';

// Custom hook for suspending an agent
import { useAdminAgentSuspend } from '@/hooks/admin/useAdminAgentSuspend';

// Toast notification for action feedback
import { toast } from 'sonner';

// ArrowLeft icon for back button
import { ArrowLeft } from 'lucide-react';

/**
 * AdminAgentDetail (page component)
 * @description Fetches agent info by ID (placeholder content currently) and
 *   provides Approve and Suspend action buttons for admin management.
 */
export default function AdminAgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: approve } = useAdminAgentApprove();
  const { mutate: suspend } = useAdminAgentSuspend();

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <PageHeader title="Agent Details" description={`Agent ID: ${id}`}>
          <div className="flex gap-2">
            <Button onClick={() => approve(id!, { onSuccess: () => toast.success('Agent approved') })}>Approve</Button>
            <Button variant="destructive" onClick={() => suspend(id!, { onSuccess: () => toast.success('Agent suspended') })}>Suspend</Button>
          </div>
        </PageHeader>
        <Card>
          <CardHeader><CardTitle>Agent Information</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Agent detail view. Full agent info will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
