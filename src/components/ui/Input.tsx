import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { id, label, error, className, type = 'text', ...props },
  ref,
) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { t } = useTranslation();
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          id={id}
          ref={ref}
          type={type === 'password' && passwordVisible ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            type === 'password' && 'pr-10',
            error && 'border-red-500',
            className,
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            aria-label={passwordVisible ? t('common.password.hide') : t('common.password.show')}
            aria-pressed={passwordVisible}
            onClick={() => setPasswordVisible((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            {passwordVisible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && <p id={errorId} className="text-sm text-red-600">{error}</p>}
    </div>
  );
});
