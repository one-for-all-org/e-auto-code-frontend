import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-end))] active:bg-primary',
        secondary: 'border border-input bg-card text-foreground hover:bg-accent active:bg-background',
        ghost: 'text-foreground hover:bg-accent active:bg-background',
        danger: 'bg-red-700 text-white hover:bg-red-800 active:bg-red-700',
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
