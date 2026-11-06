import { request } from '@/lib/http';
import type { User } from '@/types';

export const getMe = () => request<User>('/me');

export const updateMe = (input: { name?: string; password?: string }) =>
  request<User>('/me', { method: 'PATCH', body: input });
