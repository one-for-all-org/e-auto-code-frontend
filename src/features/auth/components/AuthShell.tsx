import type { ReactNode } from 'react';
import { Signpost } from 'lucide-react';
import { FR, GB, MG } from 'country-flag-icons/react/3x2';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

const languageFlags = [
  { code: 'fr', Flag: FR },
  { code: 'en', Flag: GB },
  { code: 'mg', Flag: MG },
] as const;

export function AuthShell({ title, subtitle, children, footer }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="relative hidden w-[42%] max-w-xl flex-col justify-between overflow-hidden bg-[hsl(173_58%_16%)] p-10 lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,hsl(173_55%_30%_/_0.55),transparent_70%)]"
        />
        <div className="relative flex items-center gap-2.5 text-[hsl(0_0%_100%)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(173_55%_28%)]">
            <Signpost size={18} />
          </span>
          <span className="text-sm font-semibold">{t('common.brand')} · {t('common.madagascar')}</span>
        </div>
        <div className="relative">
          <p className="text-3xl font-bold leading-tight text-[hsl(0_0%_100%)]">
            {t('auth.panelTagline')}
          </p>
          <span aria-hidden="true" className="mt-5 block h-1 w-12 rounded-full bg-amber-400" />
        </div>
        <div className="relative flex items-center gap-5">
          {languageFlags.map(({ code, Flag }) => (
            <span key={code} className="flex items-center gap-2 text-xs font-medium text-[hsl(173_20%_85%)]">
              <Flag aria-hidden="true" className="h-4 w-6 rounded-sm object-cover" />
              {t(`common.languages.${code}`)}
            </span>
          ))}
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
        <header className="absolute right-3 top-3 flex items-center gap-2 sm:right-6 sm:top-5">
          <LanguageSwitcher />
          <ThemeToggle />
        </header>
        <div className="w-full max-w-md">
          <div className="mb-7 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Signpost size={20} />
            </span>
            <span className="text-sm font-semibold text-foreground">
              {t('common.brand')} · {t('common.madagascar')}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <p className="mt-6 text-sm text-stone-600">{footer}</p>
        </div>
      </main>
    </div>
  );
}
