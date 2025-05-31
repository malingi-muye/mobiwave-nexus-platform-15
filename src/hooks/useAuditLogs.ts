
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  session_id: string | null;
  metadata: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'pending';
  created_at: string;
  user?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export const useAuditLogs = (limit = 50) => {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          user:users(email, first_name, last_name)
        `)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateAuditLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logData: {
      action: string;
      resource_type?: string;
      resource_id?: string;
      metadata?: Record<string, any>;
      severity?: AuditLog['severity'];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id || null,
          ...logData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};
