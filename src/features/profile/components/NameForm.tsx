import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Shield, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useUpdateMe } from '@/features/profile/hooks/useProfile';
import type { User } from '@/types';

export function NameForm({ user }: { user?: User }) {
  const updateMe = useUpdateMe();
  const initialName = user?.name ?? '';
  const [name, setName] = useState(initialName);
  const trimmed = name.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    updateMe.mutate({ name: trimmed });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <h2 className="text-base font-semibold text-stone-900">Informations personnelles</h2>

      {/* Données du compte */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-teal-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-stone-900">{user?.name ?? '—'}</p>
            <p className="text-xs text-stone-500">{user?.email ?? '—'}</p>
          </div>
        </div>

        {/* Badges statut */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            {user?.role === 'ADMIN' ? (
              <Shield className="h-3 w-3" />
            ) : (
              <Shield className="h-3 w-3" />
            )}
            {user?.role}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            user?.isOk ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-stone-200 bg-stone-50 text-stone-600'
          }`}>
            <CheckCircle2 className="h-3 w-3" />
            {user?.isOk ? 'RGPD accepté' : 'RGPD non accepté'}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            user?.isBlocked ? 'border-red-200 bg-red-50 text-red-700' : 'border-teal-200 bg-teal-50 text-teal-700'
          }`}>
            <AlertCircle className="h-3 w-3" />
            {user?.isBlocked ? 'Bloqué' : 'Actif'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
          <Calendar className="h-4 w-4" />
          <span>Créé le : {user?.createdAt ? formatDate(user.createdAt) : '—'}</span>
        </div>
      </div>

      {/* Formulaire modification nom */}
      <div className="mt-8 border-t border-stone-200 pt-6 space-y-5">
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
            <Button
              type="submit"
              loading={updateMe.isPending}
              disabled={!trimmed || trimmed === user?.name}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
