import { Paperclip, Signpost } from 'lucide-react';
import { Markdown } from '@/features/chat/components/Markdown';

type Props = {
  role: 'user' | 'assistant';
  content: string;
  fileName?: string | null;
};

export function MessageBubble({ role, content, fileName }: Props) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] space-y-2 rounded-2xl rounded-br-md bg-teal-700 px-4 py-3 text-sm leading-normal text-white shadow-sm">
          {fileName && (
            <p className="flex items-center gap-2 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs">
              <Paperclip size={14} className="shrink-0" />
              <span className="truncate">{fileName}</span>
            </p>
          )}
          {content && <p className="whitespace-pre-wrap break-words">{content}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <Signpost size={16} />
      </span>
      <div className="min-w-0 flex-1 rounded-2xl rounded-bl-md border border-stone-200 bg-white px-4 py-3 shadow-sm">
        <Markdown content={content} />
      </div>
    </div>
  );
}
