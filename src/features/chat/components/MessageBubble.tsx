import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Paperclip, Signpost } from 'lucide-react';
import { toast } from '@/lib/toast';
import { Markdown } from '@/features/chat/components/Markdown';

type Props = {
  role: 'user' | 'assistant';
  content: string;
  fileName?: string | null;
};

export function MessageBubble({ role, content, fileName }: Props) {
  const [copied, setCopied] = useState(false);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(copiedTimeout.current), []);

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

  const copyResponse = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      clearTimeout(copiedTimeout.current);
      copiedTimeout.current = setTimeout(() => setCopied(false), 2000);
      toast('success', 'Réponse copiée dans le presse-papiers.');
    } catch {
      toast('error', 'Impossible de copier la réponse. Vérifiez les permissions du navigateur.');
    }
  };

  return (
    <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
        <Signpost size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <Markdown content={content} />
        <button
          type="button"
          onClick={() => void copyResponse()}
          aria-label={copied ? 'Réponse copiée' : 'Copier la réponse'}
          className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copié' : 'Copier'}</span>
        </button>
      </div>
    </div>
  );
}
