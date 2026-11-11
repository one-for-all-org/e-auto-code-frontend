import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useUpdateUser, useDeleteUser } from '@/features/admin/hooks/useAdmin';
import type { User } from '@/types';
import { useTranslation } from 'react-i18next';

type Props = { user: User };

export function AdminUserRow({ user }: Props) {
  const { t } = useTranslation();
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
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-surface hover:-translate-y-0.5 hover:shadow-surface-hover transition-transform duration-250 ease-out sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-stone-900 truncate">{user.name}</p>
        <p className="text-xs text-stone-500 truncate">{user.email}</p>
        <p className="text-xs text-stone-400">
          {user.role === 'ADMIN' ? t('common.admin.administrator') : t('profile.roleUser')} · {user.isOk ? t('common.admin.validated') : t('common.admin.checkAccount')} · {user.isBlocked ? t('common.admin.blocked') : t('common.admin.active')}
        </p>
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        {mode === 'view' ? (
          <>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setMode('edit')}
              className="flex-1 sm:flex-none"
            >
              {t('common.admin.edit')}
            </Button>
            <Button
              size="sm"
              variant={user.isBlocked ? 'secondary' : 'danger'}
              onClick={toggleBlock}
              className="flex-1 sm:flex-none"
            >
              {user.isBlocked ? t('common.admin.unblock') : t('common.admin.block')}
            </Button>
            <Button size="sm" variant="danger" onClick={() => setConfirmOpen(true)} className="flex-1 sm:flex-none">
              {t('common.admin.delete')}
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto">
            <Input
              id={`admin-name-${user.id}`}
              label=""
              required
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full text-sm sm:w-32"
            />
            <label className="flex items-center gap-1 text-xs text-stone-600">
              <input
                type="checkbox"
                checked={editing.role === 'ADMIN'}
                onChange={(e) => setEditing({ ...editing, role: e.target.checked ? 'ADMIN' : 'USER' })}
              />
              {t('common.admin.administrator')}
            </label>
            <label className="flex items-center gap-1 text-xs text-stone-600">
              <input
                type="checkbox"
                checked={editing.isOk}
                onChange={(e) => setEditing({ ...editing, isOk: e.target.checked })}
              />
              {t('common.admin.validated')}
            </label>
            <label className="flex items-center gap-1 text-xs text-stone-600">
              <input
                type="checkbox"
                checked={editing.isBlocked}
                onChange={(e) => setEditing({ ...editing, isBlocked: e.target.checked })}
              />
              {t('common.admin.blocked')}
            </label>
            <Button type="submit" size="sm" loading={updateUser.isPending}>
              {t('common.actions.save')}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setMode('view')}>
              {t('common.admin.cancel')}
            </Button>
          </form>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        title={t('common.admin.deleteUserTitle')}
        description={t('common.admin.deleteUserDescription', { name: user.name })}
        destructive
      />
    </div>
  );
}
