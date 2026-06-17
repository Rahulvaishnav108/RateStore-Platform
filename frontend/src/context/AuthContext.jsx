import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Query to get current user
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        const response = await api.get('/auth/me');
        return response.data.data;
      } catch (error) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    },
    staleTime: Infinity,
    enabled: !!localStorage.getItem('token'),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      return data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      queryClient.setQueryData(['auth', 'user'], data.user);
      toast.success('Welcome back!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.post('/auth/register', userData);
      return data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      queryClient.setQueryData(['auth', 'user'], data.user);
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwords) => {
      const { data } = await api.put('/auth/change-password', passwords);
      return data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  // Update user state when query data changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ 
      user: user || currentUser,
      loading: isLoading,
      login: loginMutation.mutate,
      isLoggingIn: loginMutation.isPending,
      register: registerMutation.mutate,
      isRegistering: registerMutation.isPending,
      changePassword: changePasswordMutation.mutate,
      isChangingPassword: changePasswordMutation.isPending,
      logout,
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
