import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listMessages, sendMessage } from '@/features/chat/api/chatApi';
import { conversationsKey } from '@/features/history/hooks/useConversations';
import type { Message } from '@/types';

export type SendInput = { conversationId: string; content: string; file: File | null; lang: 'fr' | 'en' | 'mg' };

const messagesKey = (conversationId: string) => ['messages', conversationId] as const;

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: messagesKey(conversationId ?? ''),
    queryFn: () => listMessages(conversationId ?? ''),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content, file, lang }: SendInput) => sendMessage(conversationId, content, file, lang),
    onSuccess: ({ userMessage, assistantMessage }, { conversationId }) => {
      queryClient.setQueryData<Message[]>(messagesKey(conversationId), (old) => [
        ...(old ?? []),
        userMessage,
        assistantMessage,
      ]);
      queryClient.invalidateQueries({ queryKey: messagesKey(conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationsKey });
    },
  });
}
