import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createConversation,
  deleteConversation,
  listConversations,
  renameConversation,
} from '@/features/history/api/historyApi';

export const conversationsKey = ['conversations'] as const;

export function useConversations() {
  return useQuery({ queryKey: conversationsKey, queryFn: listConversations });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationsKey }),
  });
}

export function useRenameConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => renameConversation(id, title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationsKey }),
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationsKey }),
  });
}
