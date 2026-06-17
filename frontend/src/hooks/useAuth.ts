import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/services/api';
import { QUERY_KEYS, LOCAL_STORAGE_KEYS, API_ENDPOINTS } from '@/config/constants';
import type { User, LoginCredentials, RegisterData, AuthResponse, ChangePasswordData } from '@/types';

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user from cache or localStorage
  const { data: user, isLoading } = useQuery({
    queryKey: QUERY_KEYS.AUTH,
    queryFn: async (): Promise<User | null> => {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      if (!savedUser) return null;
      
      try {
        // Verify token is still valid by fetching user data
        const response = await api.get(API_ENDPOINTS.AUTH.ME);
        return response.data.data;
      } catch {
        // Token expired, clear storage
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
        return null;
      }
    },
    staleTime: Infinity, // User data doesn't go stale
    initialData: () => {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      return savedUser ? JSON.parse(savedUser) : null;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(data.user));
      queryClient.setQueryData(QUERY_KEYS.AUTH, data.user);
      toast.success('Welcome back!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData): Promise<AuthResponse> => {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(data.user));
      queryClient.setQueryData(QUERY_KEYS.AUTH, data.user);
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (passwords: ChangePasswordData) => {
      const response = await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwords);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    queryClient.setQueryData(QUERY_KEYS.AUTH, null);
    queryClient.clear(); // Clear all cached data
    toast.success('Logged out successfully');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    logout,
  };
}