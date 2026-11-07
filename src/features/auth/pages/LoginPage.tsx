import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useLogin } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
  const login = useLogin();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login.mutate(form);
  };

  return (
    <AuthShell
      title="Connexion"
      subtitle="Reprenez vos leçons de code de la route."
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
            Inscrivez-vous
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="-mt-2 text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-teal-700 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        {login.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {login.error.message}
          </p>
        )}
        <Button type="submit" loading={login.isPending} className="w-full">
          Se connecter
        </Button>
      </form>
    </AuthShell>
  );
}
