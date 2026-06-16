import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LeadRequestCard } from '@/components/leads/LeadRequestCard';
import { LeadStatsBar } from '@/components/leads/LeadStatsBar';
import { LeadStatusPoller } from '@/components/leads/LeadStatusPoller';
import { Skeleton } from '@/components/ui/skeleton';
import { useLeadRequests } from '@/hooks/leads/useLeadRequests';
import { ROUTES } from '@/constants/routes';

export default function LeadsList() {
  const { data, isLoading, isError, error, refetch } = useLeadRequests();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState message={error?.message} onRetry={() => void refetch()} />;

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-6">
        <PageHeader title="Lead Lists" description="Manage your uploaded lead data.">
          <Button asChild>
            <Link to={ROUTES.leadUpload}>Upload leads</Link>
          </Button>
        </PageHeader>

        {data && data.length > 0 && (
          <>
            <LeadStatsBar leads={data} />
            <LeadStatusPoller leads={data} />
          </>
        )}

        {!data?.length ? (
          <EmptyState
            title="No lead lists yet"
            description="Upload a CSV or XLSX file to get started."
          >
            <Button asChild>
              <Link to={ROUTES.leadUpload}>Upload leads</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((request) => (
              <LeadRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
