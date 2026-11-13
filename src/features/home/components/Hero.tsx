import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HERO_VIDEO from '@/assets/video_demo.mp4';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="bg-background py-14 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-in-up text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('home.heroTitle')}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-stone-600 lg:mx-0">
            {t('home.heroSubtitle')}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-[hsl(var(--primary-end))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t('home.createAccount')}
            </Link>
            <Link
              to="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t('home.login')}
            </Link>
          </div>
          <p className="mt-6 text-sm text-stone-500">{t('home.heroMeta')}</p>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <video
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            aria-label={t('home.heroImageAlt')}
            className="block h-56 w-full rounded-2xl border border-primary/40 object-contain shadow-surface hover:-translate-y-1 hover:shadow-surface-hover transition-transform duration-300 ease-out sm:h-80 lg:h-[400px]"
          />
        </div>
      </div>
    </section>
  );
}
