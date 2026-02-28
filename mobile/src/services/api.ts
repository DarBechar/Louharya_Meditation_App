import * as SecureStore from 'expo-secure-store';
import { Category, Meditation, User, Session, SessionStats } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';
const TOKEN_KEY = 'auth_token';

async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? `HTTP ${res.status}`);
  }

  return json as T;
}

// Auth
export async function register(name: string, email: string, password: string) {
  const data = await request<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  return data;
}

export async function login(email: string, password: string) {
  const data = await request<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await SecureStore.setItemAsync(TOKEN_KEY, data.token);
  return data;
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getMe(): Promise<User> {
  return request<User>('/users/me');
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return request<Category[]>('/categories');
}

export async function getCategory(id: string): Promise<Category & { meditations: Meditation[] }> {
  return request(`/categories/${id}`);
}

// Meditations
export async function getMeditations(params?: {
  categoryId?: string;
  level?: string;
  search?: string;
}): Promise<Meditation[]> {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return request<Meditation[]>(`/meditations${qs ? `?${qs}` : ''}`);
}

export async function getFeaturedMeditations(): Promise<Meditation[]> {
  return request<Meditation[]>('/meditations/featured');
}

export async function getMeditation(id: string): Promise<Meditation> {
  return request<Meditation>(`/meditations/${id}`);
}

// Sessions
export async function logSession(data: {
  meditationId: string;
  durationComplete: number;
  notes?: string;
}): Promise<Session> {
  return request<Session>('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMySessions(): Promise<{ sessions: Session[]; stats: SessionStats }> {
  return request('/sessions/me');
}
