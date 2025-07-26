'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon, RoleIcon } from '@/components/ui/icon';
import { useAuth } from '@/stores/auth';
import { storage } from '@/lib/storage';
import { logger } from '@/lib/logger';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'athlete' | 'coach' | 'parent' | 'admin'>('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      logger.warn('AdminUsersPage', 'Unauthorized access attempt', { user });
      router.push('/');
      return;
    }

    const allUsers = storage.getUsers();
    setUsers(allUsers);
    logger.info('AdminUsersPage', 'Users loaded', { count: allUsers.length });
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'athlete': return 'bg-primary/20 text-primary border-primary/30';
      case 'coach': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'parent': return 'bg-green-100 text-green-700 border-green-200';
      case 'admin': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return '';
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      storage.updateUsers(updatedUsers);
      setUsers(updatedUsers);
      logger.info('AdminUsersPage', 'User deleted', { userId });
    }
  };

  const handleToggleActive = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    );
    storage.updateUsers(updatedUsers);
    setUsers(updatedUsers);
    logger.info('AdminUsersPage', 'User status toggled', { userId });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin')}
              className="mb-4"
            >
              <Icon name="arrow-left" className="mr-2" />
              Zurück zum Dashboard
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Icon name="users" className="text-blue-600" />
              Benutzerverwaltung
            </h1>
            <p className="text-muted-foreground">
              {users.length} Benutzer im System
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Icon name="user-plus" />
            Benutzer hinzufügen
          </Button>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Alle ({users.length})
              </Button>
              <Button
                variant={filter === 'athlete' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('athlete')}
                className={filter === 'athlete' ? 'bg-primary' : ''}
              >
                <RoleIcon role="athlete" className="mr-2" size="xs" />
                Athleten ({users.filter(u => u.role === 'athlete').length})
              </Button>
              <Button
                variant={filter === 'coach' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('coach')}
              >
                <RoleIcon role="coach" className="mr-2" size="xs" />
                Coaches ({users.filter(u => u.role === 'coach').length})
              </Button>
              <Button
                variant={filter === 'parent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('parent')}
              >
                <RoleIcon role="parent" className="mr-2" size="xs" />
                Eltern ({users.filter(u => u.role === 'parent').length})
              </Button>
              <Button
                variant={filter === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('admin')}
              >
                <RoleIcon role="admin" className="mr-2" size="xs" />
                Admins ({users.filter(u => u.role === 'admin').length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Benutzerübersicht</CardTitle>
            <CardDescription>
              Klicken Sie auf einen Benutzer für Details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Benutzer</th>
                    <th className="text-left p-2">E-Mail</th>
                    <th className="text-left p-2">Rolle</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Erstellt</th>
                    <th className="text-right p-2">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <RoleIcon role={user.role} size="sm" />
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-sm">{user.email}</td>
                      <td className="p-2">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant={user.isActive ? "secondary" : "destructive"}>
                          {user.isActive ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('de-DE')}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(user.id)}
                          >
                            <Icon name={user.isActive ? 'ban' : 'check'} size="sm" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                          >
                            <Icon name="edit" size="sm" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Icon name="trash" size="sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Keine Benutzer gefunden
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Icon name="info" className="text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Demo-Hinweis</h4>
                <p className="text-sm text-gray-600">
                  In der Produktionsversion würden hier erweiterte Funktionen wie Benutzerbearbeitung, 
                  Rollenverwaltung, Passwort-Reset und detaillierte Benutzerprofile verfügbar sein.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}