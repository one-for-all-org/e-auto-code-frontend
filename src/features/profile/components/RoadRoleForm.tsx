import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useUpdateMe } from '@/features/profile/hooks/useProfile';
import type { RoadRole, User } from '@/types';
import { useTranslation } from 'react-i18next';

const roadRoles: RoadRole[] = ['DRIVER', 'PASSENGER', 'PEDESTRIAN', 'CITIZEN'];

export function RoadRoleForm({ user }: { user: User }) {
  const { t } = useTranslation();
  const updateMe = useUpdateMe();
  const [roadRole, setRoadRole] = useState(user.roadRole);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (roadRole !== user.roadRole) updateMe.mutate({ roadRole });
  };

  return (
    <Card>
      <h2 className="text-base font-semibold text-card-foreground">{t('profile.roadRole')}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('profile.roadRoleHint')}</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label htmlFor="profile-road-role" className="block text-sm font-medium text-card-foreground">
          {t('profile.roadRole')}
        </label>
        <select
          id="profile-road-role"
          value={roadRole}
          disabled={updateMe.isPending}
          onChange={(event) => setRoadRole(event.target.value as RoadRole)}
          className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {roadRoles.map((role) => (
            <option key={role} value={role}>{t(`common.roadRoles.${role}`)}</option>
          ))}
        </select>
        {updateMe.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {updateMe.error.message}
          </p>
        )}
        {updateMe.isSuccess && !updateMe.isPending && roadRole === user.roadRole && (
          <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
            {t('profile.roadRoleUpdated')}
          </p>
        )}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            loading={updateMe.isPending}
            disabled={roadRole === user.roadRole}
          >
            {t('common.actions.save')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
