import { AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { NameForm } from '@/features/profile/components/NameForm';
import { PasswordForm } from '@/features/profile/components/PasswordForm';
import { RoadRoleForm } from '@/features/profile/components/RoadRoleForm';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useMe } from '@/features/profile/hooks/useProfile';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();
  const me = useMe();

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t('profile.title')}</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">{t('profile.subtitle')}</p>
      </div>
      <div className="min-w-0">
        {me.isSuccess && me.data ? (
          <div className="divide-y divide-border">
            <NameForm user={me.data} />
            <RoadRoleForm user={me.data} />
            <PasswordForm />
            <section className="py-8">
              <h2 className="text-base font-semibold text-foreground">{t('profile.languageTitle')}</h2>
              <p className="mt-1 text-sm text-stone-500">{t('profile.languageHint')}</p>
              <div className="mt-4 inline-flex rounded-lg border border-border bg-card px-1 py-0.5">
                <LanguageSwitcher />
              </div>
            </section>
          </div>
        ) : me.isError ? (
          <EmptyState icon={AlertCircle} title={t('profile.unavailable')} description={me.error.message} />
        ) : (
          <Spinner className="mx-auto" />
        )}
      </div>
    </div>
  );
}
