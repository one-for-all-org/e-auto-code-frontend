import { useState } from 'react';
import { History, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ConversationItem } from '@/features/history/components/ConversationItem';
import { useConversations, useCreateConversation } from '@/features/history/hooks/useConversations';
import { useTranslation } from 'react-i18next';

type Props = {
  activeId?: string;
  onDone?: () => void;
};

export function ConversationSidebar({ activeId, onDone }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const conversations = useConversations();
  const create = useCreateConversation();
  const [query, setQuery] = useState('');

  const handleCreate = () => {
    create.mutate(undefined, {
      onSuccess: (conversation) => {
        onDone?.();
        navigate(`/chat/${conversation.id}`);
      },
    });
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = (conversations.data ?? []).filter((conversation) =>
    normalizedQuery ? conversation.title.toLowerCase().includes(normalizedQuery) : true,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{t('history.title')}</h2>
        {onDone && (
          <Button variant="ghost" size="icon" aria-label={t('chat.historyClose')} onClick={onDone} className="md:hidden">
            <X size={18} />
          </Button>
        )}
      </div>
      <div className="space-y-3 px-4 py-3">
        <Button className="w-full" onClick={handleCreate} loading={create.isPending}>
          <Plus size={16} />
          {t('history.newConversation')}
        </Button>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('history.search')}
          aria-label={t('history.search')}
          className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <nav aria-label={t('history.navigationLabel')} className="flex-1 overflow-y-auto px-2 pb-3">
        {conversations.isPending ? (
          <Spinner className="mx-auto mt-6" />
        ) : conversations.isError ? (
          <p className="p-3 text-sm text-red-700">{t('history.loadError')}</p>
        ) : (conversations.data ?? []).length === 0 ? (
          <EmptyState icon={History} title={t('history.emptyTitle')} description={t('history.emptyText')} />
        ) : filtered.length === 0 ? (
          <p className="p-3 text-sm text-stone-500">{t('history.searchEmpty')}</p>
        ) : (
          filtered.map((conversation) => (
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
