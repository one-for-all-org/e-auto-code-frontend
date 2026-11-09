import { BookOpenCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useMe } from '@/features/profile/hooks/useProfile';
import type { RoadRole } from '@/types';
import { useTranslation } from 'react-i18next';

type GuidanceContent = { title: string; intro: string; tips: string[] };

export default function GoodPracticesPage() {
  const { t } = useTranslation();
  const me = useMe();

  if (me.isPending) return <Spinner className="mx-auto mt-10" />;
  if (me.isError || !me.data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <EmptyState icon={BookOpenCheck} title={t('profile.unavailable')} description={me.error?.message} />
      </div>
    );
  }

  const roadRole: RoadRole = me.data.roadRole ?? 'CITIZEN';
  const content = t(`guidance.roles.${roadRole}`, { returnObjects: true }) as GuidanceContent;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <header>
        <p className="text-sm font-semibold text-primary">{t(`common.roadRoles.${roadRole}`)}</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">{t('guidance.title')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('guidance.subtitle')}</p>
      </header>
      <Card>
        <h2 className="text-lg font-semibold text-card-foreground">{content.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.intro}</p>
        <ul className="mt-5 space-y-3">
          {content.tips.map((tip, index) => (
            <li key={tip} className="flex gap-3 rounded-lg border border-border p-3 text-sm leading-relaxed text-card-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <Link to="/profile" className="mt-5 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline">
          {t('profile.editRoadRole')}
        </Link>
      </Card>
    </div>
  );
}
