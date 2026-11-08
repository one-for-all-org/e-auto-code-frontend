import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useResetPassword } from '@/features/auth/hooks/useAuth';
import { clearAuth } from '@/lib/tokenStorage';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const resetPassword = useResetPassword();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => ({
    email: searchParams.get('email') ?? '',
    code: '',
    password: '',
  }));
  const [done, setDone] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    resetPassword.mutate(form, {
      onSuccess: () => {
        clearAuth();
        setDone(true);
      },
    });
  };

  if (done) {
    return (
      <AuthShell
        title={t('auth.reset.doneTitle')}
        subtitle={t('auth.reset.doneSubtitle')}
        footer={
          <>
            <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
              {t('auth.login.submit')}
            </Link>
          </>
        }
      >
        <p className="text-sm text-stone-600">{t('auth.reset.doneHelp')}</p>
        <Button className="mt-5 w-full" onClick={() => navigate('/login')}>
          {t('auth.reset.goToLogin')}
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t('auth.reset.title')}
      subtitle={t('auth.reset.subtitle')}
      footer={
        <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
          {t('auth.forgot.backToLogin')}
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          label={t('auth.reset.email')}
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          id="code"
          label={t('auth.reset.code')}
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]{6}"
          required
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <Input
          id="password"
          label={t('auth.reset.password')}
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {resetPassword.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {resetPassword.error.message}
          </p>
        )}
        <Button type="submit" loading={resetPassword.isPending} className="w-full">
          {t('auth.reset.submit')}
        </Button>
      </form>
    </AuthShell>
  );
}
