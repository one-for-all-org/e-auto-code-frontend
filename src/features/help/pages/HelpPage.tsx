import { ArrowRight, FileImage, Lightbulb, MessageCircleQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

type HelpTip = { title: string; description: string };

export default function HelpPage() {
  const { t } = useTranslation();
  const tips = t('help.tips', { returnObjects: true }) as HelpTip[];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <header>
        <p className="text-sm font-semibold text-primary">{t('common.nav.help')}</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">{t('help.title')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('help.intro')}</p>
      </header>

      <Card>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileImage size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-card-foreground">{t('help.files.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('help.files.description')}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lightbulb size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-card-foreground">{t('help.tipsTitle')}</h2>
            <ul className="mt-4 space-y-3">
              {tips.map(({ title, description }, index) => (
                <li key={title} className="flex gap-3 rounded-lg border border-border p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-card-foreground">{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <MessageCircleQuestion className="mt-0.5 shrink-0 text-primary" size={20} aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-card-foreground">{t('help.readyTitle')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('help.readyDescription')}</p>
          </div>
        </div>
        <Link
          to="/chat"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[background-image:var(--accent-gradient)] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-surface hover:-translate-y-0.5 hover:shadow-surface-hover active:shadow-surface-pressed transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('help.goToChat')}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Card>
    </div>
  );
}
