import type { ReactNode } from 'react';
import { Signpost } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: Props) {
  const { t } = useTranslation();
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:py-12">
      <header className="absolute right-3 top-3 flex items-center gap-2 sm:right-5 sm:top-5">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>
      <div className="mt-20 w-full max-w-md sm:mt-0">
        <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <Signpost size={22} />
          </span>
          <p className="mt-4 text-sm font-medium text-muted-foreground">{t('auth.brandCaption')}</p>
          <span className="mt-2 h-1 w-10 rounded-full bg-amber-400" />
        </div>
        <Card className="p-5 sm:p-8">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </Card>
        <p className="mt-5 text-center text-sm text-muted-foreground sm:mt-6">{footer}</p>
      </div>
    </div>
  );
}
