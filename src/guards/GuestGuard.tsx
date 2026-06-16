import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/auth.slice';
import { ROUTES } from '@/constants/routes';
import { useLocation } from 'react-router-dom';

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const allowWhenAuthenticated = [ROUTES.verifyEmailOtp, ROUTES.selectPlan];
  const isAllowedPath = allowWhenAuthenticated.includes(location.pathname as typeof ROUTES.verifyEmailOtp);

  if (isAuthenticated && !isAllowedPath) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}
