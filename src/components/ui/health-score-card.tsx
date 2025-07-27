'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { HealthRingMini, HealthRingSmall } from '@/components/ui/health-ring-progress';

interface HealthScoreCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: IconName;
  iconColor?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  showRing?: boolean;
  accentColor?: string;
}

export function HealthScoreCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'text-primary',
  trend,
  trendValue,
  size = 'md',
  className,
  onClick,
  showRing = true,
  accentColor,
}: HealthScoreCardProps) {
  const sizeClasses = {
    sm: {
      card: 'p-3',
      title: 'text-sm',
      value: 'text-xl',
      subtitle: 'text-xs',
    },
    md: {
      card: 'p-4',
      title: 'text-base',
      value: 'text-2xl',
      subtitle: 'text-sm',
    },
    lg: {
      card: 'p-6',
      title: 'text-lg',
      value: 'text-3xl',
      subtitle: 'text-base',
    },
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'chevron-up';
      case 'down':
        return 'chevron-down';
      default:
        return 'chevron-right';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const styles = sizeClasses[size];

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {/* Accent gradient */}
      {accentColor && (
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full -mr-12 -mt-12"
          style={{
            background: `radial-gradient(circle, ${accentColor}, transparent)`,
          }}
        />
      )}

      <CardHeader className={cn('pb-2', styles.card)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <Icon name={icon} className={cn('opacity-80', iconColor)} />
            )}
            <CardTitle className={cn('font-medium', styles.title)}>
              {title}
            </CardTitle>
          </div>
          {showRing && size !== 'sm' && (
            <HealthRingMini value={value} />
          )}
        </div>
      </CardHeader>

      <CardContent className={cn('pt-0', styles.card)}>
        <div className="flex items-end justify-between">
          <div>
            <div className={cn('font-bold', styles.value)}>
              {value}
              {subtitle && (
                <span className={cn('font-normal ml-1', styles.subtitle, 'text-muted-foreground')}>
                  {subtitle}
                </span>
              )}
            </div>
            {trend && (
              <div className={cn('flex items-center gap-1 mt-1', getTrendColor())}>
                <Icon name={getTrendIcon()} className="w-3 h-3" />
                {trendValue && (
                  <span className={styles.subtitle}>{trendValue}</span>
                )}
              </div>
            )}
          </div>
          {showRing && size === 'sm' && (
            <HealthRingMini value={value} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Preset variants
export function MetricCard(props: Omit<HealthScoreCardProps, 'showRing'>) {
  return <HealthScoreCard {...props} showRing={false} />;
}

export function HealthMetricCard(props: HealthScoreCardProps) {
  const getHealthColor = () => {
    if (props.value >= 80) return '#10b981'; // green
    if (props.value >= 60) return '#84cc16'; // lime
    if (props.value >= 40) return '#eab308'; // yellow
    if (props.value >= 20) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <HealthScoreCard
      {...props}
      accentColor={getHealthColor()}
    />
  );
}