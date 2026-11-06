import { request } from '@/lib/http';
import type { Message, SendMessageResponse } from '@/types';

export const listMessages = (conversationId: string) =>
  request<Message[]>(`/conversations/${conversationId}/messages`);

export const sendMessage = (conversationId: string, content: string, file: File | null) => {
  const form = new FormData();
  form.append('content', content);
  if (file) form.append('file', file);
  return request<SendMessageResponse>(`/conversations/${conversationId}/messages`, { method: 'POST', body: form });
};
