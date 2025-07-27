'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon, type IconName } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  athleteName: string;
  title: string;
  message?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string;
  isResolved?: boolean;
}

interface AlertSummaryProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  onViewAll?: () => void;
  maxItems?: number;
  className?: string;
  showResolveButton?: boolean;
  onResolve?: (alertId: string) => void;
}

export function AlertSummary({
  alerts,
  onAlertClick,
  onViewAll,
  maxItems = 5,
  className,
  showResolveButton = false,
  onResolve,
}: AlertSummaryProps) {
  const severityConfig = {
    critical: {
      icon: 'warning' as IconName,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      badge: 'destructive' as const,
    },
    high: {
      icon: 'warning' as IconName,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      borderColor: 'border-orange-200 dark:border-orange-800',
      badge: 'destructive' as const,
    },
    medium: {
      icon: 'info' as IconName,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      badge: 'outline' as const,
    },
    low: {
      icon: 'info' as IconName,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      badge: 'secondary' as const,
    },
  };

  const activeAlerts = alerts.filter(a => !a.isResolved);
  const displayAlerts = activeAlerts.slice(0, maxItems);

  const alertCounts = activeAlerts.reduce(
    (acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      acc.total++;
      return acc;
    },
    { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
  );

  if (activeAlerts.length === 0) {
    return (
      <Card className={cn('text-center', className)}>
        <CardContent className="py-8">
          <Icon name="check-circle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-muted-foreground">Keine aktiven Warnungen</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="warning" className="text-orange-500" />
            Aktuelle Warnungen
          </CardTitle>
          <div className="flex items-center gap-2">
            {alertCounts.critical > 0 && (
              <Badge variant="destructive" className="text-xs">
                {alertCounts.critical} Kritisch
              </Badge>
            )}
            {alertCounts.high > 0 && (
              <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                {alertCounts.high} Hoch
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {displayAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={cn(
                'p-3 rounded-lg border transition-all',
                config.bgColor,
                config.borderColor,
                onAlertClick && 'cursor-pointer hover:shadow-sm'
              )}
              onClick={() => onAlertClick?.(alert)}
            >
              <div className="flex items-start gap-3">
                <Icon
                  name={config.icon}
                  className={cn('mt-0.5 flex-shrink-0', config.color)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.athleteName}</p>
                      <p className={cn('text-sm mt-0.5', config.color)}>
                        {alert.title}
                      </p>
                      {alert.message && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {alert.message}
                        </p>
                      )}
                    </div>
                    {showResolveButton && onResolve && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onResolve(alert.id);
                        }}
                      >
                        <Icon name="check" className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.createdAt}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {activeAlerts.length > maxItems && onViewAll && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={onViewAll}
          >
            Alle {activeAlerts.length} Warnungen anzeigen
            <Icon name="arrow-right" className="ml-2 w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for small spaces
export function AlertBadge({ alerts }: { alerts: Alert[] }) {
  const activeAlerts = alerts.filter(a => !a.isResolved);
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;
  
  if (activeAlerts.length === 0) return null;

  return (
    <div className="relative">
      <Icon
        name="warning"
        className={cn(
          'w-5 h-5',
          criticalCount > 0 ? 'text-red-600' : 'text-orange-600'
        )}
      />
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
        {activeAlerts.length}
      </span>
    </div>
  );
}