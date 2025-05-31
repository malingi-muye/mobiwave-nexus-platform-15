
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface UserRole {
  id: string;
  role: {
    id: string;
    name: string;
    description: string | null;
  };
}

export const useCurrentUserRoles = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['current-user-roles', user?.id],
    queryFn: async (): Promise<UserRole[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          role:roles(
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id)
        .is('expires_at', null);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useHasRole = (roleName: string) => {
  const { data: roles = [], isLoading } = useCurrentUserRoles();
  
  const hasRole = roles.some(userRole => userRole.role?.name === roleName);
  
  return { hasRole, isLoading };
};
