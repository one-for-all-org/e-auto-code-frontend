import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCreateUser } from '@/features/admin/hooks/useAdmin';

export function AdminUserForm() {
  const createUser = useCreateUser();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' as 'USER' | 'ADMIN' });
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    createUser.mutate(form, {
      onSuccess: () => {
        setForm({ name: '', email: '', password: '', role: 'USER' });
        setMessage('Utilisateur créé.');
      },
    });
  };

  return (
    <Card className="w-full max-w-7xl">
      <div>
        <h2 className="text-base font-semibold text-stone-900">Créer un utilisateur</h2>
        <p className="mt-1 text-sm text-stone-500">Renseignez les informations du nouveau compte.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <Input
          id="admin-name"
          label="Nom"
          required
          value={form.name}
          autoComplete="name"
          onChange={(e) => {
            setMessage('');
            createUser.reset();
            setForm({ ...form, name: e.target.value });
          }}
        />
        <Input
          id="admin-email"
          label="Email"
          type="email"
          required
          value={form.email}
          autoComplete="email"
          onChange={(e) => {
            setMessage('');
            createUser.reset();
            setForm({ ...form, email: e.target.value });
          }}
        />
        <Input
          id="admin-password"
          label="Mot de passe"
          type="password"
          minLength={8}
          required
          value={form.password}
          autoComplete="new-password"
          onChange={(e) => {
            setMessage('');
            createUser.reset();
            setForm({ ...form, password: e.target.value });
          }}
        />
        <div className="flex min-h-10 items-center sm:pt-5">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-stone-300 text-teal-700 focus:ring-teal-600"
              checked={form.role === 'ADMIN'}
              onChange={(e) => setForm({ ...form, role: e.target.checked ? 'ADMIN' : 'USER' })}
            />
            Administrateur
          </label>
        </div>
        {createUser.error && (
          <p role="alert" className="col-span-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {createUser.error.message}
          </p>
        )}
        {message && (
          <p role="status" className="col-span-full rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
            {message}
          </p>
        )}
        <div className="col-span-full flex justify-end border-t border-stone-200 pt-4">
          <Button type="submit" loading={createUser.isPending} className="w-full sm:w-auto">
            Créer l’utilisateur
          </Button>
        </div>
      </form>
    </Card>
  );
}
