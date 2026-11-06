import { Signpost } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SUGGESTIONS = [
  'Quelles sont les règles de priorité à un carrefour ?',
  'Quels documents dois-je avoir sur moi en conduisant ?',
  'Que dois-je savoir sur les feux de signalisation ?',
];

type Props = {
  disabled: boolean;
  onPick: (question: string) => void;
};

export function WelcomeScreen({ disabled, onPick }: Props) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <Signpost size={26} />
      </span>
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Bonjour, posez votre question</h2>
        <p className="mt-2 text-sm leading-normal text-stone-500">
          Je vous aide à réviser le code de la route à Madagascar, avec des réponses courtes et claires.
        </p>
      </div>
      <div className="grid w-full gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="secondary"
            disabled={disabled}
            onClick={() => onPick(suggestion)}
            className="h-auto justify-between whitespace-normal py-3 text-left font-normal hover:border-teal-600 hover:text-teal-800"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
