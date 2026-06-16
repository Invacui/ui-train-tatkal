import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RelativeTime } from '@/components/common/RelativeTime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampaigns } from '@/hooks/campaigns/useCampaigns';
import { ROUTES } from '@/constants/routes';

export default function CampaignsList() {
  const { data, isLoading, isError, error, refetch } = useCampaigns();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState message={error?.message} onRetry={() => void refetch()} />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Campaigns" description="Track your AI campaigns." />

        {!data?.length ? (
          <EmptyState
            title="No campaigns yet"
            description="Launch a template to create a campaign."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.map((campaign) => (
              <Link key={campaign.id} to={ROUTES.campaign(campaign.id)}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="flex-row items-start justify-between space-y-0">
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <StatusBadge status={campaign.status} />
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {campaign.sentCount.toLocaleString()} sent · {campaign.replyCount.toLocaleString()} replied
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <RelativeTime date={campaign.createdAt} />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
