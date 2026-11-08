import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const login = useLogin();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login.mutate(form);
  };

  return (
    <AuthShell
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
      footer={
        <>
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
            {t('auth.login.registerLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          label={t('auth.login.email')}
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          id="password"
          label={t('auth.login.password')}
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="-mt-2 text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-teal-700 hover:underline">
            {t('auth.login.forgot')}
          </Link>
        </div>
        {login.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {login.error.message}
          </p>
        )}
        <Button type="submit" loading={login.isPending} className="w-full">
          {t('auth.login.submit')}
        </Button>
      </form>
    </AuthShell>
  );
}
