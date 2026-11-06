import { useEffect, useRef } from 'react';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { Spinner } from '@/components/ui/Spinner';
import type { SendInput } from '@/features/chat/hooks/useMessages';
import type { Message } from '@/types';

type Props = {
  messages: Message[];
  pending?: SendInput;
};

export function MessageList({ messages, pending }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, pending]);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          fileName={message.fileName}
        />
      ))}
      {pending && (
        <>
          <MessageBubble role="user" content={pending.content} fileName={pending.file?.name} />
          <div role="status" className="flex items-center gap-2 pl-11 text-sm text-stone-500">
            <Spinner className="h-4 w-4" />
            L'IA écrit…
          </div>
        </>
      )}
      <div ref={endRef} />
    </div>
  );
}
