import { Signpost } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  disabled: boolean;
  onPick: (question: string) => void;
};

export function WelcomeScreen({ disabled, onPick }: Props) {
  const { t } = useTranslation();
  const questions = (t('home.exampleQuestions', { returnObjects: true }) as string[]).slice(0, 4);
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-7 px-4 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Signpost size={26} />
      </span>
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t('chat.welcomeTitle')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {t('chat.welcomeText')}
        </p>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-3">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onPick(question)}
            className="rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
