import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { QUERY_KEYS, API_ENDPOINTS } from '@/config/constants';

interface CreateRatingData {
  store_id: number;
  rating: number;
}

interface UpdateRatingData {
  rating: number;
}

export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ratingData: CreateRatingData) => {
      const response = await api.post(API_ENDPOINTS.RATINGS, ratingData);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate stores queries to refresh ratings
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORES });
      queryClient.invalidateQueries({ queryKey: ['public-stores'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RATINGS });
      toast.success('Rating submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    },
  });
}

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...ratingData }: { id: number } & UpdateRatingData) => {
      const response = await api.put(`${API_ENDPOINTS.RATINGS}/${id}`, ratingData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORES });
      queryClient.invalidateQueries({ queryKey: ['public-stores'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RATINGS });
      toast.success('Rating updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update rating');
    },
  });
}

export function useDeleteRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${API_ENDPOINTS.RATINGS}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORES });
      queryClient.invalidateQueries({ queryKey: ['public-stores'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RATINGS });
      toast.success('Rating deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete rating');
    },
  });
}