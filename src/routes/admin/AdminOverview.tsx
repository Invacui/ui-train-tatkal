import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/common/PageHeader';
import { PlatformStatsGrid } from '@/components/admin/PlatformStatsGrid';
import { useAdminStats } from '@/hooks/admin/useAdminStats';

export default function AdminOverview() {
  const { data, isLoading } = useAdminStats();

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Admin Overview" description="Platform-wide statistics." />
        <PlatformStatsGrid stats={data} isLoading={isLoading} />
      </div>
    </>
  );
}
