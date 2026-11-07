import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { FileText, Paperclip, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ACCEPTED_TYPES: Record<string, string> = {
  txt: 'text/plain',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};
const MAX_FILE_SIZE = 1024 * 1024;
const MAX_TEXTAREA_HEIGHT = 192;

const formatSize = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} Ko`;

type Props = {
  disabled: boolean;
  onSend: (content: string, file: File | null) => Promise<boolean>;
};

export function Composer({ disabled, onSend }: Props) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = !disabled && (text.trim() !== '' || file !== null);

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
      setFileError('Format non accepté. Choisissez un fichier .txt, .pdf, .png ou .jpg.');
      return;
    }
    if (picked.size > MAX_FILE_SIZE) {
      setFileError('Le fichier dépasse 1 Mo.');
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
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 border border-amber-100">
          <FileText size={16} className="shrink-0 text-amber-600" />
          <span className="min-w-0 truncate">{file.name}</span>
          <span className="shrink-0 text-amber-500">{formatSize(file.size)}</span>
          <button
            type="button"
            aria-label="Retirer le fichier"
            onClick={() => setFile(null)}
            className="ml-auto rounded p-1 text-amber-500 hover:bg-amber-100 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {fileError && (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {fileError}
        </p>
      )}
      <div className="flex items-end gap-2">
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
          aria-label="Joindre un fichier"
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
          rows={1}
          placeholder="Posez une question sur le code de la route à Madagascar…"
          aria-label="Votre question"
          className="min-h-[44px] flex-1 resize-none overflow-y-hidden rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm leading-5 text-stone-800 placeholder:text-stone-400 transition-[height] duration-100 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25"
        />
        <Button
          type="submit"
          variant="primary"
          size="icon"
          aria-label="Envoyer"
          disabled={!canSend}
          className="rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-200 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </Button>
      </div>
      <p className="mt-2 text-xs text-stone-500">Un fichier de 1 Mo maximum : .txt, .pdf, .png ou .jpg</p>
    </form>
  );
}
