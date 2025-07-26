// Metronic Badge Component - Adapted for VigorLog
import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

const metronicBadgeVariants = cva(
  'inline-flex items-center justify-center border border-transparent font-medium focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:-ms-px [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white',
        outline: 'bg-transparent border border-border text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        // VigorLog specific
        health: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
        streak: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      },
      appearance: {
        default: '',
        light: '',
        outline: '',
        ghost: 'border-transparent bg-transparent',
      },
      size: {
        lg: 'rounded-md px-2 h-7 min-w-7 gap-1.5 text-xs [&_svg]:size-3.5',
        md: 'rounded-md px-1.5 h-6 min-w-6 gap-1.5 text-xs [&_svg]:size-3.5',
        sm: 'rounded-sm px-1 h-5 min-w-5 gap-1 text-[0.6875rem] leading-[0.75rem] [&_svg]:size-3',
        xs: 'rounded-sm px-0.5 h-4 min-w-4 gap-1 text-[0.625rem] leading-[0.5rem] [&_svg]:size-3',
      },
      shape: {
        default: '',
        circle: 'rounded-full',
      },
    },
    compoundVariants: [
      // Light variants
      {
        variant: 'primary',
        appearance: 'light',
        className: 'text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
      },
      {
        variant: 'success',
        appearance: 'light',
        className: 'text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-400',
      },
      {
        variant: 'warning',
        appearance: 'light',
        className: 'text-yellow-700 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400',
      },
      {
        variant: 'info',
        appearance: 'light',
        className: 'text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
      },
      {
        variant: 'destructive',
        appearance: 'light',
        className: 'text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-400',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      appearance: 'default',
      size: 'md',
    },
  },
);

interface MetronicBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof metronicBadgeVariants> {
  closable?: boolean;
  onClose?: () => void;
  dot?: boolean;
  dotClassName?: string;
}

const MetronicBadge = React.forwardRef<HTMLSpanElement, MetronicBadgeProps>(
  ({ className, variant, size, appearance, shape, closable, onClose, dot, dotClassName, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(metronicBadgeVariants({ variant, size, appearance, shape }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn('size-1.5 rounded-full bg-current opacity-75', dotClassName)}
          />
        )}
        {children}
        {closable && (
          <button
            onClick={onClose}
            className="ml-1 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-black/10"
            aria-label="Remove"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </span>
    );
  }
);

MetronicBadge.displayName = 'MetronicBadge';

// Badge Group Component
interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
}

const BadgeGroup: React.FC<BadgeGroupProps> = ({ children, max = 3, className, ...props }) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={cn('inline-flex flex-wrap gap-1', className)} {...props}>
      {visibleChildren}
      {remainingCount > 0 && (
        <MetronicBadge variant="secondary" size="sm">
          +{remainingCount}
        </MetronicBadge>
      )}
    </div>
  );
};

// Health Status Badge for VigorLog
interface HealthStatusBadgeProps extends Omit<MetronicBadgeProps, 'variant'> {
  status: 'excellent' | 'good' | 'moderate' | 'poor';
}

const HealthStatusBadge: React.FC<HealthStatusBadgeProps> = ({ status, ...props }) => {
  const statusConfig = {
    excellent: { variant: 'success' as const, label: 'Exzellent' },
    good: { variant: 'info' as const, label: 'Gut' },
    moderate: { variant: 'warning' as const, label: 'Mittel' },
    poor: { variant: 'destructive' as const, label: 'Schlecht' },
  };

  const config = statusConfig[status];

  return (
    <MetronicBadge variant={config.variant} appearance="light" {...props}>
      {config.label}
    </MetronicBadge>
  );
};

// Streak Badge for VigorLog
interface StreakBadgeProps extends Omit<MetronicBadgeProps, 'variant'> {
  days: number;
  useEmoji?: boolean;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ days, useEmoji = false, ...props }) => {
  const getStreakLevel = (d: number) => {
    if (d >= 30) return { 
      size: 'lg' as const, 
      emoji: '🔥',
      faIcon: 'fa-solid fa-fire',
      color: 'text-orange-500'
    };
    if (d >= 7) return { 
      size: 'md' as const, 
      emoji: '⚡',
      faIcon: 'fa-solid fa-bolt',
      color: 'text-yellow-500'
    };
    return { 
      size: 'sm' as const, 
      emoji: '✨',
      faIcon: 'fa-solid fa-sparkles',
      color: 'text-blue-500'
    };
  };

  const level = getStreakLevel(days);

  return (
    <MetronicBadge variant="streak" size={level.size} shape="circle" {...props}>
      {useEmoji ? (
        <span className="mr-1">{level.emoji}</span>
      ) : (
        <i className={`${level.faIcon} ${level.color} mr-1.5`} />
      )}
      {days}
    </MetronicBadge>
  );
};

// Achievement Badge for VigorLog
interface AchievementBadgeProps extends Omit<MetronicBadgeProps, 'variant'> {
  type: 'first-checkin' | 'week-streak' | 'month-streak' | 'perfect-week' | 'team-player';
  useEmoji?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ type, useEmoji = false, ...props }) => {
  const achievements = {
    'first-checkin': { 
      emoji: '🎯', 
      faIcon: 'fa-solid fa-bullseye',
      label: 'Erster Check-in', 
      variant: 'info' as const 
    },
    'week-streak': { 
      emoji: '📅', 
      faIcon: 'fa-solid fa-calendar-week',
      label: '7 Tage Streak', 
      variant: 'success' as const 
    },
    'month-streak': { 
      emoji: '🏆', 
      faIcon: 'fa-solid fa-trophy',
      label: '30 Tage Streak', 
      variant: 'warning' as const 
    },
    'perfect-week': { 
      emoji: '⭐', 
      faIcon: 'fa-solid fa-star',
      label: 'Perfekte Woche', 
      variant: 'health' as const 
    },
    'team-player': { 
      emoji: '🤝', 
      faIcon: 'fa-solid fa-handshake',
      label: 'Team Player', 
      variant: 'primary' as const 
    },
  };

  const achievement = achievements[type];

  return (
    <MetronicBadge variant={achievement.variant} size="lg" className="px-3" {...props}>
      {useEmoji ? (
        <span className="mr-1.5">{achievement.emoji}</span>
      ) : (
        <i className={`${achievement.faIcon} mr-2`} />
      )}
      {achievement.label}
    </MetronicBadge>
  );
};

export { 
  MetronicBadge, 
  BadgeGroup, 
  HealthStatusBadge, 
  StreakBadge, 
  AchievementBadge,
  metronicBadgeVariants 
};