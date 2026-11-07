import { History, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ConversationItem } from '@/features/history/components/ConversationItem';
import { useConversations, useCreateConversation } from '@/features/history/hooks/useConversations';

type Props = {
  activeId?: string;
  onDone?: () => void;
};

export function ConversationSidebar({ activeId, onDone }: Props) {
  const navigate = useNavigate();
  const conversations = useConversations();
  const create = useCreateConversation();

  const handleCreate = () => {
    create.mutate(undefined, {
      onSuccess: (conversation) => {
        onDone?.();
        navigate(`/chat/${conversation.id}`);
      },
    });
  };

  return (
    <div className="flex h-full flex-col mt-24 sm:mt-0">
      <div className="flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-stone-900">Historique</h2>
        <div className="flex items-center gap-1">
          <Button size="sm" onClick={handleCreate} loading={create.isPending}>
            <Plus size={16} />
            Nouvelle
          </Button>
          {onDone && (
            <Button variant="ghost" size="icon" aria-label="Fermer l'historique" onClick={onDone} className="md:hidden">
              <X size={18} />
            </Button>
          )}
        </div>
      </div>
      <nav aria-label="Conversations" className="flex-1 space-y-1 overflow-y-auto p-3">
        {conversations.isPending ? (
          <Spinner className="mx-auto mt-6" />
        ) : conversations.isError ? (
          <p className="p-3 text-sm text-red-700">Impossible de charger l'historique.</p>
        ) : (conversations.data ?? []).length === 0 ? (
          <EmptyState icon={History} title="Aucune conversation" description="Créez-en une pour commencer." />
        ) : (
          (conversations.data ?? []).map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === activeId}
              onOpen={onDone}
            />
          ))
        )}
      </nav>
    </div>
  );
}
