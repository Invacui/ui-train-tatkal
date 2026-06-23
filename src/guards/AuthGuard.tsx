/**
 * @file AuthGuard
 * @description Route guard that redirects unauthenticated users to the login page,
 *   and redirects users who haven't completed onboarding to the onboarding page.
 *   Preserves the intended URL as a redirect param.
 *
 *   IMPORTANT: For agents, onboarding completion is stored on the Agent document,
 *   NOT the User document. The User document's onboardingCompleted is never set
 *   to true after agent onboarding — only the Agent doc's is. So for agents we
 *   check agent.onboardingCompleted from the Redux store, which gets populated
 *   by useAgentProfile() inside AgentSidebar or OnboardingCarousel.
 * @module guards
 */

// React Router navigation and location hooks
import { Navigate, useLocation } from 'react-router-dom';
// Typed Redux selector hook
import { useAppSelector } from '@/store/hooks';
// Auth state selectors — we need selectAgent for agent users because their
// onboarding status lives on the Agent document, not the User document
import { selectIsAuthenticated, selectUser, selectAgent } from '@/store/auth.slice';
// Route path constants
import { ROUTES } from '@/constants/routes';

/** Props for AuthGuard */
interface AuthGuardProps {
  /** Content to render when authenticated and fully onboarded */
  children: React.ReactNode;
}

/**
 * AuthGuard
 * @description Protects routes that require authentication and completed onboarding.
 *   - Not authenticated → redirect to login with ?redirect param
 *   - User with onboarding not completed → redirect to onboarding page.
 *     For agents, checks agent.onboardingCompleted (Agent doc) instead of
 *     user.onboardingCompleted (User doc), because the User doc never gets
 *     that flag set to true for agents.
 *   - Otherwise → render children
 * @param props.children - The protected content
 * @returns The children if access is granted, otherwise a Navigate redirect
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const agent = useAppSelector(selectAgent);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${ROUTES.login}?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // Determine onboarding completion status.
  // For agents: the Agent document is the source of truth (user doc never gets set).
  // For customers: use the User document.
  const onboardingCompleted =
    user?.role === 'agent'
      ? agent?.onboardingCompleted ?? false  // null/undefined = not yet fetched = assume not complete
      : user?.onboardingCompleted ?? false;

  // Users who haven't completed onboarding should be sent to the appropriate onboarding page
  if (!onboardingCompleted) {
    // Allow access to onboarding pages without redirect
    const allowedPaths = [ROUTES.onboarding, ROUTES.agent.onboard, ROUTES.agent.onboarding];
    if (!allowedPaths.includes(location.pathname)) {
      // Agents go to agent onboarding, everyone else goes to customer onboarding
      const targetPath = user?.role === 'agent' ? ROUTES.agent.onboarding : ROUTES.onboarding;
      return <Navigate to={targetPath} replace />;
    }
  }

  return <>{children}</>;
}
