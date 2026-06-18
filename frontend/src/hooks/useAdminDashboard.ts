import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { QUERY_KEYS, API_ENDPOINTS } from '@/config/constants';
import type { AdminDashboardStats } from '@/types';

export function useAdminDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: async (): Promise<AdminDashboardStats> => {
      const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD);
      return response.data.data;
    },
  });
}
