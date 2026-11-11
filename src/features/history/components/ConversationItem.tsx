import { useState, type FormEvent } from 'react';
import { Check, MessageSquare, Pencil, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDeleteConversation, useRenameConversation } from '@/features/history/hooks/useConversations';
import type { Conversation } from '@/types';
import { useTranslation } from 'react-i18next';

type Props = {
  conversation: Conversation;
  active: boolean;
  onOpen?: () => void;
};

export function ConversationItem({ conversation, active, onOpen }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rename = useRenameConversation();
  const remove = useDeleteConversation();
  const [mode, setMode] = useState<'view' | 'rename'>('view');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const startRename = () => {
    setTitle(conversation.title);
    setMode('rename');
  };

  const saveRename = (event: FormEvent) => {
    event.preventDefault();
    const next = title.trim();
    if (!next || next === conversation.title) {
      setMode('view');
      return;
    }
    rename.mutate({ id: conversation.id, title: next }, { onSuccess: () => setMode('view') });
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(conversation.id);
      if (active) navigate('/chat');
    } catch {
      return;
    } finally {
      setConfirmOpen(false);
    }
  };

  if (mode === 'rename') {
    return (
      <form onSubmit={saveRename} className="flex items-center gap-1 rounded-xl bg-stone-100 shadow-sm p-1.5">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          aria-label={t('history.newTitle')}
          className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-2 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-600/25"
        />
        <Button type="submit" size="icon" aria-label={t('history.save')} loading={rename.isPending}>
          <Check size={16} />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label={t('history.cancel')} onClick={() => setMode('view')}>
          <X size={16} />
        </Button>
      </form>
    );
  }

  return (
    <div
      className={`group flex items-center gap-1 rounded-lg pr-1 transition-all duration-200 ease-out ${
        active
          ? 'bg-teal-50 shadow-[0_6px_12px_-4px_hsl(var(--primary)/0.25)]'
          : 'hover:bg-stone-100 hover:-translate-y-0.5'
      }`}
    >
      <Link
        to={`/chat/${conversation.id}`}
        onClick={onOpen}
        aria-current={active ? 'page' : undefined}
        className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
          active ? 'font-medium text-teal-800' : 'text-stone-700'
        }`}
      >
        <MessageSquare size={16} className="shrink-0 opacity-60" />
        <span className="truncate">{conversation.title}</span>
      </Link>
      <div className="flex shrink-0 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <Button variant="ghost" size="icon" aria-label={t('history.rename')} onClick={startRename}>
          <Pencil size={14} />
        </Button>
        <Button variant="ghost" size="icon" aria-label={t('history.delete')} onClick={() => setConfirmOpen(true)}>
          <Trash2 size={14} />
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        title={t('history.deleteTitle')}
        description={t('history.deleteDescription', { title: conversation.title })}
        destructive
      />
    </div>
  );
}
