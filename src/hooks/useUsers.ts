
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
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_roles(
            id,
            role:roles(id, name, description)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_roles(
            id,
            role:roles(*)
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
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
