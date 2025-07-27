'use client';

import React, { useState } from 'react';
import { DataTable, TableColumn } from './data-table';
import { Badge } from './badge';
import { Button } from './button';
import { Icon, RoleIcon } from './icon';
import { formatDate } from '@/lib/utils';

export interface UserTableData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'athlete' | 'coach' | 'parent' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  teamName?: string;
  avatarUrl?: string;
}

export interface UserTableProps {
  data: UserTableData[];
  title?: string;
  subtitle?: string;
  onUserClick?: (user: UserTableData) => void;
  onUserEdit?: (user: UserTableData) => void;
  onUserDelete?: (user: UserTableData) => void;
  loading?: boolean;
  showActions?: boolean;
  roleFilter?: string[];
}

export function UserTable({
  data,
  title = "Benutzerverwaltung",
  subtitle = "Alle registrierten Benutzer verwalten",
  onUserClick,
  onUserEdit,
  onUserDelete,
  loading = false,
  showActions = true,
  roleFilter
}: UserTableProps) {
  
  const [filteredData, setFilteredData] = useState(data);

  // Filter data by role if roleFilter is provided
  React.useEffect(() => {
    if (roleFilter && roleFilter.length > 0) {
      setFilteredData(data.filter(user => roleFilter.includes(user.role)));
    } else {
      setFilteredData(data);
    }
  }, [data, roleFilter]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'coach': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'athlete': return 'bg-green-100 text-green-800 border-green-200';
      case 'parent': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'coach': return 'Coach';
      case 'athlete': return 'Athlet';
      case 'parent': return 'Eltern';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'inactive': return 'Inaktiv';
      case 'pending': return 'Ausstehend';
      default: return status;
    }
  };

  const columns: TableColumn<UserTableData>[] = [
    {
      key: 'user',
      title: 'Benutzer',
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {record.avatarUrl ? (
              <img 
                src={record.avatarUrl} 
                alt={`${record.firstName} ${record.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <RoleIcon role={record.role} size="sm" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-foreground">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{record.email}</div>
            {record.teamName && (
              <div className="text-xs text-muted-foreground">{record.teamName}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Rolle',
      dataIndex: 'role',
      width: 120,
      align: 'center',
      sortable: true,
      render: (role) => (
        <Badge 
          variant="outline" 
          className={getRoleColor(role)}
        >
          {getRoleLabel(role)}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      align: 'center',
      sortable: true,
      render: (status) => (
        <Badge 
          variant="outline"
          className={getStatusColor(status)}
        >
          {getStatusLabel(status)}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      title: 'Letzter Login',
      dataIndex: 'lastLogin',
      width: 140,
      sortable: true,
      mobileHidden: true,
      render: (lastLogin) => (
        <div className="text-sm text-muted-foreground">
          {lastLogin ? formatDate(lastLogin) : 'Nie'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Registriert',
      dataIndex: 'createdAt',
      width: 120,
      sortable: true,
      mobileHidden: true,
      render: (createdAt) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(createdAt)}
        </div>
      ),
    },
  ];

  // Add actions column if enabled
  if (showActions) {
    columns.push({
      key: 'actions',
      title: 'Aktionen',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center gap-1">
          {onUserEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onUserEdit(record);
              }}
            >
              <Icon name="edit" className="w-4 h-4" />
            </Button>
          )}
          {onUserDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onUserDelete(record);
              }}
            >
              <Icon name="trash" className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    });
  }

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      title={title}
      subtitle={subtitle}
      onRowClick={onUserClick}
      loading={loading}
      rowKey="id"
      mobileView="cards"
      emptyText="Keine Benutzer gefunden"
      sortable={true}
    />
  );
}

// Simplified user list for selection purposes
export function UserSelectTable({
  data,
  selectedUsers = [],
  onUserSelect,
  title = "Benutzer auswählen",
  roleFilter
}: {
  data: UserTableData[];
  selectedUsers?: string[];
  onUserSelect?: (userId: string, selected: boolean) => void;
  title?: string;
  roleFilter?: string[];
}) {
  
  const filteredData = roleFilter 
    ? data.filter(user => roleFilter.includes(user.role))
    : data;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'coach': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'athlete': return 'bg-green-100 text-green-800 border-green-200';
      case 'parent': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'coach': return 'Coach';
      case 'athlete': return 'Athlet';
      case 'parent': return 'Eltern';
      default: return role;
    }
  };

  const columns: TableColumn<UserTableData>[] = [
    {
      key: 'select',
      title: '',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(record.id)}
          onChange={(e) => onUserSelect?.(record.id, e.target.checked)}
          className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
        />
      ),
    },
    {
      key: 'user',
      title: 'Benutzer',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <RoleIcon role={record.role} size="sm" />
          <div>
            <div className="font-medium text-sm">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Rolle',
      width: 100,
      render: (_, record) => (
        <Badge variant="outline" className={getRoleColor(record.role)}>
          {getRoleLabel(record.role)}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      title={title}
      rowKey="id"
      mobileView="table"
      emptyText="Keine Benutzer verfügbar"
    />
  );
}