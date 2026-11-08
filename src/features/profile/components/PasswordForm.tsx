import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useUpdateMe } from '@/features/profile/hooks/useProfile';
import { useTranslation } from 'react-i18next';

const MIN_PASSWORD_LENGTH = 8;

export function PasswordForm() {
  const { t } = useTranslation();
  const updateMe = useUpdateMe();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const mismatch = confirmation.length > 0 && confirmation !== password;
  const canSubmit = password.length >= MIN_PASSWORD_LENGTH && !mismatch && confirmation === password;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateMe.mutate({ password }, {
      onSuccess: () => {
        setPassword('');
        setConfirmation('');
      },
    });
  };

  return (
    <Card>
      <h2 className="text-base font-semibold text-stone-900">{t('profile.password')}</h2>
      <p className="mt-1 text-sm text-stone-500">{t('profile.passwordHint')}</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <Input
          id="profile-password"
          label={t('profile.newPassword')}
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          id="profile-password-confirm"
          label={t('profile.confirmPassword')}
          type="password"
          autoComplete="new-password"
          required
          value={confirmation}
          error={mismatch ? t('profile.passwordMismatch') : undefined}
          onChange={(e) => setConfirmation(e.target.value)}
        />
        {updateMe.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {updateMe.error.message}
          </p>
        )}
        {updateMe.isSuccess && !updateMe.isPending && (
          <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
            {t('profile.passwordUpdated')}
          </p>
        )}
        <div className="flex justify-end">
          <Button type="submit" loading={updateMe.isPending} disabled={!canSubmit} className="w-full sm:w-auto">
            {t('profile.changePassword')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
