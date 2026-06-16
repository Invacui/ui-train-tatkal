import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RelativeTime } from '@/components/common/RelativeTime';
import type { CampaignLog } from '@/types/campaigns.types';

const columns: ColumnDef<CampaignLog>[] = [
  { accessorKey: 'leadName', header: 'Lead' },
  { accessorKey: 'leadEmail', header: 'Email' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'sentAt',
    header: 'Sent',
    cell: ({ row }) => <RelativeTime date={row.original.sentAt} />,
  },
];

interface CampaignLogTableProps {
  data: CampaignLog[];
  isLoading?: boolean;
}

export function CampaignLogTable({ data, isLoading }: CampaignLogTableProps) {
  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
