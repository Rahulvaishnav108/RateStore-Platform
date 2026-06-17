import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/services/api';
import { QUERY_KEYS, API_ENDPOINTS } from '@/config/constants';
import type { User, PaginatedResponse, QueryFilters, SortOptions, PaginationOptions } from '@/types';

interface UseUsersOptions extends PaginationOptions, SortOptions {
  filters?: QueryFilters;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  address?: string;
  role: string;
}

export function useUsers(options: UseUsersOptions) {
  const { page, limit, sortBy, sortOrder, filters = {} } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.USERS, { page, limit, sortBy, sortOrder, filters }],
    queryFn: async (): Promise<PaginatedResponse<User>> => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
      );
      
      const response = await api.get(API_ENDPOINTS.ADMIN.USERS, {
        params: { page, limit, sortBy, sortOrder, ...cleanFilters },
      });
      return response.data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserData): Promise<User> => {
      const response = await api.post(API_ENDPOINTS.ADMIN.USERS, userData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to create user');
      }
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...userData }: { id: number } & Partial<CreateUserData>): Promise<User> => {
      const response = await api.put(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, userData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
}