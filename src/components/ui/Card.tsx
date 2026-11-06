import type { ReactNode } from 'react';

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-lg border border-stone-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}
