import type { ReactNode } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  children?: ReactNode;
};

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  children,
}: Props) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-md"
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-card shadow-surface flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center ${
                destructive
                  ? 'bg-red-100 text-red-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
              {description && (
                <p className="text-sm text-stone-500">{description}</p>
              )}
            </div>
          </div>
          {children}
        </div>
        <div className="border-t border-border/50 bg-card/50 p-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-stone-600 hover:bg-stone-200"
          >
            {cancelLabel ?? t('common.actions.cancel')}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            className="flex-1"
          >
            {destructive ? <Trash2 size={16} className="mr-2" /> : null}
            {confirmLabel ?? t('common.actions.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
