import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth.slice';
import { ROUTES } from '@/constants/routes';

interface RoleGuardProps {
  role: string;
  children: React.ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const user = useAppSelector(selectUser);

  if (user?.role !== role) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}
