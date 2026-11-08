import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Spinner({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return <Loader2 aria-label={t('common.actions.loading')} className={`h-5 w-5 animate-spin text-teal-700 ${className}`} />;
}
