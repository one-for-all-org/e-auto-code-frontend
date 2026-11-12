import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function LogoutConfirm({ open, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      open={open}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={t('common.logoutConfirm')}
      description={t('auth.logoutDescription')}
      confirmLabel={t('common.actions.confirm')}
      cancelLabel={t('common.actions.cancel')}
    />
  );
}
