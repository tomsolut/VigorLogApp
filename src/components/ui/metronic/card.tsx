// Metronic Card Component - Adapted for VigorLog
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Define CardContext
type CardContextType = {
  variant: 'default' | 'accent' | 'health' | 'stats';
};

const CardContext = React.createContext<CardContextType>({
  variant: 'default',
});

// Hook to use CardContext
const useCardContext = () => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a Card component');
  }
  return context;
};

// Card Variants
const metronicCardVariants = cva('flex flex-col items-stretch text-card-foreground rounded-xl', {
  variants: {
    variant: {
      default: 'bg-card border border-border shadow-xs shadow-black/5',
      accent: 'bg-muted shadow-xs p-1',
      // VigorLog specific variants
      health: 'bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20',
      stats: 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardHeaderVariants = cva('flex items-center justify-between flex-wrap px-5 min-h-14 gap-2.5', {
  variants: {
    variant: {
      default: 'border-b border-border',
      accent: '',
      health: 'border-b border-green-500/20',
      stats: 'border-b border-primary/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardContentVariants = cva('grow p-5', {
  variants: {
    variant: {
      default: '',
      accent: 'bg-card rounded-t-xl [&:last-child]:rounded-b-xl',
      health: '',
      stats: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardFooterVariants = cva('flex items-center px-5 min-h-14', {
  variants: {
    variant: {
      default: 'border-t border-border',
      accent: 'bg-card rounded-b-xl mt-[2px]',
      health: 'border-t border-green-500/20',
      stats: 'border-t border-primary/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Card Component
interface MetronicCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof metronicCardVariants> {
  hover?: boolean;
}

function MetronicCard({ className, variant = 'default', hover = false, ...props }: MetronicCardProps) {
  return (
    <CardContext.Provider value={{ variant: variant || 'default' }}>
      <div
        data-slot="card"
        className={cn(
          metronicCardVariants({ variant }),
          hover && 'transition-all hover:shadow-lg hover:scale-[1.02]',
          className
        )}
        {...props}
      />
    </CardContext.Provider>
  );
}

// CardHeader Component
function MetronicCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return <div data-slot="card-header" className={cn(cardHeaderVariants({ variant }), className)} {...props} />;
}

// CardContent Component
function MetronicCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return <div data-slot="card-content" className={cn(cardContentVariants({ variant }), className)} {...props} />;
}

// CardFooter Component
function MetronicCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return <div data-slot="card-footer" className={cn(cardFooterVariants({ variant }), className)} {...props} />;
}

// Other Components
function MetronicCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-base font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function MetronicCardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-description" className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

// VigorLog specific card components
interface HealthScoreCardProps {
  score: number;
  trend: number;
  status: 'excellent' | 'good' | 'moderate' | 'poor';
}

function HealthScoreCard({ score, trend, status }: HealthScoreCardProps) {
  const statusColors = {
    excellent: 'text-green-600',
    good: 'text-lime-600',
    moderate: 'text-yellow-600',
    poor: 'text-red-600',
  };

  return (
    <MetronicCard variant="health" hover>
      <MetronicCardHeader>
        <MetronicCardTitle>Gesundheitsscore</MetronicCardTitle>
        <div className={cn('text-sm font-medium', statusColors[status])}>{status.toUpperCase()}</div>
      </MetronicCardHeader>
      <MetronicCardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
        <div className="mt-2 text-sm">
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-muted-foreground"> diese Woche</span>
        </div>
      </MetronicCardContent>
    </MetronicCard>
  );
}

export {
  MetronicCard,
  MetronicCardContent,
  MetronicCardDescription,
  MetronicCardFooter,
  MetronicCardHeader,
  MetronicCardTitle,
  HealthScoreCard,
};