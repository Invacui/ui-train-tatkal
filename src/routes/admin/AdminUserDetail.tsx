import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenBadge } from '@/components/common/TokenBadge';
import { TokenAdjustDialog } from '@/components/admin/TokenAdjustDialog';
import { SuspendUserDialog } from '@/components/admin/SuspendUserDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { adminService } from '@/services/admin.service';

export default function AdminUserDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const [tokenOpen, setTokenOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.admin.user(id),
    queryFn: () => adminService.getUser(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (isError) return <ErrorState message={error?.message} />;
  if (!data) return null;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title={data.name} description={data.email}>
          <Button variant="outline" onClick={() => setTokenOpen(true)}>Adjust tokens</Button>
          {data.isActive && (
            <Button variant="destructive" onClick={() => setSuspendOpen(true)}>Suspend</Button>
          )}
        </PageHeader>

        <Card className="max-w-md">
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><p className="text-sm font-medium">Role</p><p className="text-sm text-muted-foreground">{data.role}</p></div>
            <div><p className="text-sm font-medium">Token balance</p><TokenBadge amount={data.tokenBalance} /></div>
            <div><p className="text-sm font-medium">Campaigns</p><p className="text-sm text-muted-foreground">{data.totalCampaigns}</p></div>
            <div><p className="text-sm font-medium">Leads</p><p className="text-sm text-muted-foreground">{data.totalLeads.toLocaleString()}</p></div>
          </CardContent>
        </Card>
      </div>

      <TokenAdjustDialog user={data} open={tokenOpen} onOpenChange={setTokenOpen} />
      <SuspendUserDialog user={data} open={suspendOpen} onOpenChange={setSuspendOpen} />
    </>
  );
}
