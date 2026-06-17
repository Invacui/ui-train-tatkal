/**
 * @file User Table component
 * @module components/admin/UserTable
 * @description Admin table listing users with their name, email, role,
 *   token balance, active status, and join date. Supports optional row
 *   click handler and wraps the common DataTable component.
 */

// TanStack React Table column type
import type { ColumnDef } from '@tanstack/react-table';

// Common data table component
import { DataTable } from '@/components/common/DataTable';

// Shadcn badge for role/status display
import { Badge } from '@/components/ui/badge';

// Common token badge for balance display
import { TokenBadge } from '@/components/common/TokenBadge';

// Common relative time for date display
import { RelativeTime } from '@/components/common/RelativeTime';

// Admin user type
import type { AdminUser } from '@/types/admin.types';

interface UserTableProps {
  /** Array of admin users to display */
  data: AdminUser[];
  /** When true, shows loading skeleton */
  isLoading?: boolean | undefined;
  /** Optional callback when a user row is clicked */
  onRowClick?: (user: AdminUser) => void;
}

/**
 * UserTable
 * @description Renders a data table of admin users with columns for name,
 *   email, role, token balance, status, and join date. Supports optional
 *   row click navigation.
 * @param props UserTableProps
 * @returns A data table of admin users
 */
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
