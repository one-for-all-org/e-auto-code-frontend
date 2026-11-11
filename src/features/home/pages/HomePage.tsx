import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, ChevronDown, Clock3, Footprints, Mail, MessageCircleQuestion, MessagesSquare, ShieldCheck, Users } from 'lucide-react';
import { FR, GB, MG } from 'country-flag-icons/react/3x2';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import SOURCE_DOCUMENT from '@/assets/D71-138-VF.pdf?url';
import HERO_VIDEO from '@/assets/video_demo.mp4';

type CopyItem = { title: string; text: string };
type FaqItem = { question: string; answer: string };
const languageFlags = [
  { code: 'fr', Flag: FR },
  { code: 'en', Flag: GB },
  { code: 'mg', Flag: MG },
] as const;
const benefitIcons = [Clock3, MessageCircleQuestion, MessagesSquare];
const audienceIcons = [CarFront, Users, Footprints, ShieldCheck];
const contactEmail = 'jonicahenintsoa@gmail.com';

export default function HomePage() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const benefits = t('home.benefits', { returnObjects: true }) as CopyItem[];
  const audiences = t('home.audiences', { returnObjects: true }) as CopyItem[];
  const questions = t('home.questions', { returnObjects: true }) as string[];
  const faqs = t('home.faq', { returnObjects: true }) as FaqItem[];


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
        <section className="w-full py-12 sm:py-16 lg:py-20">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
            <div className="relative order-2 lg:order-1 rounded-xl">
              <video
                ref={videoRef}
                src={HERO_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                aria-label={t('home.heroImageAlt')}
                className="block h-56 w-full rounded-2xl border border-primary/40 object-contain shadow-surface hover:-translate-y-1 hover:shadow-surface-hover transition-transform duration-300 ease-out sm:h-80 lg:h-[400px]"
              />
            </div>
            <div className="order-1 text-center lg:order-2 lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t('common.madagascar')}</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t('home.heroTitle')}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                {t('home.heroSubtitle')}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[background-image:var(--accent-gradient)] bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-surface hover:-translate-y-1 hover:shadow-surface-hover active:shadow-surface-pressed transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {t('home.createAccount')}
                </Link>
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t('home.login')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="benefits-title" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 id="benefits-title" className="text-center text-2xl font-bold text-foreground sm:text-3xl">{t('home.benefitsTitle')}</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <div key={benefit.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                  <Icon className="mt-0.5 shrink-0 text-primary" size={22} aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-card-foreground">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="audiences-title" className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 id="audiences-title" className="text-center text-2xl font-bold text-card-foreground sm:text-3xl">{t('home.audienceTitle')}</h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">{t('home.audienceIntro')}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((audience, index) => {
                const Icon = audienceIcons[index];
                return (
                  <Card key={audience.title} className="h-full p-5">
                    <Icon className="text-primary" size={22} aria-hidden="true" />
                    <h3 className="mt-4 font-semibold text-card-foreground">{audience.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{audience.text}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section aria-labelledby="questions-title" className="bg-teal-50 dark:bg-teal-950/25">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 id="questions-title" className="text-center text-2xl font-bold text-foreground sm:text-3xl">{t('home.questionsTitle')}</h2>
            <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
              {questions.map((question) => (
                <div key={question} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-card-foreground">
                  <MessageCircleQuestion className="mt-0.5 shrink-0 text-primary" size={18} aria-hidden="true" />
                  <span>{question}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="languages-title" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-surface hover:-translate-y-0.5 hover:shadow-surface-hover transition-transform duration-250 ease-out sm:p-9">
            <h2 id="languages-title" className="text-2xl font-bold text-card-foreground">{t('home.languagesTitle')}</h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {languageFlags.map(({ code, Flag }) => (
                <div key={code} lang={code} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-card-foreground">
                  <Flag aria-hidden="true" className="h-5 w-7 rounded-sm object-cover" />
                  {t(`common.languages.${code}`)}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="source-title" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={19} aria-hidden="true" />
                <p className="text-sm font-semibold">{t('home.sourceLabel')}</p>
              </div>
              <h2 id="source-title" className="mt-2 text-lg font-bold text-card-foreground">{t('home.sourceTitle')}</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t('home.sourceDescription')}</p>
            </div>
            <a
              href={SOURCE_DOCUMENT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t('home.openSource')}
            </a>
          </div>
        </section>

        <section aria-labelledby="contact-title" className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 id="contact-title" className="text-2xl font-bold text-card-foreground sm:text-3xl">{t('home.contactTitle')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('home.contactIntro')}</p>
              <p className="mt-2 text-sm font-medium text-card-foreground">{t('home.contactContribution')}</p>
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="mx-auto mt-8 flex w-full max-w-xl items-center gap-4 rounded-2xl border border-border bg-background p-5 shadow-surface hover:-translate-y-0.5 hover:shadow-surface-hover active:shadow-surface-pressed transition-transform duration-200 ease-out hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail size={23} aria-hidden="true" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-sm font-semibold text-card-foreground">{t('home.contactEmail')}</span>
                <span className="mt-1 block break-all text-sm text-muted-foreground sm:text-base">{contactEmail}</span>
              </span>
            </a>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 id="faq-title" className="text-center text-2xl font-bold text-foreground sm:text-3xl">{t('home.faqTitle')}</h2>
          <div className="mx-auto mt-8 max-w-4xl space-y-3">
            {faqs.map(({ question, answer }) => (
              <details key={question} className="group rounded-2xl border border-border bg-card p-4 shadow-surface hover:-translate-y-0.5 hover:shadow-surface-hover transition-transform duration-250 ease-out sm:p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-card-foreground marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span>{question}</span>
                  <ChevronDown size={18} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
          <p className="text-sm font-semibold text-card-foreground">{t('home.disclaimerTitle')}</p>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t('home.disclaimer')}</p>
          <p className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">{t('home.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
