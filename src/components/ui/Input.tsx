import { forwardRef, type InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ id, label, error, className = '', ...props }, ref) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        {...props}
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-stone-800 placeholder:text-stone-400 transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/25 ${error ? 'border-red-400' : 'border-stone-300'} ${className}`}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
