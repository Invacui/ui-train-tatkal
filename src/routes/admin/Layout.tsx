/**
 * @file Admin layout wrapper
 * @module routes/admin/Layout
 * @description Provides the admin section shell with admin sidebar, top bar,
 *   and both AuthGuard and RoleGuard to ensure the user is an admin.
 */

// React Router outlet for nested admin routes
import { Outlet } from 'react-router-dom';

// Redirects unauthenticated users to login
import { AuthGuard } from '@/guards/AuthGuard';

// Restricts access to users with the "admin" role
import { RoleGuard } from '@/guards/RoleGuard';

// Admin-specific sidebar with navigation links
import { AdminSidebar } from '@/components/layout/AdminSidebar';

// Dashboard top bar with user menu
import { DashboardTopbar } from '@/components/layout/DashboardTopbar';

/**
 * AdminLayout (layout component)
 * @description Renders the admin dashboard shell with AuthGuard, RoleGuard,
 *   admin sidebar, top bar, and an Outlet for nested admin routes.
 */
export default function AdminLayout() {
  return (
    <AuthGuard>
      <RoleGuard role="admin">
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
