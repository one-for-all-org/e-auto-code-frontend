import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { Benefits } from '../components/Benefits';
import { Examples } from '../components/Examples';
import { Languages } from '../components/Languages';
import { FinalCta } from '../components/FinalCta';
import { Footer } from '../components/Footer';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md shadow-sm">
        <nav aria-label={t('common.mainNavigation')} className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span aria-hidden="true">🚦</span>
            <span>{t('common.brand')} · {t('common.madagascar')}</span>
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <Examples />
        <Languages />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
