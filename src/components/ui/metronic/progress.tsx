// Metronic Progress Component - Adapted for VigorLog
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const progressVariants = cva('relative w-full overflow-hidden rounded-full bg-secondary', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
      xl: 'h-4',
    },
    variant: {
      default: '',
      health: '',
      striped: '',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-500 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
        info: 'bg-blue-500',
        // Health-specific variants
        excellent: 'bg-gradient-to-r from-green-400 to-green-600',
        good: 'bg-gradient-to-r from-lime-400 to-lime-600',
        moderate: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
        poor: 'bg-gradient-to-r from-red-400 to-red-600',
      },
      striped: {
        true: 'bg-stripes bg-stripes-primary',
      },
      animated: {
        true: 'animate-progress-stripes',
      },
    },
    defaultVariants: {
      variant: 'default',
      striped: false,
      animated: false,
    },
  }
);

interface MetronicProgressProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
  indicatorVariant?: VariantProps<typeof progressIndicatorVariants>['variant'];
  striped?: boolean;
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
}

const MetronicProgress = React.forwardRef<HTMLDivElement, MetronicProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100,
    size,
    variant,
    indicatorClassName,
    indicatorVariant = 'default',
    striped = false,
    animated = false,
    showLabel = false,
    label,
    ...props 
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    return (
      <div className="w-full">
        {showLabel && (
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(progressVariants({ size, variant }), className)}
          {...props}
        >
          <div
            className={cn(
              progressIndicatorVariants({ 
                variant: indicatorVariant, 
                striped, 
                animated: animated && striped 
              }),
              indicatorClassName
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
      </div>
    );
  }
);

MetronicProgress.displayName = 'MetronicProgress';

// Health-specific progress component
interface HealthMetricProgressProps extends Omit<MetronicProgressProps, 'indicatorVariant'> {
  metric: 'sleep' | 'fatigue' | 'soreness' | 'mood' | 'pain' | 'stress';
  value: number;
}

const HealthMetricProgress: React.FC<HealthMetricProgressProps> = ({ 
  metric, 
  value, 
  ...props 
}) => {
  const getHealthStatus = (val: number): 'excellent' | 'good' | 'moderate' | 'poor' => {
    if (val >= 80) return 'excellent';
    if (val >= 60) return 'good';
    if (val >= 40) return 'moderate';
    return 'poor';
  };

  const metricLabels = {
    sleep: 'Schlafqualität',
    fatigue: 'Müdigkeit',
    soreness: 'Muskelkater',
    mood: 'Stimmung',
    pain: 'Schmerzen',
    stress: 'Stress',
  };

  const isInverted = ['fatigue', 'soreness', 'pain', 'stress'].includes(metric);
  const displayValue = isInverted ? 100 - value : value;
  const status = getHealthStatus(displayValue);

  return (
    <MetronicProgress
      value={displayValue}
      indicatorVariant={status}
      label={metricLabels[metric]}
      showLabel
      size="lg"
      {...props}
    />
  );
};

// Multi-progress component for multiple values
interface MultiProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  values: Array<{
    value: number;
    variant?: VariantProps<typeof progressIndicatorVariants>['variant'];
    label?: string;
  }>;
  max?: number;
  size?: VariantProps<typeof progressVariants>['size'];
}

const MultiProgress: React.FC<MultiProgressProps> = ({ 
  values, 
  max = 100, 
  size = 'md',
  className,
  ...props 
}) => {
  const total = values.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-secondary flex',
        size === 'sm' && 'h-1',
        size === 'md' && 'h-2',
        size === 'lg' && 'h-3',
        size === 'xl' && 'h-4',
        className
      )}
      {...props}
    >
      {values.map((item, index) => {
        const percentage = Math.min(100, Math.max(0, (item.value / max) * 100));
        return (
          <div
            key={index}
            className={cn(
              'h-full transition-all duration-500',
              progressIndicatorVariants({ variant: item.variant || 'default' })
            )}
            style={{ width: `${percentage}%` }}
            title={item.label}
          />
        );
      })}
    </div>
  );
};

// CSS for striped animation
const stripedStyles = `
  @keyframes progress-stripes {
    0% { background-position: 1rem 0; }
    100% { background-position: 0 0; }
  }
  
  .animate-progress-stripes {
    animation: progress-stripes 1s linear infinite;
  }
  
  .bg-stripes {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, .15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, .15) 50%,
      rgba(255, 255, 255, .15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = stripedStyles;
  document.head.appendChild(styleSheet);
}

export { MetronicProgress, HealthMetricProgress, MultiProgress };