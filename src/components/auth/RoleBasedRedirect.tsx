
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentUserRoles } from '@/hooks/useCurrentUserRoles';
import { useAuth } from './AuthProvider';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

export const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: roles = [], isLoading: rolesLoading } = useCurrentUserRoles();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authLoading || rolesLoading || !user) return;

    const hasAdminRole = roles.some(userRole => 
      userRole.role?.name === 'admin' || userRole.role?.name === 'super_admin'
    );

    const currentPath = location.pathname;

    // If user has admin role and is on client dashboard, redirect to admin
    if (hasAdminRole && currentPath === '/dashboard') {
      navigate('/admin', { replace: true });
      return;
    }

    // If user doesn't have admin role and is on admin routes, redirect to client dashboard
    if (!hasAdminRole && currentPath.startsWith('/admin')) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // If user is on root auth-required pages, redirect based on role
    if (currentPath === '/' && user) {
      if (hasAdminRole) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, roles, authLoading, rolesLoading, navigate, location.pathname]);

  if (authLoading || rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
