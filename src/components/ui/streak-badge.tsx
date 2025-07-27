'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Icon, type IconName } from '@/components/ui/icon';

interface StreakBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
}

export function StreakBadge({
  count,
  size = 'md',
  showAnimation = true,
  className,
  showLabel = true,
  variant = 'default',
}: StreakBadgeProps) {
  if (count <= 0) return null;

  const sizeClasses = {
    sm: {
      badge: 'h-6 text-xs px-2',
      icon: 'w-3 h-3',
      gap: 'gap-1',
    },
    md: {
      badge: 'h-8 text-sm px-3',
      icon: 'w-4 h-4',
      gap: 'gap-1.5',
    },
    lg: {
      badge: 'h-10 text-base px-4',
      icon: 'w-5 h-5',
      gap: 'gap-2',
    },
  };

  const getStreakLevel = () => {
    if (count >= 100) return { color: 'text-purple-600', glow: 'glow-purple' };
    if (count >= 50) return { color: 'text-red-600', glow: 'glow-red' };
    if (count >= 30) return { color: 'text-orange-600', glow: 'glow-orange' };
    if (count >= 14) return { color: 'text-yellow-600', glow: 'glow-yellow' };
    if (count >= 7) return { color: 'text-orange-500', glow: 'glow-orange' };
    return { color: 'text-orange-500', glow: '' };
  };

  const { color, glow } = getStreakLevel();
  const styles = sizeClasses[size];

  return (
    <Badge
      variant={variant}
      className={cn(
        'relative overflow-hidden',
        styles.badge,
        styles.gap,
        'flex items-center',
        className
      )}
    >
      <Icon
        name="fire"
        className={cn(
          styles.icon,
          color,
          showAnimation && count >= 3 && 'animate-pulse',
          glow
        )}
      />
      <span className="font-bold tabular-nums">{count}</span>
      {showLabel && (
        <span className="font-normal">
          {count === 1 ? 'Tag' : 'Tage'}
        </span>
      )}
    </Badge>
  );
}

// Fire animation component for special streaks
export function StreakFire({
  intensity = 1,
  className,
}: {
  intensity?: number;
  className?: string;
}) {
  const flames = Math.min(Math.max(1, intensity), 5);
  
  return (
    <div className={cn('relative', className)}>
      {Array.from({ length: flames }).map((_, i) => (
        <Icon
          key={i}
          name="fire"
          className={cn(
            'absolute',
            'text-orange-500',
            'animate-pulse',
            i === 0 && 'text-red-600',
            i === 1 && 'text-orange-600 left-1',
            i === 2 && 'text-yellow-600 -left-1',
            i === 3 && 'text-orange-500 left-2 top-1',
            i === 4 && 'text-red-500 -left-2 top-1'
          )}
        />
      ))}
      <Icon name="fire" className="relative text-orange-600" />
    </div>
  );
}

// Milestone badges for special achievements
export function StreakMilestone({ count }: { count: number }) {
  const milestones = [
    { threshold: 365, label: 'Jahr', icon: 'trophy' as IconName, color: 'text-purple-600 bg-purple-100' },
    { threshold: 100, label: '100 Tage', icon: 'star' as IconName, color: 'text-yellow-600 bg-yellow-100' },
    { threshold: 50, label: '50 Tage', icon: 'trophy' as IconName, color: 'text-orange-600 bg-orange-100' },
    { threshold: 30, label: 'Monat', icon: 'trophy' as IconName, color: 'text-blue-600 bg-blue-100' },
    { threshold: 14, label: '2 Wochen', icon: 'star' as IconName, color: 'text-green-600 bg-green-100' },
    { threshold: 7, label: 'Woche', icon: 'star' as IconName, color: 'text-lime-600 bg-lime-100' },
  ];

  const milestone = milestones.find(m => count >= m.threshold);
  if (!milestone) return null;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
      milestone.color
    )}>
      <Icon name={milestone.icon} className="w-4 h-4" />
      <span>{milestone.label} Streak!</span>
    </div>
  );
}

// Animated streak counter for gamification
export function StreakCounter({
  current,
  target,
  className,
}: {
  current: number;
  target: number;
  className?: string;
}) {
  const progress = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StreakBadge count={current} size="sm" showLabel={false} />
          <span className="text-sm font-medium">
            {current} / {target} Tage
          </span>
        </div>
        {isComplete && (
          <Badge variant="default" className="bg-green-600">
            <Icon name="check" className="w-3 h-3 mr-1" />
            Erreicht!
          </Badge>
        )}
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'absolute h-full transition-all duration-500',
            isComplete ? 'bg-green-600' : 'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}