/**
 * @file Agent layout wrapper
 * @module routes/agent/Layout
 * @description Provides the agent section shell with agent-specific sidebar,
 *   top bar, and both AuthGuard and RoleGuard to ensure the user is
 *   authenticated as an agent.
 *
 *   On mount, fetches the full Agent profile from /agents/profile and syncs
 *   it into both the agent and user Redux stores (emailVerified,
 *   onboardingCompleted) so no /auth/me calls are needed on every page.
 */

// React Router outlet for nested agent routes
import { Outlet } from 'react-router-dom';

// Redirects unauthenticated users to login
import { AuthGuard } from '@/guards/AuthGuard';

// Restricts access to users with the "agent" role
import { RoleGuard } from '@/guards/RoleGuard';

// Agent-specific sidebar with navigation links
import { AgentSidebar } from '@/components/layout/AgentSidebar';

// Agent-specific top bar with user menu
import { AgentTopbar } from '@/components/layout/AgentTopbar';

// Tooltip provider for sidebar tooltips in collapsed state
import { TooltipProvider } from '@/components/ui/tooltip';

// Fetches the agent profile and syncs to Redux store
import { useRefreshAgentProfile } from '@/hooks/agents/useRefreshAgentProfile';

/**
 * AgentLayout (layout component)
 * @description Renders the agent dashboard shell with AuthGuard, RoleGuard,
 *   agent-specific sidebar, top bar, and an Outlet for nested agent routes.
 *
 *   On every render, useRefreshAgentProfile ensures the Redux store has the
 *   latest agent data (via /agents/profile) — only one network call thanks
 *   to React Query's 2-minute staleTime.
 */
export default function AgentLayout() {
  // Fetch agent profile on every mount and sync into Redux store.
  // staleTime: 2min prevents unnecessary network calls on navigation.
  useRefreshAgentProfile(true);

  return (
    <AuthGuard>
      <RoleGuard role="agent">
        <TooltipProvider>
          <div className="flex h-screen overflow-hidden">
            <AgentSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <AgentTopbar />
              <main className="flex-1 overflow-y-auto p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </TooltipProvider>
      </RoleGuard>
    </AuthGuard>
  );
}
