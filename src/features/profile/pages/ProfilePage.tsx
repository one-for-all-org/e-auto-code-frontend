import { AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { NameForm } from '@/features/profile/components/NameForm';
import { PasswordForm } from '@/features/profile/components/PasswordForm';
import { useMe } from '@/features/profile/hooks/useProfile';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();
  const me = useMe();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">{t('profile.title')}</h1>
        <p className="mt-1 text-sm text-stone-500">{t('profile.subtitle')}</p>
      </div>
      {me.isSuccess && me.data ? (
        <>
          <NameForm user={me.data} />
          <PasswordForm />
        </>
      ) : me.isError ? (
        <EmptyState icon={AlertCircle} title={t('profile.unavailable')} description={me.error.message} />
      ) : (
        <Spinner className="mx-auto" />
      )}
    </div>
  );
}
