
import { useMutation, useQuery } from '@tanstack/react-query';

interface MspaceBalance {
  currency: string;
  balance: string;
}

interface SendSMSRequest {
  recipients: string[];
  message: string;
  sender_id: string;
  campaign_id?: string;
}

export const useMspaceApi = () => {
  const checkBalance = useQuery({
    queryKey: ['mspace-balance'],
    queryFn: async (): Promise<MspaceBalance> => {
      // Mock data for now - this would typically call an edge function
      return {
        currency: 'KES',
        balance: '1,250.00'
      };
    },
  });

  const sendSMS = useMutation({
    mutationFn: async (data: SendSMSRequest) => {
      // Mock implementation - this would typically call an edge function
      console.log('Sending SMS via Mspace:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message_ids: data.recipients.map(() => `msg_${Date.now()}_${Math.random()}`),
        sent_count: data.recipients.length
      };
    },
  });

  return {
    checkBalance,
    sendSMS
  };
};
