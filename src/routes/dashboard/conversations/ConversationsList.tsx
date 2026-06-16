import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RelativeTime } from '@/components/common/RelativeTime';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversations } from '@/hooks/conversations/useConversations';
import { ROUTES } from '@/constants/routes';

export default function ConversationsList() {
  const { data, isLoading, isError, error, refetch } = useConversations();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (isError) return <ErrorState message={error?.message} onRetry={() => void refetch()} />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Conversations" description="Manage AI-generated conversations." />

        {!data?.length ? (
          <EmptyState title="No conversations yet" description="Conversations will appear here once campaigns are live." />
        ) : (
          <div className="flex flex-col gap-3">
            {data.map((conv) => (
              <Link key={conv.id} to={ROUTES.conversation(conv.id)}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">{conv.leadName}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{conv.channel}</Badge>
                      <Badge variant={conv.status === 'OPEN' ? 'default' : 'secondary'}>
                        {conv.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      <RelativeTime date={conv.lastMessageAt} />
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
