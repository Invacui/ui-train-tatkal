import { Outlet } from 'react-router-dom';
import { AuthGuard } from '@/guards/AuthGuard';
import { RoleGuard } from '@/guards/RoleGuard';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { DashboardTopbar } from '@/components/layout/DashboardTopbar';

export default function AdminLayout() {
  return (
    <AuthGuard>
      <RoleGuard role="ADMIN">
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardTopbar />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
