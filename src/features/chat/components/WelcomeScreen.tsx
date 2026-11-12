import { Signpost } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

type Props = {
  disabled: boolean;
  onPick: (question: string) => void;
};

export function WelcomeScreen({ disabled, onPick }: Props) {
  const { t } = useTranslation();
  const suggestions = t('chat.suggestions', { returnObjects: true }) as string[];
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <Signpost size={26} />
      </span>
      <div>
        <h2 className="text-xl font-semibold text-stone-900">{t('chat.welcomeTitle')}</h2>
        <p className="mt-2 text-sm leading-normal text-stone-500">
          {t('chat.welcomeText')}
        </p>
      </div>
      <div className="grid w-full gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="secondary"
            disabled={disabled}
            onClick={() => onPick(suggestion)}
            className="h-auto justify-between whitespace-normal py-3 text-left font-normal hover:border-teal-600 hover:text-teal-800 hover:translate-y-0"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
