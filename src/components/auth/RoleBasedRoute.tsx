
import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';
import { useHasRole } from '@/hooks/useCurrentUserRoles';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/dashboard'
}) => {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has any of the required roles
  const hasRequiredRole = allowedRoles.some(role => {
    const { hasRole, isLoading } = useHasRole(role);
    return !isLoading && hasRole;
  });

  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
