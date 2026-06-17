/**
 * @file Admin users list page
 * @module routes/admin/AdminUsers
 * @description Lists all registered platform users in a table with name, email,
 *   role, status, and booking count. Rows link to user detail.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Navigation to user detail page
import { useNavigate } from 'react-router-dom';

// Table components for user listing
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Status badge for user active/suspended status
import { StatusBadge } from '@/components/common/StatusBadge';

// Custom hook for fetching all users
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';

// Error state component for failed requests
import { ErrorState } from '@/components/common/ErrorState';

// Skeleton placeholder during loading
import { Skeleton } from '@/components/ui/skeleton';

// Route constants for navigation
import { ROUTES } from '@/constants/routes';

// UI button component
import { Button } from '@/components/ui/button';

/**
 * AdminUsers (page component)
 * @description Fetches all users via useAdminUsers hook and renders them in a
 *   table. Clicking a row navigates to the admin user detail page.
 */
export default function AdminUsers() {
  const navigate = useNavigate();
  const { data: users, isLoading, error } = useAdminUsers();

  if (error) return <ErrorState message="Failed to load users" />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Users" description="All registered users" />
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-20" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users?.length ? (
                users.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer" onClick={() => navigate(ROUTES.admin.userDetail(user.id))}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell><StatusBadge status={user.isActive ? 'active' : 'suspended'} /></TableCell>
                    <TableCell>{(user as any).totalBookings ?? 0}</TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
