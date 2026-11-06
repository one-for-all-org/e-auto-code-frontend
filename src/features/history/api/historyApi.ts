import { request } from '@/lib/http';
import type { Conversation } from '@/types';

export const listConversations = () => request<Conversation[]>('/conversations');

export const createConversation = () => request<Conversation>('/conversations', { method: 'POST', body: {} });

export const renameConversation = (id: string, title: string) =>
  request<Conversation>(`/conversations/${id}`, { method: 'PATCH', body: { title } });

export const deleteConversation = (id: string) => request<void>(`/conversations/${id}`, { method: 'DELETE' });
