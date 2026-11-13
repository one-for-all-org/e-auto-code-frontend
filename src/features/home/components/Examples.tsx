import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Examples() {
  const { t } = useTranslation();
  const questions = t('home.exampleQuestions', { returnObjects: true }) as string[];

  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">{t('home.examplesTitle')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-stone-600">
          {t('home.examplesNote')}
        </p>
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {questions.map((question) => (
            <Link
              key={question}
              to="/register"
              className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {question}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
