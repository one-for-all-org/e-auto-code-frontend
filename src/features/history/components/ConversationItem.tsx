import { useState, type FormEvent } from 'react';
import { Check, MessageSquare, Pencil, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useDeleteConversation, useRenameConversation } from '@/features/history/hooks/useConversations';
import type { Conversation } from '@/types';

type Props = {
  conversation: Conversation;
  active: boolean;
  onOpen?: () => void;
};

export function ConversationItem({ conversation, active, onOpen }: Props) {
  const navigate = useNavigate();
  const rename = useRenameConversation();
  const remove = useDeleteConversation();
  const [mode, setMode] = useState<'view' | 'rename' | 'confirm'>('view');
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

  const confirmDelete = async () => {
    try {
      await remove.mutateAsync(conversation.id);
      if (active) navigate('/chat');
    } catch {
      return;
    }
  };

  if (mode === 'rename') {
    return (
      <form onSubmit={saveRename} className="flex items-center gap-1 rounded-lg bg-stone-100 p-1.5">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          aria-label="Nouveau titre"
          className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-2 py-1 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-600/25"
        />
        <Button type="submit" size="icon" aria-label="Enregistrer" loading={rename.isPending}>
          <Check size={16} />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Annuler" onClick={() => setMode('view')}>
          <X size={16} />
        </Button>
      </form>
    );
  }

  if (mode === 'confirm') {
    return (
      <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-3">
        <p className="text-sm text-stone-800">Supprimer « {conversation.title} » ? Cette action est définitive.</p>
        {remove.isError && <p className="text-sm text-red-700">Suppression impossible, réessayez.</p>}
        <div className="flex gap-2">
          <Button size="sm" variant="danger" loading={remove.isPending} onClick={confirmDelete}>
            Supprimer
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('view')}>
            Annuler
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center gap-1 rounded-lg pr-1 transition-colors ${
        active ? 'bg-teal-50' : 'hover:bg-stone-100'
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
        <Button variant="ghost" size="icon" aria-label="Renommer" onClick={startRename}>
          <Pencil size={14} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => setMode('confirm')}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
