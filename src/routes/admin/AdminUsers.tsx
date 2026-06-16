import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { UserTable } from '@/components/admin/UserTable';
import { ErrorState } from '@/components/common/ErrorState';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import { ROUTES } from '@/constants/routes';
import type { AdminUser } from '@/types/admin.types';

export default function AdminUsers() {
  const { data, isLoading, isError, error, refetch } = useAdminUsers();
  const navigate = useNavigate();

  if (isError) return <ErrorState message={error?.message} onRetry={() => void refetch()} />;

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Users" description="Manage platform users." />
        <UserTable
          data={data ?? []}
          isLoading={isLoading}
          onRowClick={(user: AdminUser) => navigate(ROUTES.admin.user(user.id))}
        />
      </div>
    </>
  );
}
