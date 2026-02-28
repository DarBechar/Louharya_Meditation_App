import type { PublicUser } from './user';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { email: string; password: string; name: string; }
export interface AuthResponse { token: string; user: PublicUser; }
