import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DataTable } from '@/components/common/DataTable';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useLeadRequest } from '@/hooks/leads/useLeadRequest';
import { useLeads } from '@/hooks/leads/useLeads';
import type { Lead } from '@/types/leads.types';

const leadColumns: ColumnDef<Lead>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'company', header: 'Company' },
  { accessorKey: 'industry', header: 'Industry' },
];

export default function LeadDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: request, isLoading, isError, error } = useLeadRequest(id);
  const { data: leads, isLoading: leadsLoading } = useLeads(id);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (isError) return <ErrorState message={error?.message} />;
  if (!request) return null;

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-6">
        <PageHeader title={request.name} description={request.fileName}>
          <StatusBadge status={request.status} />
        </PageHeader>

        <div>
          <h2 className="mb-4 font-semibold">
            Leads ({request.totalLeads ? request.totalLeads.toLocaleString() : '0'})
          </h2>
          <DataTable columns={leadColumns} data={leads?.data ?? []} isLoading={leadsLoading} />
        </div>
      </div>
    </>
  );
}
