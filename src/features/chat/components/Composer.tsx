import { useLayoutEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Plus, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const ACCEPTED_TYPES: Record<string, string> = {
  txt: 'text/plain',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};
const MAX_FILE_SIZE = 1024 * 1024;
const MAX_TEXTAREA_HEIGHT = 224;

type Props = {
  disabled: boolean;
  onSend: (content: string, file: File | null) => Promise<boolean>;
};

export function Composer({ disabled, onSend }: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = !disabled && (text.trim() !== '' || file !== null);

  // Hauteur flexible : grandit avec le texte, puis scroll après maxHeight
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [text]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0];
    event.target.value = '';
    if (!picked) return;

    const expectedType = ACCEPTED_TYPES[picked.name.split('.').pop()?.toLowerCase() ?? ''];
    if (!expectedType || (picked.type !== '' && picked.type !== expectedType)) {
      setFileError(t('chat.fileErrorType'));
      return;
    }
    if (picked.size > MAX_FILE_SIZE) {
      setFileError(t('chat.fileErrorSize'));
      return;
    }
    setFileError('');
    setFile(picked);
  };

  const submit = async () => {
    if (!canSend) return;
    const sent = await onSend(text.trim(), file);
    if (sent) {
      setText('');
      setFile(null);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className={cn(
        'mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-3 shadow-sm',
        'transition-colors focus-within:border-ring/60 focus-within:ring-[3px] focus-within:ring-ring/20',
        disabled && 'opacity-60'
      )}
      onClick={() => textareaRef.current?.focus()}
    >
      {file && (
        <div className="mb-2 flex max-w-[240px] items-center gap-1.5 rounded-full bg-muted py-1 pl-3 pr-1 text-xs text-muted-foreground">
          <span className="truncate">{file.name}</span>
          <span className="shrink-0 font-medium">{t('chat.fileSize', { size: Math.ceil(file.size / 1024) })}</span>
          <button
            type="button"
            aria-label={t('chat.removeFile')}
            className="rounded-full p-0.5 hover:bg-background hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
      {fileError && (
        <p role="alert" className="mb-2 text-sm text-red-600">{fileError}</p>
      )}
      <div className="mt-2 flex min-w-0 items-end gap-2 sm:gap-3">
        <input
          ref={fileInput}
          type="file"
          accept=".txt,.pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label={t('chat.attachFile')}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            fileInput.current?.click();
          }}
        >
          <Plus className="size-5" />
        </Button>
        <textarea
          ref={textareaRef}
          value={text}
          rows={1}
          placeholder={t('chat.questionPlaceholder')}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={t('chat.questionLabel')}
          className="block w-full resize-none bg-transparent px-1 py-1 text-base leading-6 text-foreground outline-none outline-offset-0 placeholder:text-muted-foreground transition-[height] duration-100 focus:outline-none focus:ring-0 sm:px-4 sm:py-3"
        />
        <Button
          type="submit"
          size="icon"
          aria-label={t('chat.send')}
          disabled={!canSend}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 rounded-full disabled:cursor-not-allowed"
        >
          <Send size={17} />
        </Button>
      </div>
      <p className="mt-1.5 text-xs text-stone-500">{t('chat.responseDisclaimer')}</p>
    </form>
  );
}
