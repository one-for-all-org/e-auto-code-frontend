import { request } from '@/lib/http';
import type { AuthResponse } from '@/types';

export const register = (input: { name: string; email: string; password: string }) =>
  request<AuthResponse>('/auth/register', { method: 'POST', body: input });

export const login = (input: { email: string; password: string }) =>
  request<AuthResponse>('/auth/login', { method: 'POST', body: input });
