
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  failed_login_attempts: number;
  locked_until: string | null;
  two_factor_enabled: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithRoles extends User {
  user_roles: Array<{
    id: string;
    role: {
      id: string;
      name: string;
      description: string | null;
    };
  }>;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // First get all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Then get user roles for each user
      const usersWithRoles = await Promise.all(
        (users || []).map(async (user) => {
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select(`
              id,
              role:roles(id, name, description)
            `)
            .eq('user_id', user.id);

          if (rolesError) {
            console.error('Error fetching roles for user:', user.id, rolesError);
            return { ...user, user_roles: [] };
          }

          return { ...user, user_roles: userRoles || [] };
        })
      );

      return usersWithRoles;
    },
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      // Get user details
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Get user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          id,
          role:roles(*)
        `)
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching roles for user:', userId, rolesError);
        return { ...user, user_roles: [] };
      }

      return { ...user, user_roles: userRoles || [] };
    },
    enabled: !!userId,
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: User['status'] }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
