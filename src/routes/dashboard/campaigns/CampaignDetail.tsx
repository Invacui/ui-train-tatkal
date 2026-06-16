import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampaignStatsGrid } from '@/components/campaigns/CampaignStatsGrid';
import { CampaignLogTable } from '@/components/campaigns/CampaignLogTable';
import { HotLeadsList } from '@/components/campaigns/HotLeadsList';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaign } from '@/hooks/campaigns/useCampaign';
import { useCampaignLogs } from '@/hooks/campaigns/useCampaignLogs';
import { useHotLeads } from '@/hooks/campaigns/useHotLeads';
import { usePauseCampaign } from '@/hooks/campaigns/usePauseCampaign';
import { useResumeCampaign } from '@/hooks/campaigns/useResumeCampaign';

export default function CampaignDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useCampaign(id);
  const { data: logs, isLoading: logsLoading } = useCampaignLogs(id);
  const { data: hotLeads } = useHotLeads(id);
  const { mutate: pause, isPending: isPausing } = usePauseCampaign(id);
  const { mutate: resume, isPending: isResuming } = useResumeCampaign(id);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (isError) return <ErrorState message={error?.message} />;
  if (!data) return null;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title={data.name}>
          <StatusBadge status={data.status} />
          {data.status === 'RUNNING' && (
            <Button variant="outline" onClick={() => pause()} disabled={isPausing}>
              {isPausing ? 'Pausing…' : 'Pause'}
            </Button>
          )}
          {data.status === 'PAUSED' && (
            <Button onClick={() => resume()} disabled={isResuming}>
              {isResuming ? 'Resuming…' : 'Resume'}
            </Button>
          )}
        </PageHeader>

        <CampaignStatsGrid campaign={data} />

        <Tabs defaultValue="logs">
          <TabsList>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="hot">Hot Leads</TabsTrigger>
          </TabsList>
          <TabsContent value="logs">
            <CampaignLogTable data={logs?.data ?? []} isLoading={logsLoading} />
          </TabsContent>
          <TabsContent value="hot">
            <HotLeadsList hotLeads={hotLeads ?? []} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
