import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '@/redux/hook';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      const roleRoutes: Record<UserRole, string> = {
        user: '/dashboard/user',
        agent: '/dashboard/agent',
        admin: '/dashboard/admin',
      };
      navigate(roleRoutes[user.role]);
    }
  }, [isAuthenticated, user, allowedRoles, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
