import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth.slice';
import { ROUTES } from '@/constants/routes';

export default function Overview() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-6">
        <PageHeader
          title={`Welcome back, ${user?.name ?? 'there'}!`}
          description="Here's what's happening with your campaigns."
        >
          <Button asChild>
            <Link to={ROUTES.leadUpload}>Upload leads</Link>
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Lead lists</p>
            <p className="mt-1 text-2xl font-bold">—</p>
            <Button variant="link" className="mt-2 px-0" asChild>
              <Link to={ROUTES.leads}>View all →</Link>
            </Button>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Active campaigns</p>
            <p className="mt-1 text-2xl font-bold">—</p>
            <Button variant="link" className="mt-2 px-0" asChild>
              <Link to={ROUTES.campaigns}>View all →</Link>
            </Button>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Open conversations</p>
            <p className="mt-1 text-2xl font-bold">—</p>
            <Button variant="link" className="mt-2 px-0" asChild>
              <Link to={ROUTES.conversations}>View all →</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
