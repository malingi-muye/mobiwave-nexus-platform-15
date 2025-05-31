
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AirtimeRequest {
  phone_number: string;
  amount: number;
  network: 'safaricom' | 'airtel' | 'telkom';
  reference?: string;
}

interface AirtimeResponse {
  success: boolean;
  message: string;
  data?: {
    transaction_id: string;
    status: string;
    amount: number;
    phone_number: string;
  };
  error?: string;
}

export const useMspaceAirtime = () => {
  const sendAirtime = useMutation({
    mutationFn: async (data: AirtimeRequest): Promise<AirtimeResponse> => {
      console.log('Sending airtime via Mspace API:', data);
      
      const { data: response, error } = await supabase.functions.invoke('mspace-airtime', {
        body: { 
          action: 'send_airtime',
          ...data
        }
      });

      if (error) throw error;
      if (!response.success) throw new Error(response.error || 'Failed to send airtime');

      return response;
    },
  });

  const getAirtimeHistory = useQuery({
    queryKey: ['airtime-history'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('mspace-airtime', {
        body: { action: 'get_history' }
      });

      if (error) throw error;
      return data.transactions || [];
    },
  });

  return {
    sendAirtime,
    getAirtimeHistory
  };
};
