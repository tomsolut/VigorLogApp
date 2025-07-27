'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { HealthRingMini } from '@/components/ui/health-ring-progress';

interface TeamMember {
  id: string;
  name: string;
  healthScore: number;
  status: 'excellent' | 'good' | 'concern' | 'critical';
  lastCheckin: string;
  hasAlert?: boolean;
  streak?: number;
}

interface TeamHealthOverviewProps {
  teamName: string;
  members: TeamMember[];
  onMemberClick?: (memberId: string) => void;
  className?: string;
  showDetails?: boolean;
}

export function TeamHealthOverview({
  teamName,
  members,
  onMemberClick,
  className,
  showDetails = true,
}: TeamHealthOverviewProps) {
  const statusColors = {
    excellent: 'bg-green-500',
    good: 'bg-lime-500',
    concern: 'bg-yellow-500',
    critical: 'bg-red-500',
  };

  const statusLabels = {
    excellent: 'Exzellent',
    good: 'Gut',
    concern: 'Achtung',
    critical: 'Kritisch',
  };

  const avgHealth = Math.round(
    members.reduce((sum, m) => sum + m.healthScore, 0) / members.length
  );

  const statusCounts = members.reduce(
    (acc, member) => {
      acc[member.status] = (acc[member.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{teamName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {members.length} Athleten
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold">{avgHealth}</p>
              <p className="text-xs text-muted-foreground">Ø Score</p>
            </div>
            <HealthRingMini value={avgHealth} />
          </div>
        </div>

        {/* Status Overview */}
        <div className="flex gap-2 mt-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  statusColors[status as keyof typeof statusColors]
                )}
              />
              <span className="text-xs text-muted-foreground">
                {count} {statusLabels[status as keyof typeof statusLabels]}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {members.map((member) => (
            <div
              key={member.id}
              className={cn(
                'px-4 py-3 flex items-center justify-between transition-colors',
                onMemberClick && 'hover:bg-muted/50 cursor-pointer'
              )}
              onClick={() => onMemberClick?.(member.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    statusColors[member.status]
                  )}
                />
                <div>
                  <p className="font-medium text-sm">{member.name}</p>
                  {showDetails && (
                    <p className="text-xs text-muted-foreground">
                      {member.lastCheckin}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {member.hasAlert && (
                  <Badge variant="destructive" className="h-5">
                    <Icon name="warning" className="w-3 h-3" />
                  </Badge>
                )}
                {member.streak && member.streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Icon name="fire" className="w-3 h-3" />
                    <span className="text-xs font-medium">{member.streak}</span>
                  </div>
                )}
                <HealthRingMini value={member.healthScore} />
                {onMemberClick && (
                  <Icon name="chevron-right" className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for dashboards
export function TeamHealthCompact({
  teamName,
  members,
  className,
}: Omit<TeamHealthOverviewProps, 'showDetails' | 'onMemberClick'>) {
  const avgHealth = Math.round(
    members.reduce((sum, m) => sum + m.healthScore, 0) / members.length
  );

  const criticalCount = members.filter(m => m.status === 'critical').length;
  const concernCount = members.filter(m => m.status === 'concern').length;

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{teamName}</h4>
          <p className="text-sm text-muted-foreground">
            {members.length} Athleten
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(criticalCount > 0 || concernCount > 0) && (
            <div className="flex gap-2">
              {criticalCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {criticalCount} Kritisch
                </Badge>
              )}
              {concernCount > 0 && (
                <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                  {concernCount} Achtung
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-bold">{avgHealth}</span>
            <HealthRingMini value={avgHealth} />
          </div>
        </div>
      </div>
    </Card>
  );
}