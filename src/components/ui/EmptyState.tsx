import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-200">
        <Icon size={22} />
      </span>
      <h2 className="text-base font-semibold text-stone-800 dark:text-stone-100">{title}</h2>
      {description && <p className="max-w-sm text-sm text-stone-500">{description}</p>}
      {action}
    </div>
  );
}
