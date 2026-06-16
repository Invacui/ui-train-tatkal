import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { ConversationThread } from '@/components/conversations/ConversationThread';
import { ManualReplyForm } from '@/components/conversations/ManualReplyForm';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversation } from '@/hooks/conversations/useConversation';

export default function ConversationDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useConversation(id);

  if (isLoading) return <Skeleton className="h-96 w-full rounded-lg" />;
  if (isError) return <ErrorState message={error?.message} />;
  if (!data) return null;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <ConversationThread conversation={data} />
        {data.status === 'OPEN' && (
          <ManualReplyForm
            conversationId={id}
            defaultChannel={data.channel}
          />
        )}
      </div>
    </>
  );
}
