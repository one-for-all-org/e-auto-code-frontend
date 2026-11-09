import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AttachmentPreview } from '@/features/chat/components/AttachmentPreview';
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

const formatSize = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} Ko`;

type Props = {
  disabled: boolean;
  onSend: (content: string, file: File | null) => Promise<boolean>;
};

export function Composer({ disabled, onSend }: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [fileError, setFileError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = !disabled && (text.trim() !== '' || file !== null);

  useEffect(() => {
    if (!file || !/\.(pdf|png|jpe?g)$/i.test(file.name)) {
      setPreviewUrl(undefined);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const height = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT);
    textarea.style.height = `${height}px`;
    textarea.style.overflowY = textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
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
    if (event.key === 'Enter' && !event.shiftKey) {
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
      className="border-t border-stone-200 p-3 sm:p-4 bg-white"
    >
      {file && (
        <div className="mb-2 rounded-xl border border-amber-100 bg-amber-50 p-2">
          <AttachmentPreview
            fileName={file.name}
            previewUrl={previewUrl}
            fileSize={formatSize(file.size)}
            onRemove={() => setFile(null)}
            textClassName="text-amber-800"
          />
        </div>
      )}
      {fileError && (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {fileError}
        </p>
      )}
      <div className="flex min-w-0 items-end gap-1.5 sm:gap-2">
        <input
          ref={fileInput}
          type="file"
          accept=".txt,.pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="shrink-0"
          aria-label={t('chat.attachFile')}
          disabled={disabled}
          onClick={() => fileInput.current?.click()}
        >
          <Paperclip size={18} />
        </Button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder={t('chat.questionPlaceholder')}
          aria-label={t('chat.questionLabel')}
          className="min-h-[56px] min-w-0 flex-1 resize-none overflow-y-hidden rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm leading-5 text-stone-800 placeholder:text-stone-400 transition-[height] duration-100 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25 sm:px-4"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          aria-label={t('chat.send')}
          disabled={!canSend}
          className="shrink-0 rounded-full bg-teal-600 px-3 py-3 hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-200 disabled:text-stone-400 sm:px-4"
        >
          <Send size={24} />
        </Button>
      </div>
      <p className="mt-1 text-xs text-stone-500">{t('chat.fileLimit')}</p>
    </form>
  );
}
