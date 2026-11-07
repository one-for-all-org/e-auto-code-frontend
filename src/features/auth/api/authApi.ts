import { request } from '@/lib/http';
import type { AuthResponse } from '@/types';

export const register = async (input: { name: string; email: string; password: string }) => {
  const res = await request<{ success: boolean; data: AuthResponse; message: string }>('/auth/register', {
    method: 'POST',
    body: input,
  });
  return res.data;
};

export const login = async (input: { email: string; password: string }) => {
  const res = await request<{ success: boolean; data: AuthResponse; message: string }>('/auth/login', {
    method: 'POST',
    body: input,
  });
  return res.data;
};

export const logout = () =>
  request<void>('/auth/logout', { method: 'POST' });

export const forgotPassword = (input: { email: string }) =>
  request<void>('/auth/forgot-password', { method: 'POST', body: input });

export const resetPassword = (input: { email: string; code: string; password: string }) =>
  request<void>('/auth/reset-password', { method: 'POST', body: input });
