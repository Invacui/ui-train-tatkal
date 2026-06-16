import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { TokenBadge } from '@/components/common/TokenBadge';
import { RelativeTime } from '@/components/common/RelativeTime';
import type { AdminUser } from '@/types/admin.types';

interface UserTableProps {
  data: AdminUser[];
  isLoading?: boolean | undefined;
  onRowClick?: (user: AdminUser) => void;
}

export function UserTable({ data, isLoading, onRowClick }: UserTableProps) {
  const columns: ColumnDef<AdminUser>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
    },
    {
      accessorKey: 'tokenBalance',
      header: 'Tokens',
      cell: ({ row }) => <TokenBadge amount={row.original.tokenBalance} />,
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'destructive'}>
          {row.original.isActive ? 'Active' : 'Suspended'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => <RelativeTime date={row.original.createdAt} />,
    },
    ...(onRowClick
      ? [
          {
            id: 'actions',
            header: '',
            cell: ({ row }: { row: { original: AdminUser } }) => (
              <button
                className="text-sm text-primary hover:underline"
                onClick={() => onRowClick(row.original)}
              >
                View
              </button>
            ),
          } satisfies ColumnDef<AdminUser>,
        ]
      : []),
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
