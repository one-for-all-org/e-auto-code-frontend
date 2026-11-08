import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useRegister } from '@/features/auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const register = useRegister();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    register.mutate({ ...form, name: form.name.trim() });
  };

  return (
    <AuthShell
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      footer={
        <>
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
            {t('auth.register.loginLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="name"
          label={t('auth.register.name')}
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          id="email"
          label={t('auth.register.email')}
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          id="password"
          label={t('auth.register.password')}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          {t('auth.register.passwordHint')}
        </p>
        {register.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {register.error.message}
          </p>
        )}
        <Button type="submit" loading={register.isPending} className="w-full">
          {t('auth.register.submit')}
        </Button>
      </form>
    </AuthShell>
  );
}
