import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/services/api';
import { QUERY_KEYS, API_ENDPOINTS } from '@/config/constants';
import type { Store, PaginatedResponse, QueryFilters, SortOptions, PaginationOptions } from '@/types';

interface UseStoresOptions extends PaginationOptions, SortOptions {
  filters?: QueryFilters;
}

interface CreateStoreData {
  name: string;
  email: string;
  address?: string;
  owner_id?: number;
}

export function useStores(options: UseStoresOptions) {
  const { page, limit, sortBy, sortOrder, filters = {} } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.STORES, { page, limit, sortBy, sortOrder, filters }],
    queryFn: async (): Promise<PaginatedResponse<Store>> => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
      );
      
      const response = await api.get(API_ENDPOINTS.ADMIN.STORES, {
        params: { page, limit, sortBy, sortOrder, ...cleanFilters },
      });
      return response.data;
    },
  });
}

export function usePublicStores(options: UseStoresOptions) {
  const { page, limit, sortBy, sortOrder, filters = {} } = options;

  return useQuery({
    queryKey: ['public-stores', { page, limit, sortBy, sortOrder, filters }],
    queryFn: async (): Promise<PaginatedResponse<Store>> => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
      );
      
      const response = await api.get(API_ENDPOINTS.STORES, {
        params: { page, limit, sortBy, sortOrder, ...cleanFilters },
      });
      return response.data;
    },
  });
}

export function useStoreOwners() {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, { role: 'store_owner' }],
    queryFn: async (): Promise<{ data: any[] }> => {
      const response = await api.get(API_ENDPOINTS.ADMIN.USERS, {
        params: { role: 'store_owner', limit: 100 },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeData: CreateStoreData): Promise<Store> => {
      const response = await api.post(API_ENDPOINTS.ADMIN.STORES, {
        ...storeData,
        owner_id: storeData.owner_id || undefined,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORES });
      queryClient.invalidateQueries({ queryKey: ['public-stores'] });
      toast.success('Store created successfully');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to create store');
      }
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...storeData }: { id: number } & Partial<CreateStoreData>): Promise<Store> => {
      const response = await api.put(`${API_ENDPOINTS.ADMIN.STORES}/${id}`, storeData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORES });
      queryClient.invalidateQueries({ queryKey: ['public-stores'] });
      toast.success('Store updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update store');
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`${API_ENDPOINTS.ADMIN.STORES}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORES });
      queryClient.invalidateQueries({ queryKey: ['public-stores'] });
      toast.success('Store deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete store');
    },
  });
}