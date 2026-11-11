import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
  {
    variants: {
      variant: {
        primary: 'bg-[background-image:var(--accent-gradient)] bg-primary text-primary-foreground shadow-surface hover:-translate-y-0.5 hover:shadow-surface-hover active:translate-y-0 active:shadow-surface-pressed',
        secondary: 'border border-input bg-card text-foreground shadow-sm hover:bg-accent hover:-translate-y-0.5 active:translate-y-0',
        ghost: 'text-foreground hover:bg-accent hover:-translate-y-0.5 active:translate-y-0',
        danger: 'bg-red-700 text-white shadow-surface hover:-translate-y-0.5 hover:shadow-surface-hover active:translate-y-0 active:shadow-surface-pressed hover:bg-red-800',
      },
      size: {
        sm: 'h-8 gap-1.5 px-3 text-xs',
        md: 'h-10 gap-2 px-4 text-sm',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant, size, loading, disabled, className, children, asChild = false, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild) {
    return (
      <Slot {...props} ref={ref} className={classes}>
        {children}
      </Slot>
    );
  }
  return (
    <button
      {...props}
      ref={ref}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
