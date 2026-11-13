import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="bg-[hsl(173_58%_20%)] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-[hsl(0_0%_100%)] sm:text-4xl">{t('home.ctaTitle')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[hsl(173_25%_88%)]">
          {t('home.ctaSubtitle')}
        </p>
        <Link
          to="/register"
          className="mt-9 inline-flex min-h-12 items-center justify-center rounded-lg bg-[hsl(0_0%_100%)] px-8 py-3 text-base font-semibold text-[hsl(173_58%_20%)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(0_0%_100%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(173_58%_20%)]"
        >
          {t('home.ctaButton')}
        </Link>
      </div>
    </section>
  );
}
