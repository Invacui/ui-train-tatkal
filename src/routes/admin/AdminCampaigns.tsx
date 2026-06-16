import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RelativeTime } from '@/components/common/RelativeTime';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { ROUTES } from '@/constants/routes';
import type { Campaign } from '@/types/campaigns.types';

export default function AdminCampaigns() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'campaigns'],
    queryFn: adminService.listCampaigns,
    select: (res) => res.data.data as Campaign[],
  });

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Campaigns" description="All campaigns across the platform." />
        <DataTable
          columns={[
            {
              accessorKey: 'name',
              header: 'Name',
              cell: ({ row }) => (
                <Link
                  to={ROUTES.campaign(row.original.id)}
                  className="font-medium hover:underline"
                >
                  {row.original.name}
                </Link>
              ),
            },
            {
              accessorKey: 'status',
              header: 'Status',
              cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
            { accessorKey: 'sentCount', header: 'Sent' },
            {
              accessorKey: 'createdAt',
              header: 'Created',
              cell: ({ row }) => <RelativeTime date={row.original.createdAt} />,
            },
          ]}
          data={data ?? []}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
