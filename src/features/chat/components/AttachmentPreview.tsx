import { FileText, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  fileName: string;
  previewUrl?: string;
  fileSize?: string;
  onRemove?: () => void;
  textClassName?: string;
};

export function AttachmentPreview({ fileName, previewUrl, fileSize, onRemove, textClassName = 'text-stone-700' }: Props) {
  const { t } = useTranslation();
  const isImage = /\.(png|jpe?g)$/i.test(fileName);
  const isPdf = /\.pdf$/i.test(fileName);

  return (
    <div className="flex min-w-0 items-start gap-3">
      {previewUrl && isImage ? (
        <img
          src={previewUrl}
          alt={t('chat.imagePreview')}
          className="h-16 w-20 shrink-0 rounded-md border border-black/10 object-cover"
        />
      ) : previewUrl && isPdf ? (
        <iframe
          title={t('chat.pdfPreview', { name: fileName })}
          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          tabIndex={-1}
          className="pointer-events-none h-16 w-20 shrink-0 rounded-md border border-black/10 bg-white"
        />
      ) : (
        <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md border border-black/10 bg-white/70 text-amber-700">
          <FileText size={22} aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0 flex-1 pt-1">
        <span className={`block truncate text-sm font-medium ${textClassName}`}>{fileName}</span>
        {fileSize && <span className={`mt-1 block text-xs opacity-75 ${textClassName}`}>{fileSize}</span>}
      </span>
      {onRemove && (
        <button
          type="button"
          aria-label={t('chat.removeFile')}
          onClick={onRemove}
          className="shrink-0 rounded p-1 text-current opacity-70 hover:bg-black/5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
