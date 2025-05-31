
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MspaceBalance {
  currency: string;
  balance: string;
}

interface SendSMSRequest {
  recipients: string[];
  message: string;
  sender_id: string;
  campaign_id?: string;
  scheduled_time?: string;
}

interface SendSMSResponse {
  success: boolean;
  message: string;
  data?: {
    message_ids: string[];
    sent_count: number;
    failed_count: number;
    cost: number;
  };
  error?: string;
}

interface DeliveryReport {
  message_id: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  delivered_at?: string;
  failed_reason?: string;
}

export const useMspaceApi = () => {
  const checkBalance = useQuery({
    queryKey: ['mspace-balance'],
    queryFn: async (): Promise<MspaceBalance> => {
      const { data, error } = await supabase.functions.invoke('mspace-sms', {
        body: { action: 'check_balance' }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to check balance');

      return {
        currency: data.data.currency,
        balance: data.data.balance
      };
    },
  });

  const sendSMS = useMutation({
    mutationFn: async (data: SendSMSRequest): Promise<SendSMSResponse> => {
      console.log('Sending SMS via Mspace API:', data);
      
      const { data: response, error } = await supabase.functions.invoke('mspace-sms', {
        body: { 
          action: 'send_sms',
          ...data
        }
      });

      if (error) throw error;
      if (!response.success) throw new Error(response.error || 'Failed to send SMS');

      return response;
    },
  });

  const getDeliveryReports = useMutation({
    mutationFn: async (messageIds: string[]): Promise<DeliveryReport[]> => {
      const { data, error } = await supabase.functions.invoke('mspace-sms', {
        body: { 
          action: 'get_delivery_reports',
          message_ids: messageIds
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to get delivery reports');

      return data.reports;
    },
  });

  return {
    checkBalance,
    sendSMS,
    getDeliveryReports
  };
};
