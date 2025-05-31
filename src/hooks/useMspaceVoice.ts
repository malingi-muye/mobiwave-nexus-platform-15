
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCallRequest {
  recipients: string[];
  voice_file_url?: string;
  text_to_speech?: string;
  voice_id?: string;
  callback_url?: string;
}

interface VoiceCallResponse {
  success: boolean;
  message: string;
  data?: {
    call_ids: string[];
    cost: number;
  };
  error?: string;
}

export const useMspaceVoice = () => {
  const makeVoiceCall = useMutation({
    mutationFn: async (data: VoiceCallRequest): Promise<VoiceCallResponse> => {
      console.log('Making voice call via Mspace API:', data);
      
      const { data: response, error } = await supabase.functions.invoke('mspace-voice', {
        body: { 
          action: 'make_call',
          ...data
        }
      });

      if (error) throw error;
      if (!response.success) throw new Error(response.error || 'Failed to make voice call');

      return response;
    },
  });

  const getCallHistory = useQuery({
    queryKey: ['voice-call-history'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('mspace-voice', {
        body: { action: 'get_call_history' }
      });

      if (error) throw error;
      return data.calls || [];
    },
  });

  return {
    makeVoiceCall,
    getCallHistory
  };
};
