/**
 * @file GuestGuard
 * @description Route guard that redirects authenticated users away from guest-only pages (login, signup, forgot-password, etc.)
 * @module guards
 */

// React Router navigation hooks
import { Navigate } from 'react-router-dom';
// Typed Redux selector hook
import { useAppSelector } from '@/store/hooks';
// Auth state selector
import { selectIsAuthenticated } from '@/store/auth.slice';
// Route path constants
import { ROUTES } from '@/constants/routes';

/** Props for GuestGuard */
interface GuestGuardProps {
  /** Content to render when not authenticated */
  children: React.ReactNode;
}

/**
 * GuestGuard
 * @description Protects guest-only routes (login, signup, etc.). If the user is already
 *   authenticated, redirects to their role-appropriate dashboard.
 * @param props.children - The guest-only content
 * @returns The children if guest, otherwise a Navigate redirect
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}
