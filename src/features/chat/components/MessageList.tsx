import { useEffect, useRef } from 'react';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import type { SendInput } from '@/features/chat/hooks/useMessages';
import type { Message } from '@/types';
import { useTranslation } from 'react-i18next';

type Props = {
  messages: Message[];
  pending?: SendInput;
  attachmentPreviews?: Record<string, string>;
};

export function MessageList({ messages, pending, attachmentPreviews = {} }: Props) {
  const { t } = useTranslation();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, pending]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          fileName={message.attachmentName}
          attachmentPreviewUrl={attachmentPreviews[message.id]}
        />
      ))}
      {pending && (
        <>
          <MessageBubble role="user" content={pending.content} fileName={pending.file?.name} />
          <div role="status" aria-label={t('chat.writing')} className="flex items-center gap-2 pl-11">
            <span className="flex items-center gap-1" aria-hidden="true">
              <span className="size-1.5 animate-typing rounded-full bg-teal-600" />
              <span className="size-1.5 animate-typing rounded-full bg-teal-600" style={{ animationDelay: '150ms' }} />
              <span className="size-1.5 animate-typing rounded-full bg-teal-600" style={{ animationDelay: '300ms' }} />
            </span>
            <span className="text-sm text-stone-500">{t('chat.writing')}</span>
          </div>
        </>
      )}
      <div ref={endRef} />
    </div>
  );
}
