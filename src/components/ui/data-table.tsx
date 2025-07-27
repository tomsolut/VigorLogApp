'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { HealthRingSmall } from '@/components/ui/health-ring-progress';
import { StreakBadge } from '@/components/ui/streak-badge';

// Base table interfaces
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
  mobileHidden?: boolean; // Hide column on mobile
}

export interface DataTableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  onRowClick?: (record: T, index: number) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  className?: string;
  mobileView?: 'cards' | 'table'; // How to display on mobile
  emptyText?: string;
  sortable?: boolean;
  filterable?: boolean;
  rowKey?: keyof T | ((record: T) => string);
}

type SortOrder = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  title,
  subtitle,
  loading = false,
  onRowClick,
  pagination,
  className,
  mobileView = 'cards',
  emptyText = 'Keine Daten verfügbar',
  sortable = true,
  filterable = false,
  rowKey = 'id',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] as string || index.toString();
  };

  // Sort and filter data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filterable && Object.keys(filters).length > 0) {
      result = result.filter(record => {
        return Object.entries(filters).every(([key, filterValue]) => {
          if (!filterValue) return true;
          const cellValue = record[key];
          return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sortColumn && sortOrder) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filters, sortColumn, sortOrder, filterable]);

  // Handle column sort
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !sortable) return;

    const key = column.dataIndex as string || column.key;
    
    if (sortColumn === key) {
      // Cycle through: asc -> desc -> null
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortColumn(null);
        setSortOrder(null);
      }
    } else {
      setSortColumn(key);
      setSortOrder('asc');
    }
  };

  // Render cell content
  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    if (column.render) {
      return column.render(record[column.dataIndex || column.key], record, index);
    }
    
    const value = record[column.dataIndex || column.key];
    return value !== null && value !== undefined ? String(value) : '-';
  };

  // Mobile card view
  const renderMobileCards = () => (
    <div className="space-y-3">
      {processedData.map((record, index) => (
        <Card
          key={getRowKey(record, index)}
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            onRowClick && 'hover:border-primary/30'
          )}
          onClick={() => onRowClick?.(record, index)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {columns
                .filter(col => !col.mobileHidden)
                .map(column => (
                  <div key={column.key} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {column.title}
                    </span>
                    <div className={cn('text-sm', column.className)}>
                      {renderCell(column, record, index)}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Desktop table view
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map(column => (
              <th
                key={column.key}
                className={cn(
                  'text-left py-3 px-4 font-medium text-sm text-muted-foreground',
                  column.sortable && sortable && 'cursor-pointer hover:text-foreground',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.mobileHidden && 'hidden md:table-cell'
                )}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center gap-2">
                  {column.title}
                  {column.sortable && sortable && (
                    <Icon
                      name={
                        sortColumn === (column.dataIndex as string || column.key)
                          ? sortOrder === 'asc'
                            ? 'chevron-up'
                            : 'chevron-down'
                          : 'chevron-up'
                      }
                      className={cn(
                        'w-4 h-4 transition-all',
                        sortColumn === (column.dataIndex as string || column.key)
                          ? 'opacity-100'
                          : 'opacity-30'
                      )}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedData.map((record, index) => (
            <tr
              key={getRowKey(record, index)}
              className={cn(
                'border-b border-border/50 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-muted/50',
                'min-h-[60px]'
              )}
              onClick={() => onRowClick?.(record, index)}
            >
              {columns.map(column => (
                <td
                  key={column.key}
                  className={cn(
                    'py-3 px-4 text-sm',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.mobileHidden && 'hidden md:table-cell',
                    column.className
                  )}
                >
                  {renderCell(column, record, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <Card className={className}>
        {(title || subtitle) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Icon name="loading" className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Lade Daten...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (processedData.length === 0) {
    return (
      <Card className={className}>
        {(title || subtitle) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="info" className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">{emptyText}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {(title || subtitle) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </CardHeader>
      )}
      <CardContent className="p-0">
        {/* Mobile view */}
        <div className="md:hidden p-4">
          {mobileView === 'cards' ? renderMobileCards() : renderTable()}
        </div>
        
        {/* Desktop view */}
        <div className="hidden md:block">
          {renderTable()}
        </div>
      </CardContent>
      
      {pagination && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Zeige {((pagination.current - 1) * pagination.pageSize) + 1} bis{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} von{' '}
            {pagination.total} Einträgen
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current <= 1}
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
            >
              <Icon name="chevron-left" className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              Seite {pagination.current} von {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
            >
              <Icon name="chevron-right" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// Specialized health status indicator
export function HealthStatusIndicator({ status }: { status: 'excellent' | 'good' | 'concern' | 'critical' }) {
  const config = {
    excellent: { color: 'bg-green-500', label: 'Gut' },
    good: { color: 'bg-lime-500', label: 'Gut' },
    concern: { color: 'bg-yellow-500', label: 'Achtung' },
    critical: { color: 'bg-red-500', label: 'Kritisch' },
  };

  const { color, label } = config[status];

  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-3 h-3 rounded-full', color)} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

// Alert badge for table cells
export function AlertTableBadge({ count, severity = 'medium' }: { 
  count: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}) {
  if (count === 0) return null;

  const severityConfig = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500', 
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };

  return (
    <Badge 
      variant="destructive" 
      className={cn(
        'text-white text-xs px-2 py-1 min-w-[24px] h-6 flex items-center justify-center',
        severityConfig[severity]
      )}
    >
      <Icon name="warning" className="w-3 h-3 mr-1" />
      {count}
    </Badge>
  );
}