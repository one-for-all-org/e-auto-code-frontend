import { AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { NameForm } from '@/features/profile/components/NameForm';
import { PasswordForm } from '@/features/profile/components/PasswordForm';
import { useMe } from '@/features/profile/hooks/useProfile';

export default function ProfilePage() {
  const me = useMe();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Mon profil</h1>
        <p className="mt-1 text-sm text-stone-500">Gérez vos informations et votre mot de passe.</p>
      </div>
      {me.isSuccess ? (
        <>
          <NameForm user={me.data} />
          <PasswordForm />
        </>
      ) : me.isError ? (
        <EmptyState icon={AlertCircle} title="Profil indisponible" description={me.error.message} />
      ) : (
        <Spinner className="mx-auto" />
      )}
    </div>
  );
}
