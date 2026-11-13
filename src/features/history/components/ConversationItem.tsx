import { useState, type FormEvent } from 'react';
import { Check, MessageSquare, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const rename = useRenameConversation();
  const remove = useDeleteConversation();
  const [mode, setMode] = useState<'view' | 'rename'>('view');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const date = new Date(conversation.updatedAt).toLocaleDateString(
    i18n.resolvedLanguage ?? i18n.language,
    { day: '2-digit', month: 'short' },
  );

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
      <form onSubmit={saveRename} className="flex items-center gap-1 rounded-lg bg-stone-100 p-1.5 dark:bg-stone-800">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          aria-label={t('history.newTitle')}
          className="min-w-0 flex-1 rounded-md border border-input bg-white px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 dark:bg-stone-900"
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
      className={`group relative flex items-center border-l-2 transition-colors duration-200 ease-out ${
        active
          ? 'border-teal-600 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/40'
          : 'border-transparent hover:bg-stone-100 dark:hover:bg-stone-800'
      }`}
    >
      <Link
        to={`/chat/${conversation.id}`}
        onClick={onOpen}
        aria-current={active ? 'page' : undefined}
        className={`flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
          active ? 'font-medium text-teal-800 dark:text-teal-200' : 'text-stone-700 dark:text-stone-300'
        }`}
      >
        <MessageSquare size={15} className="shrink-0 opacity-50" />
        <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
        <span className="shrink-0 text-xs font-normal text-stone-400">{date}</span>
      </Link>
      <details className="relative shrink-0">
        <summary
          aria-label={t('history.options')}
          className="flex h-7 w-7 cursor-pointer list-none items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-stone-700 dark:hover:text-stone-200 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100 [&::-webkit-details-marker]:hidden"
        >
          <MoreHorizontal size={15} />
        </summary>
        <div className="absolute right-1 top-9 z-30 w-40 rounded-lg border border-border bg-card p-1 shadow-float">
          <button
            type="button"
            onClick={(event) => {
              event.currentTarget.closest('details')?.removeAttribute('open');
              startRename();
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Pencil size={14} />
            {t('history.rename')}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.currentTarget.closest('details')?.removeAttribute('open');
              setConfirmOpen(true);
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-red-950/40"
          >
            <Trash2 size={14} />
            {t('history.delete')}
          </button>
        </div>
      </details>

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
