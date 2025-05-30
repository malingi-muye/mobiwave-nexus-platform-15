
import { useQuery } from '@tanstack/react-query';

// Mock user credits data since this table doesn't exist yet
export interface UserCredits {
  credits_remaining: number;
  credits_used: number;
  total_credits: number;
}

export const useUserCredits = () => {
  return useQuery({
    queryKey: ['user-credits'],
    queryFn: async (): Promise<UserCredits> => {
      // Return mock data for now - this would typically come from Supabase
      return {
        credits_remaining: 500.00,
        credits_used: 150.00,
        total_credits: 650.00
      };
    },
  });
};
