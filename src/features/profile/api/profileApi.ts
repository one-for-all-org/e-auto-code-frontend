import { request } from '@/lib/http';
import type { RoadRole, User } from '@/types';

export const getMe = async () => {
  const res = await request<{ success: boolean; data: { user: User }; message: string }>('/me');
  return res.data.user;
};

export const updateMe = async (input: { name?: string; password?: string; roadRole?: RoadRole }) => {
  const res = await request<{ success: boolean; data: { user: User }; message: string }>('/me', {
    method: 'PATCH',
    body: input,
  });
  return res.data.user;
};
