import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { AdminUserForm } from '@/features/admin/components/AdminUserForm';
import { AdminUserRow } from '@/features/admin/components/AdminUserRow';
import { AdminKnowledge } from '@/features/admin/components/AdminKnowledge';
import { useListUsers } from '@/features/admin/hooks/useAdmin';
import type { User } from '@/types';

export default function AdminPage() {
  const usersQuery = useListUsers();

  if (usersQuery.isPending) return <Spinner className="mx-auto mt-10" />;
  if (usersQuery.isError) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 text-center">
        <EmptyState icon={AlertCircle} title="Erreur" description={usersQuery.error.message} />
      </div>
    );
  }

  const users: User[] = usersQuery.data ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Administration</h1>
          <p className="mt-1 text-sm text-stone-500">Gérez les comptes et les leçons partagées avec l’assistant.</p>
        </div>
      </div>

      <div className="mb-6">
        <AdminUserForm />
      </div>

      <div className="mb-6">
        <AdminKnowledge />
      </div>

      <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-stone-900">Utilisateurs ({users.length})</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {users.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-stone-500">Aucun utilisateur.</p>
            </div>
          ) : (
            users.map((user) => (
              <AdminUserRow key={user.id} user={user} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
