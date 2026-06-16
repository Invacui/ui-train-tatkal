import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { TemplatePreviewCard } from '@/components/templates/TemplatePreviewCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useTemplates } from '@/hooks/templates/useTemplates';
import { ROUTES } from '@/constants/routes';

export default function TemplatesList() {
  const { data, isLoading, isError, error, refetch } = useTemplates();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState message={error?.message} onRetry={() => void refetch()} />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Templates" description="Build and manage your message templates.">
          <Button asChild>
            <Link to={ROUTES.templateNew}>New template</Link>
          </Button>
        </PageHeader>

        {!data?.length ? (
          <EmptyState title="No templates yet" description="Create your first template to start a campaign.">
            <Button asChild><Link to={ROUTES.templateNew}>New template</Link></Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((t) => <TemplatePreviewCard key={t.id} template={t} />)}
          </div>
        )}
      </div>
    </>
  );
}
