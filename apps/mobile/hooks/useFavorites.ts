import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Meditation } from '@louharya/shared';

export function useFavorites() {
  return useQuery<Meditation[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/favorites');
      return data.data;
    },
  });
}

export function useIsFavorite(meditationId: string) {
  const { data: favorites } = useFavorites();
  return favorites?.some((m) => m.id === meditationId) ?? false;
}

export function useToggleFavorite(meditationId: string) {
  const queryClient = useQueryClient();
  const isFavorite = useIsFavorite(meditationId);

  const add = useMutation({
    mutationFn: () => api.post(`/users/me/favorites/${meditationId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/users/me/favorites/${meditationId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  return {
    isFavorite,
    toggle: () => (isFavorite ? remove.mutate() : add.mutate()),
    isLoading: add.isPending || remove.isPending,
  };
}
