import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useUpdateUser, useDeleteUser } from '@/features/admin/hooks/useAdmin';
import type { User } from '@/types';

type Props = { user: User };

export function AdminUserRow({ user }: Props) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [editing, setEditing] = useState({
    name: user.name,
    role: user.role,
    isOk: user.isOk,
    isBlocked: user.isBlocked,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateUser.mutate({ userId: user.id, input: editing }, {
      onSuccess: () => setMode('view'),
    });
  };

  const toggleBlock = () => {
    updateUser.mutate({ userId: user.id, input: { isBlocked: !user.isBlocked } });
  };

  const handleDelete = async () => {
    await deleteUser.mutateAsync(user.id);
    setConfirmOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-stone-900 truncate">{user.name}</p>
        <p className="text-xs text-stone-500 truncate">{user.email}</p>
        <p className="text-xs text-stone-400">
          {user.role} · {user.isOk ? 'Compte validé' : 'À vérifier'} · {user.isBlocked ? 'Bloqué' : 'Actif'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {mode === 'view' ? (
          <>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setMode('edit')}
            >
              Modifier
            </Button>
            <Button
              size="sm"
              variant={user.isBlocked ? 'secondary' : 'danger'}
              onClick={toggleBlock}
            >
              {user.isBlocked ? 'Débloquer' : 'Bloquer'}
            </Button>
            <Button size="sm" variant="danger" onClick={() => setConfirmOpen(true)}>
              Supprimer
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
            <Input
              id={`admin-name-${user.id}`}
              label=""
              required
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="text-sm w-32"
            />
            <label className="flex items-center gap-1 text-xs text-stone-600">
              <input
                type="checkbox"
                checked={editing.role === 'ADMIN'}
                onChange={(e) => setEditing({ ...editing, role: e.target.checked ? 'ADMIN' : 'USER' })}
              />
              Admin
            </label>
            <label className="flex items-center gap-1 text-xs text-stone-600">
              <input
                type="checkbox"
                checked={editing.isOk}
                onChange={(e) => setEditing({ ...editing, isOk: e.target.checked })}
              />
              Compte validé
            </label>
            <label className="flex items-center gap-1 text-xs text-stone-600">
              <input
                type="checkbox"
                checked={editing.isBlocked}
                onChange={(e) => setEditing({ ...editing, isBlocked: e.target.checked })}
              />
              Bloqué
            </label>
            <Button type="submit" size="sm" loading={updateUser.isPending}>
              Enregistrer
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setMode('view')}>
              Annuler
            </Button>
          </form>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        title="Supprimer l'utilisateur"
        description={`Le compte « ${user.name} » sera définitivement supprimé.`}
        destructive
      />
    </div>
  );
}
