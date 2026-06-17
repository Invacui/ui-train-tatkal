/**
 * @file Agent layout wrapper
 * @module routes/agent/Layout
 * @description Provides the agent section shell with sidebar, top bar, and
 *   both AuthGuard and RoleGuard to ensure the user is authenticated as an agent.
 */

// React Router outlet for nested agent routes
import { Outlet } from 'react-router-dom';

// Redirects unauthenticated users to login
import { AuthGuard } from '@/guards/AuthGuard';

// Restricts access to users with the "agent" role
import { RoleGuard } from '@/guards/RoleGuard';

// Dashboard sidebar with navigation links
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

// Dashboard top bar with user menu
import { DashboardTopbar } from '@/components/layout/DashboardTopbar';

/**
 * AgentLayout (layout component)
 * @description Renders the agent dashboard shell with AuthGuard, RoleGuard,
 *   sidebar, top bar, and an Outlet for nested agent routes.
 */
export default function AgentLayout() {
  return (
    <AuthGuard>
      <RoleGuard role="agent">
        <div className="flex h-screen overflow-hidden">
          <DashboardSidebar />
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
