import type { ReactNode } from 'react';
import { Signpost } from 'lucide-react';
import { Card } from '@/components/ui/Card';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <Signpost size={22} />
          </span>
          <p className="mt-4 text-sm font-medium text-stone-600">Code de la route · Madagascar</p>
          <span className="mt-2 h-1 w-10 rounded-full bg-amber-400" />
        </div>
        <Card className="p-8">
          <h1 className="text-2xl font-semibold text-stone-900">{title}</h1>
          <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </Card>
        <p className="mt-6 text-center text-sm text-stone-500">{footer}</p>
      </div>
    </div>
  );
}
