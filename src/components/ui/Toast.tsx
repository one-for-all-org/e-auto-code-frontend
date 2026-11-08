import { CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ToastType = 'success' | 'error' | 'info' | 'loading';

const variants: Record<ToastType, { bg: string; icon: React.ElementType; label: string }> = {
  success: { bg: 'bg-teal-50 border-teal-200 text-teal-800', icon: CheckCircle, label: 'success' },
  error: { bg: 'bg-red-50 border-red-200 text-red-800', icon: AlertCircle, label: 'error' },
  info: { bg: 'bg-primary/10 border-primary/30 text-foreground', icon: Info, label: 'info' },
  loading: { bg: 'bg-stone-50 border-stone-200 text-stone-800', icon: Loader2, label: 'loading' },
};

type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};

type Props = {
  toast: Toast;
  onDismiss: () => void;
};

export function Toast({ toast, onDismiss }: Props) {
  const { bg, icon: Icon, label } = variants[toast.type];
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 200);
      }, toast.duration ?? 4000);
      return () => clearTimeout(timer);
    }
  }, [onDismiss, toast.duration]);

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 pointer-events-auto ${bg} border px-4 py-3 rounded-lg shadow-lg`} role="alert">
      <div className="flex items-start gap-3">
        <Icon size={18} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{t(`common.toast.${label}`)}</p>
          <p className="mt-1 text-xs">{toast.message}</p>
        </div>
        <button onClick={onDismiss} className="ml-2 shrink-0 rounded p-1 hover:bg-current/10 focus:outline-none" aria-label={t('common.actions.close')}>
          <span className="block h-3 w-3">
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293-4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
