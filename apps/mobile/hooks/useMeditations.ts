import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Meditation, Category } from '@louharya/shared';

export function useFeaturedMeditations() {
  return useQuery<Meditation[]>({
    queryKey: ['meditations', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/meditations/featured');
      return data.data;
    },
  });
}

export function useMeditations(categoryId?: string) {
  return useQuery<Meditation[]>({
    queryKey: ['meditations', { categoryId }],
    queryFn: async () => {
      const { data } = await api.get('/meditations', {
        params: categoryId ? { category: categoryId } : undefined,
      });
      return data.data.items;
    },
  });
}

export function useMeditation(id: string) {
  return useQuery<Meditation>({
    queryKey: ['meditations', id],
    queryFn: async () => {
      const { data } = await api.get(`/meditations/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data;
    },
  });
}
