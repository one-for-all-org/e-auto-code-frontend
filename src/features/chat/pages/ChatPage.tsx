import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Menu, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Composer } from '@/features/chat/components/Composer';
import { MessageList } from '@/features/chat/components/MessageList';
import { WelcomeScreen } from '@/features/chat/components/WelcomeScreen';
import { useMessages, useSendMessage } from '@/features/chat/hooks/useMessages';
import { ConversationSidebar } from '@/features/history/components/ConversationSidebar';
import { useCreateConversation } from '@/features/history/hooks/useConversations';
import { useTranslation } from 'react-i18next';
import { getAppLanguage } from '@/i18n';

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Record<string, string>>({});
  const attachmentPreviewUrls = useRef<string[]>([]);
  const messagesQuery = useMessages(conversationId);
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();

  const isBusy = createConversation.isPending || sendMessage.isPending;
  const error = createConversation.error ?? sendMessage.error;
  const pending = sendMessage.isPending ? sendMessage.variables : undefined;

  useEffect(() => () => {
    attachmentPreviewUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const handleSend = async (content: string, file: File | null) => {
    try {
      let id = conversationId;
      if (!id) {
        const conversation = await createConversation.mutateAsync();
        id = conversation.id;
        navigate(`/chat/${id}`, { replace: true });
      }
      const result = await sendMessage.mutateAsync({ conversationId: id, content, file, lang: getAppLanguage(i18n.resolvedLanguage ?? i18n.language) });
      if (file && /\.(pdf|png|jpe?g)$/i.test(file.name)) {
        const previewUrl = URL.createObjectURL(file);
        attachmentPreviewUrls.current.push(previewUrl);
        setAttachmentPreviews((current) => ({ ...current, [result.userMessage.id]: previewUrl }));
      }
      return true;
    } catch {
      return false;
    }
  };

  const renderBody = () => {
    if (!conversationId) {
      return <WelcomeScreen disabled={isBusy} onPick={(question) => void handleSend(question, null)} />;
    }
    if (messagesQuery.isPending) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      );
    }
    if (messagesQuery.isError) {
      return (
        <EmptyState
          icon={MessageSquare}
          title={t('chat.conversationMissing')}
          description={t('chat.conversationDeleted')}
        />
      );
    }
    return <MessageList messages={messagesQuery.data} pending={pending} attachmentPreviews={attachmentPreviews} />;
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl gap-3 p-2 sm:gap-6 sm:p-6">
      <div className="hidden w-72 shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-surface md:block">
        <ConversationSidebar activeId={conversationId} />
      </div>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-surface">
        <header className="flex items-center gap-3 border-b border-stone-200 px-4 py-3 sm:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t('chat.historyOpen')}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={18} />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-stone-900">{t('chat.title')}</h1>
            <p className="truncate text-xs text-stone-500">{t('chat.scope')}</p>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{renderBody()}</div>

        {error && (
          <p role="alert" className="mx-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error.message}
          </p>
        )}
        <Composer disabled={isBusy} onSend={handleSend} />
      </section>

      {drawerOpen && (
        <div className="fixed inset-0 mt-2 z-40 md:hidden">
          <button
            type="button"
            aria-label={t('chat.historyClose')}
            className="absolute inset-0 bg-stone-900/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[95%] rounded-xl border border-border bg-card shadow-surface">
            <ConversationSidebar activeId={conversationId} onDone={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
