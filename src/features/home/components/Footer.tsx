import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
        <p className="flex items-center justify-center gap-2 font-bold text-primary">
          <span aria-hidden="true">🚦</span>
          {t('common.brand')} · {t('common.madagascar')}
        </p>
        <nav aria-label={t('common.mainNavigation')} className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium">
          <Link to="/" className="text-stone-600 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            {t('home.footerHome')}
          </Link>
          <Link to="/login" className="text-stone-600 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            {t('home.login')}
          </Link>
          <Link to="/register" className="text-stone-600 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            {t('home.createAccount')}
          </Link>
        </nav>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-stone-600">{t('home.footerTagline')}</p>
        <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-stone-500">{t('home.footerDisclaimer')}</p>
      </div>
    </footer>
  );
}
