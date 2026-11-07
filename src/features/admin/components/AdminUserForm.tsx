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
    createUser.mutate(form, {
      onSuccess: () => {
        setForm({ name: '', email: '', password: '', role: 'USER' });
        setMessage('Utilisateur créé.');
      },
    });
  };

  return (
    <Card>
      <h2 className="text-base font-semibold text-stone-900">Créer un utilisateur</h2>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="admin-name"
          label="Nom"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          id="admin-email"
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          id="admin-password"
          label="Mot de passe (8 min)"
          type="password"
          minLength={8}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="col-span-2">
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={form.role === 'ADMIN'}
              onChange={(e) => setForm({ ...form, role: e.target.checked ? 'ADMIN' : 'USER' })}
            />
            Administrateur
          </label>
        </div>
        {createUser.error && (
          <p role="alert" className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {createUser.error.message}
          </p>
        )}
        {message && <p className="col-span-2 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{message}</p>}
        <Button type="submit" loading={createUser.isPending} className="w-full sm:auto">
          Créer
        </Button>
      </form>
    </Card>
  );
}
