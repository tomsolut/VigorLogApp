// Metronic Button Component - Adapted for VigorLog
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const metronicButtonVariants = cva(
  'cursor-pointer group whitespace-nowrap focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap text-sm font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 data-[state=open]:bg-primary/90',
        mono: 'bg-zinc-950 text-white dark:bg-zinc-300 dark:text-black hover:bg-zinc-950/90 dark:hover:bg-zinc-300/90 data-[state=open]:bg-zinc-950/90 dark:data-[state=open]:bg-zinc-300/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[state=open]:bg-destructive/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 data-[state=open]:bg-secondary/90',
        outline: 'bg-background text-accent-foreground border border-input hover:bg-accent data-[state=open]:bg-accent',
        ghost: 'text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        // VigorLog specific variants
        success: 'bg-green-500 text-white hover:bg-green-600 data-[state=open]:bg-green-600',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 data-[state=open]:bg-yellow-600',
        info: 'bg-blue-500 text-white hover:bg-blue-600 data-[state=open]:bg-blue-600',
      },
      size: {
        lg: 'h-10 rounded-md px-4 text-sm gap-1.5 [&_svg:not([class*=size-])]:size-4',
        md: 'h-8.5 rounded-md px-3 gap-1.5 text-[0.8125rem] leading-(--text-sm--line-height) [&_svg:not([class*=size-])]:size-4',
        sm: 'h-7 rounded-md px-2.5 gap-1.25 text-xs [&_svg:not([class*=size-])]:size-3.5',
        icon: 'size-8.5 rounded-md [&_svg:not([class*=size-])]:size-4 shrink-0',
      },
      shape: {
        default: '',
        circle: 'rounded-full',
      },
      mode: {
        default: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        icon: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        link: 'text-primary h-auto p-0 bg-transparent rounded-none hover:bg-transparent data-[state=open]:bg-transparent',
      },
    },
    compoundVariants: [
      // Shadow support
      {
        variant: 'primary',
        mode: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'success',
        mode: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'warning',
        mode: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'info',
        mode: 'default',
        className: 'shadow-xs shadow-black/5',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      mode: 'default',
      size: 'md',
      shape: 'default',
    },
  },
);

interface MetronicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof metronicButtonVariants> {
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const MetronicButton = React.forwardRef<HTMLButtonElement, MetronicButtonProps>(
  ({ className, variant, size, shape, mode, loading, icon: Icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <button
        className={cn(metronicButtonVariants({ variant, size, shape, mode }), className)}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {Icon && iconPosition === 'left' && !loading && <Icon className="h-4 w-4" />}
        {children}
        {Icon && iconPosition === 'right' && !loading && <Icon className="h-4 w-4" />}
      </button>
    );
  },
);

MetronicButton.displayName = 'MetronicButton';

export { MetronicButton, metronicButtonVariants };