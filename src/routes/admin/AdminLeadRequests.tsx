import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

export default function AdminLeadRequests() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'lead-requests'],
    queryFn: adminService.listLeadRequests,
    select: (res) => res.data.data as Array<{
      id: string;
      name: string;
      status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
      totalLeads: number;
    }>,
  });

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Lead Requests" description="All lead uploads across the platform." />
        <DataTable
          columns={[
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'totalLeads', header: 'Leads' },
            {
              accessorKey: 'status',
              header: 'Status',
              cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
          ]}
          data={data ?? []}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
