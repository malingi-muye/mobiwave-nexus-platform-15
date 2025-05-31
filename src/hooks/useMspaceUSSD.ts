
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface USSDRequest {
  recipients: string[];
  message: string;
  service_code?: string;
  session_id?: string;
  menu_level?: number;
}

interface USSDResponse {
  success: boolean;
  message: string;
  data?: {
    session_id: string;
    menu_level: number;
    response_message: string;
  };
  error?: string;
}

export const useMspaceUSSD = () => {
  const sendUSSD = useMutation({
    mutationFn: async (data: USSDRequest): Promise<USSDResponse> => {
      console.log('Sending USSD via Mspace API:', data);
      
      const { data: response, error } = await supabase.functions.invoke('mspace-ussd', {
        body: { 
          action: 'send_ussd',
          ...data
        }
      });

      if (error) throw error;
      if (!response.success) throw new Error(response.error || 'Failed to send USSD');

      return response;
    },
  });

  const getUSSDSessions = useQuery({
    queryKey: ['ussd-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('mspace-ussd', {
        body: { action: 'get_sessions' }
      });

      if (error) throw error;
      return data.sessions || [];
    },
  });

  return {
    sendUSSD,
    getUSSDSessions
  };
};
