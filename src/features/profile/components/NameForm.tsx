import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useUpdateMe } from '@/features/profile/hooks/useProfile';
import type { User } from '@/types';

export function NameForm({ user }: { user: User }) {
  const updateMe = useUpdateMe();
  const [name, setName] = useState(user.name);
  const trimmed = name.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateMe.mutate({ name: trimmed });
  };

  return (
    <Card>
      <h2 className="text-base font-semibold text-stone-900">Informations personnelles</h2>
      <p className="mt-1 text-sm text-stone-500">Email : {user.email}</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <Input id="profile-name" label="Nom" required value={name} onChange={(e) => setName(e.target.value)} />
        {updateMe.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {updateMe.error.message}
          </p>
        )}
        {updateMe.isSuccess && !updateMe.isPending && (
          <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
            Nom mis à jour.
          </p>
        )}
        <div className="flex justify-end">
          <Button type="submit" loading={updateMe.isPending} disabled={!trimmed || trimmed === user.name}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Card>
  );
}
