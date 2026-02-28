import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import type { PublicUser } from '@louharya/shared';

interface AuthState {
  user: PublicUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  hydrate: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) { set({ isLoading: false }); return; }
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data, token, isLoading: false });
    } catch {
      await AsyncStorage.removeItem('auth_token');
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('auth_token', data.data.token);
    set({ user: data.data.user, token: data.data.token });
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    await AsyncStorage.setItem('auth_token', data.data.token);
    set({ user: data.data.user, token: data.data.token });
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    set({ user: null, token: null });
  },
}));
