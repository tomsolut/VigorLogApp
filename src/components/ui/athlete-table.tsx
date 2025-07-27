'use client';

import React from 'react';
import { DataTable, TableColumn, HealthStatusIndicator, AlertTableBadge } from './data-table';
import { HealthRingSmall } from './health-ring-progress';
import { StreakBadge } from './streak-badge';
import { Badge } from './badge';
import { Icon } from './icon';

export interface AthleteTableData {
  id: string;
  name: string;
  lastCheckin: string;
  healthScore: number;
  healthStatus: 'excellent' | 'good' | 'concern' | 'critical';
  streak: number;
  alertCount: number;
  alertSeverity?: 'low' | 'medium' | 'high' | 'critical';
  hasAlert?: boolean;
}

export interface AthleteTableProps {
  data: AthleteTableData[];
  title?: string;
  subtitle?: string;
  onAthleteClick?: (athlete: AthleteTableData) => void;
  loading?: boolean;
  showTeamSummary?: boolean;
  teamStats?: {
    totalAthletes: number;
    averageScore: number;
    goodHealth: number;
    needsAttention: number;
  };
}

export function AthleteTable({
  data,
  title = "Team Übersicht",
  subtitle,
  onAthleteClick,
  loading = false,
  showTeamSummary = true,
  teamStats
}: AthleteTableProps) {
  
  // Calculate team statistics if not provided
  const calculatedStats = teamStats || {
    totalAthletes: data.length,
    averageScore: Math.round(data.reduce((sum, athlete) => sum + athlete.healthScore, 0) / data.length) || 0,
    goodHealth: data.filter(athlete => ['excellent', 'good'].includes(athlete.healthStatus)).length,
    needsAttention: data.filter(athlete => ['concern', 'critical'].includes(athlete.healthStatus)).length,
  };

  const columns: TableColumn<AthleteTableData>[] = [
    {
      key: 'status',
      title: '',
      width: 40,
      align: 'center',
      mobileHidden: true,
      render: (_, record) => (
        <HealthStatusIndicator status={record.healthStatus} />
      ),
    },
    {
      key: 'athlete',
      title: 'Athlet',
      dataIndex: 'name',
      sortable: true,
      render: (name, record) => (
        <div>
          <div className="font-medium text-foreground">{name}</div>
          <div className="text-sm text-muted-foreground">{record.lastCheckin}</div>
        </div>
      ),
    },
    {
      key: 'alerts',
      title: 'Warnungen',
      width: 100,
      align: 'center',
      sortable: true,
      dataIndex: 'alertCount',
      render: (alertCount, record) => (
        <AlertTableBadge 
          count={alertCount}
          severity={record.alertSeverity || 'medium'}
        />
      ),
    },
    {
      key: 'streak',
      title: 'Streak',
      width: 80,
      align: 'center',
      sortable: true,
      dataIndex: 'streak',
      mobileHidden: true,
      render: (streak) => (
        <StreakBadge count={streak} size="sm" showLabel={false} />
      ),
    },
    {
      key: 'healthScore',
      title: 'Ø Score',
      width: 120,
      align: 'center',
      sortable: true,
      dataIndex: 'healthScore',
      render: (score) => (
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg font-bold text-foreground">{score}</span>
          <HealthRingSmall value={score} size={40} />
        </div>
      ),
    },
    {
      key: 'actions',
      title: '',
      width: 60,
      align: 'center',
      mobileHidden: true,
      render: () => (
        <Icon name="chevron-right" className="w-5 h-5 text-muted-foreground" />
      ),
    },
  ];

  // Enhanced subtitle with team stats - using Fragment to avoid HTML nesting issues
  const enhancedSubtitle = showTeamSummary ? (
    <>
      {subtitle && <span className="block">{subtitle}</span>}
      <span className="flex items-center gap-4 text-sm">
        <span>{calculatedStats.totalAthletes} Athleten</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          <span>{calculatedStats.goodHealth} Gut</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
          <span>{calculatedStats.needsAttention} Achtung</span>
        </span>
      </span>
    </>
  ) : subtitle;

  return (
    <DataTable
      columns={columns}
      data={data}
      title={title}
      subtitle={enhancedSubtitle}
      onRowClick={onAthleteClick}
      loading={loading}
      rowKey="id"
      mobileView="cards"
      emptyText="Keine Athleten gefunden"
      sortable={true}
    />
  );
}

// Compact version for smaller spaces
export function AthleteTableCompact({
  data,
  title,
  onAthleteClick,
  maxRows = 5
}: {
  data: AthleteTableData[];
  title?: string;
  onAthleteClick?: (athlete: AthleteTableData) => void;
  maxRows?: number;
}) {
  const limitedData = data.slice(0, maxRows);

  const columns: TableColumn<AthleteTableData>[] = [
    {
      key: 'athlete',
      title: 'Athlet',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <HealthStatusIndicator status={record.healthStatus} />
          <div>
            <div className="font-medium text-sm">{record.name}</div>
            <div className="text-xs text-muted-foreground">{record.lastCheckin}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'alerts',
      title: '',
      width: 60,
      align: 'center',
      render: (_, record) => (
        record.alertCount > 0 ? (
          <AlertTableBadge 
            count={record.alertCount}
            severity={record.alertSeverity || 'medium'}
          />
        ) : null
      ),
    },
    {
      key: 'score',
      title: '',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <HealthRingSmall 
            value={record.healthScore} 
            size={40} 
            strokeWidth={4}
            showValue={true}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={limitedData}
      title={title}
      onRowClick={onAthleteClick}
      rowKey="id"
      mobileView="table"
      className="compact-table"
    />
  );
}