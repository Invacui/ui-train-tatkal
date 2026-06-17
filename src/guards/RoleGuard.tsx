/**
 * @file RoleGuard
 * @description Route guard that restricts access to users with a specific role, redirecting mismatched users to their role-appropriate dashboard
 * @module guards
 */

// React Router navigation
import { Navigate } from 'react-router-dom';
// Typed Redux selector hook
import { useAppSelector } from '@/store/hooks';
// User data selector
import { selectUser } from '@/store/auth.slice';
// Route path constants
import { ROUTES } from '@/constants/routes';
// User role type definition
import type { UserRole } from '@/types/auth.types';

/** Props for RoleGuard */
interface RoleGuardProps {
  /** Required role to access the protected content */
  role: UserRole;
  /** Content to render when the user has the required role */
  children: React.ReactNode;
}

/**
 * RoleGuard
 * @description Protects routes by requiring a specific user role. If the user's role does not match,
 *   redirects them to their role-appropriate dashboard (admin -> admin root, agent -> agent root, customer -> dashboard).
 * @param props.role - The role required to view the content
 * @param props.children - The role-protected content
 * @returns The children if role matches, otherwise a Navigate redirect
 */
export function RoleGuard({ role, children }: RoleGuardProps) {
  const user = useAppSelector(selectUser);

  if (user?.role !== role) {
    // Redirect to the user's appropriate dashboard based on their role
    if (user?.role === 'admin') return <Navigate to={ROUTES.admin.root} replace />;
    if (user?.role === 'agent') return <Navigate to={ROUTES.agent.root} replace />;
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}
