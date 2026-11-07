import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useResetPassword } from '@/features/auth/hooks/useAuth';
import { clearAuth } from '@/lib/tokenStorage';

export default function ResetPasswordPage() {
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
        title="Mot de passe réinitialisé"
        subtitle="Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
        footer={
          <>
            <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
              Se connecter
            </Link>
          </>
        }
      >
        <p className="text-sm text-stone-600">Vos sessions de renouvellement ont été révoquées. Reconnectez-vous avec votre nouveau mot de passe.</p>
        <Button className="mt-5 w-full" onClick={() => navigate('/login')}>
          Aller à la connexion
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Réinitialiser le mot de passe"
      subtitle="Entrez votre email, le code reçu et votre nouveau mot de passe."
      footer={
        <>
          Retour à la{' '}
          <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
            connexion
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
          id="code"
          label="Code à 6 chiffres"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]{6}"
          required
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <Input
          id="password"
          label="Nouveau mot de passe (8 caractères minimum)"
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
          Réinitialiser
        </Button>
      </form>
    </AuthShell>
  );
}
