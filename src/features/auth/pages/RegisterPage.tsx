import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useRegister } from '@/features/auth/hooks/useAuth';

export default function RegisterPage() {
  const register = useRegister();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    register.mutate({ ...form, name: form.name.trim() });
  };

  return (
    <AuthShell
      title="Bienvenue sur E-Torolalana"
      subtitle="Créez votre compte pour commencer à réviser le code de la route à Madagascar."
      footer={
        <>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
            Connectez-vous
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="name"
          label="Nom"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Utilisez au moins 8 caractères. Après l’inscription, vous pourrez commencer vos révisions.
        </p>
        {register.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {register.error.message}
          </p>
        )}
        <Button type="submit" loading={register.isPending} className="w-full">
          Créer mon compte
        </Button>
      </form>
    </AuthShell>
  );
}
