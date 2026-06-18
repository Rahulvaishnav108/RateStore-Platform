import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { QUERY_KEYS, API_ENDPOINTS } from '@/config/constants';
import type { OwnerDashboardData } from '@/types';

export function useOwnerDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.OWNER,
    queryFn: async (): Promise<OwnerDashboardData | null> => {
      const response = await api.get(`${API_ENDPOINTS.OWNER}/dashboard`);
      return response.data.data;
    },
  });
}
