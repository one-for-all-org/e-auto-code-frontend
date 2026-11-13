import { useTranslation } from 'react-i18next';
import { MessageCircleQuestion, SlidersHorizontal, UserPlus } from 'lucide-react';

const stepIcons = [UserPlus, SlidersHorizontal, MessageCircleQuestion];

type Step = { title: string; text: string };

export function HowItWorks() {
  const { t } = useTranslation();
  const steps = t('home.howSteps', { returnObjects: true }) as Step[];

  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">{t('home.howTitle')}</h2>
        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute inset-x-[17%] top-[1.05rem] hidden border-t border-border lg:block"
          />
          <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-8">
            {steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <li key={step.title} className="text-center">
                  <span className="inline-block text-4xl font-bold text-amber-500 lg:bg-white lg:px-2">
                    {`0${index + 1}`}
                  </span>
                  <div className="mt-4 flex justify-center">
                    <Icon className="text-primary" size={22} aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-stone-600">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
