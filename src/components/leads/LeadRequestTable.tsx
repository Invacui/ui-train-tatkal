import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RelativeTime } from '@/components/common/RelativeTime';
import type { LeadRequest } from '@/types/leads.types';

const columns: ColumnDef<LeadRequest>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'fileName', header: 'File' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  { accessorKey: 'totalLeads', header: 'Leads' },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => <RelativeTime date={row.original.createdAt} />,
  },
];

interface LeadRequestTableProps {
  data: LeadRequest[];
  isLoading?: boolean;
}

export function LeadRequestTable({ data, isLoading }: LeadRequestTableProps) {
  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
