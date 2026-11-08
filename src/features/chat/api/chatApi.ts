import { request } from '@/lib/http';
import type { Message, SendMessageResponse } from '@/types';

export const listMessages = async (conversationId: string) => {
  const res = await request<{ success: boolean; data: { messages: Message[] }; message: string }>(`/conversations/${conversationId}/messages`);
  return res.data.messages;
};

export const sendMessage = (conversationId: string, content: string, file: File | null, lang: 'fr' | 'en' | 'mg') => {
  const form = new FormData();
  form.append('content', content);
  form.append('lang', lang);
  if (file) form.append('file', file);
  return request<{ success: boolean; data: SendMessageResponse; message: string }>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: form,
  }).then((res) => res.data);
};
