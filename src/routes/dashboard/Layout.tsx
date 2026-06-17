/**
 * @file Dashboard layout wrapper
 * @module routes/dashboard/Layout
 * @description Provides the dashboard shell with sidebar navigation, top bar,
 *   and an AuthGuard to ensure the user is authenticated.
 */

// React Router outlet for nested dashboard routes
import { Outlet } from 'react-router-dom';

// Redirects unauthenticated users to login
import { AuthGuard } from '@/guards/AuthGuard';

// Dashboard sidebar with navigation links
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

// Dashboard top bar with user menu and search
import { DashboardTopbar } from '@/components/layout/DashboardTopbar';

/**
 * DashboardLayout (layout component)
 * @description Renders the dashboard shell with AuthGuard, sidebar, top bar,
 *   and an Outlet for nested dashboard routes.
 */
export default function DashboardLayout() {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardTopbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
