import { request } from '@/lib/http';
import type { Conversation } from '@/types';

export const listConversations = async () => {
  const res = await request<{ success: boolean; data: { conversations: Conversation[] }; message: string }>('/conversations');
  return res.data.conversations;
};

export const createConversation = async () => {
  const res = await request<{ success: boolean; data: { conversation: Conversation }; message: string }>('/conversations', {
    method: 'POST',
    body: {},
  });
  return res.data.conversation;
};

export const renameConversation = async (id: string, title: string) => {
  const res = await request<{ success: boolean; data: Conversation; message: string }>(`/conversations/${id}`, {
    method: 'PATCH',
    body: { title },
  });
  return res.data;
};

export const deleteConversation = async (id: string) =>
  request<void>(`/conversations/${id}`, { method: 'DELETE' });
