import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';

export default function ForgotPasswordPage() {
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
        title="Vérifiez votre boîte mail"
        subtitle="Si un compte existe avec cette adresse, un code de réinitialisation a été envoyé."
        footer={
          <>
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900 hover:underline">
              Connectez-vous
            </Link>
          </>
        }
      >
        <p className="text-sm text-stone-600">
          Consultez votre boîte de réception. En développement, le code peut également apparaître dans les logs du serveur.
        </p>
        <Button asChild className="mt-5 w-full">
          <Link to={`/reset-password?email=${encodeURIComponent(email)}`}>Saisir le code</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Indiquez votre email pour recevoir un code de réinitialisation."
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {forgotPassword.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {forgotPassword.error.message}
          </p>
        )}
        <Button type="submit" loading={forgotPassword.isPending} className="w-full">
          Envoyer le code
        </Button>
      </form>
    </AuthShell>
  );
}
