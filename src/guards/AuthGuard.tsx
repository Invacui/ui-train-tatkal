/**
 * @file AuthGuard
 * @description Route guard that redirects unauthenticated users to the login page,
 *   and redirects Google-authenticated users who haven't completed onboarding
 *   to the onboarding page. Preserves the intended URL as a redirect param.
 * @module guards
 */

// React Router navigation and location hooks
import { Navigate, useLocation } from 'react-router-dom';
// Typed Redux selector hook
import { useAppSelector } from '@/store/hooks';
// Auth state selectors
import { selectIsAuthenticated, selectUser } from '@/store/auth.slice';
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
 *   - Google user with onboarding not completed → redirect to /onboarding
 *   - Otherwise → render children
 * @param props.children - The protected content
 * @returns The children if access is granted, otherwise a Navigate redirect
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${ROUTES.login}?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // Google users who haven't completed onboarding should be sent to onboarding
  if (user && !user.onboardingCompleted && location.pathname !== ROUTES.onboarding) {
    return <Navigate to={ROUTES.onboarding} replace />;
  }

  return <>{children}</>;
}
