import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
  <div
    className={cn(
      'rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-surface hover:-translate-y-1 hover:shadow-surface-hover active:shadow-surface-pressed transition-transform duration-250 ease-out',
      className
    )}
  >
    {children}
  </div>
);
}
