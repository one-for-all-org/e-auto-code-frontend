import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    forgotPassword.mutate({ email }, {
      onSuccess: () => setSent(true),
    });
  };

  if (sent) {
    return (
      <AuthShell
        title={t('auth.forgot.sentTitle')}
        subtitle={t('auth.forgot.sentSubtitle')}
        footer={
          <>
            {t('auth.forgot.remember')}{' '}
            <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
              {t('auth.login.submit')}
            </Link>
          </>
        }
      >
        <p className="text-sm text-stone-600">
          {t('auth.forgot.sentHelp')}
        </p>
        <Button asChild className="mt-5 w-full">
          <Link to={`/reset-password?email=${encodeURIComponent(email)}`}>{t('auth.forgot.enterCode')}</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
      footer={
        <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
          {t('auth.forgot.backToLogin')}
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          label={t('auth.forgot.email')}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {forgotPassword.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {forgotPassword.error.message}
          </p>
        )}
        <Button type="submit" loading={forgotPassword.isPending} className="w-full">
          {t('auth.forgot.submit')}
        </Button>
      </form>
    </AuthShell>
  );
}
