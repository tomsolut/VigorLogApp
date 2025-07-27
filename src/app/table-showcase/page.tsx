'use client';

import React, { useState } from 'react';
import { AthleteTable, AthleteTableCompact } from '@/components/ui/athlete-table';
import { UserTable, UserSelectTable } from '@/components/ui/user-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Demo data
const athleteData = [
  {
    id: '1',
    name: 'Lisa Müller',
    lastCheckin: 'Heute',
    healthScore: 85,
    healthStatus: 'excellent' as const,
    streak: 12,
    alertCount: 0,
  },
  {
    id: '2',
    name: 'Tim Wagner',
    lastCheckin: 'Heute',
    healthScore: 65,
    healthStatus: 'concern' as const,
    streak: 3,
    alertCount: 1,
    alertSeverity: 'high' as const,
  },
  {
    id: '3',
    name: 'Anna Becker',
    lastCheckin: 'Heute',
    healthScore: 78,
    healthStatus: 'good' as const,
    streak: 25,
    alertCount: 1,
    alertSeverity: 'critical' as const,
  },
  {
    id: '4',
    name: 'Lukas Meyer',
    lastCheckin: 'Heute',
    healthScore: 45,
    healthStatus: 'critical' as const,
    streak: 0,
    alertCount: 2,
    alertSeverity: 'critical' as const,
  },
  {
    id: '5',
    name: 'Max Mustermann',
    lastCheckin: 'Heute',
    healthScore: 72,
    healthStatus: 'good' as const,
    streak: 5,
    alertCount: 0,
  },
  {
    id: '6',
    name: 'Sophie Müller',
    lastCheckin: '2025-07-25',
    healthScore: 88,
    healthStatus: 'excellent' as const,
    streak: 0,
    alertCount: 0,
  },
];

const userData = [
  {
    id: '1',
    firstName: 'Lisa',
    lastName: 'Müller',
    email: 'lisa.mueller@email.com',
    role: 'athlete' as const,
    status: 'active' as const,
    createdAt: '2024-01-15',
    lastLogin: '2025-01-26',
    teamName: 'Basketball Team A',
  },
  {
    id: '2',
    firstName: 'Tim',
    lastName: 'Wagner',
    email: 'tim.wagner@email.com',
    role: 'athlete' as const,
    status: 'active' as const,
    createdAt: '2024-02-20',
    lastLogin: '2025-01-26',
    teamName: 'Fußball Team B',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Schmidt',
    email: 'michael.schmidt@email.com',
    role: 'coach' as const,
    status: 'active' as const,
    createdAt: '2024-01-10',
    lastLogin: '2025-01-25',
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    role: 'parent' as const,
    status: 'pending' as const,
    createdAt: '2025-01-20',
    lastLogin: undefined,
  },
  {
    id: '5',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@vigorlog.com',
    role: 'admin' as const,
    status: 'active' as const,
    createdAt: '2024-01-01',
    lastLogin: '2025-01-26',
  },
];

export default function TableShowcase() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleAthleteClick = (athlete: any) => {
    console.log('Athlete clicked:', athlete);
  };

  const handleUserClick = (user: any) => {
    console.log('User clicked:', user);
  };

  const handleUserEdit = (user: any) => {
    console.log('Edit user:', user);
  };

  const handleUserDelete = (user: any) => {
    console.log('Delete user:', user);
  };

  const handleUserSelect = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            📊 Table Components Showcase
          </h1>
          <p className="text-muted-foreground">
            Demonstration aller benutzerdefinierten Tabellen-Komponenten für VigorLog
          </p>
        </div>

        {/* Athlete Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🏃‍♂️ Athlete Table</h2>
          <p className="text-muted-foreground">
            Spezialisierte Tabelle für die Anzeige von Athleten-Gesundheitsdaten mit Health Rings, Streaks und Alert-Status.
          </p>
          
          <AthleteTable
            data={athleteData}
            title="Alle Teams"
            subtitle="6 Athleten"
            onAthleteClick={handleAthleteClick}
            showTeamSummary={true}
          />
        </section>

        {/* Compact Athlete Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🏃‍♂️ Compact Athlete Table</h2>
          <p className="text-muted-foreground">
            Kompakte Version für Seitenleisten oder kleinere Bereiche.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <AthleteTableCompact
              data={athleteData}
              title="Top Athleten"
              onAthleteClick={handleAthleteClick}
              maxRows={3}
            />
            <AthleteTableCompact
              data={athleteData.filter(a => a.alertCount > 0)}
              title="Athleten mit Warnungen"
              onAthleteClick={handleAthleteClick}
              maxRows={3}
            />
          </div>
        </section>

        {/* User Management Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">👥 User Management Table</h2>
          <p className="text-muted-foreground">
            Vollständige Benutzerverwaltungstabelle mit Rollen, Status und Aktionen.
          </p>
          
          <UserTable
            data={userData}
            onUserClick={handleUserClick}
            onUserEdit={handleUserEdit}
            onUserDelete={handleUserDelete}
            showActions={true}
          />
        </section>

        {/* User Selection Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">✅ User Selection Table</h2>
          <p className="text-muted-foreground">
            Vereinfachte Tabelle für Benutzerauswahl (z.B. Team-Zuordnung).
          </p>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <UserSelectTable
              data={userData.filter(u => u.role === 'athlete')}
              selectedUsers={selectedUsers}
              onUserSelect={handleUserSelect}
              title="Athleten auswählen"
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Ausgewählte Benutzer</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedUsers.length === 0 ? (
                  <p className="text-muted-foreground">Keine Benutzer ausgewählt</p>
                ) : (
                  <div className="space-y-2">
                    {selectedUsers.map(userId => {
                      const user = userData.find(u => u.id === userId);
                      return user ? (
                        <Badge key={userId} variant="outline">
                          {user.firstName} {user.lastName}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🎯 Table Features</h2>
          <p className="text-muted-foreground">
            Demonstration der verfügbaren Tabellen-Features.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">📱 Mobile Responsive</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatische Umschaltung zwischen Tabellen- und Kartenansicht
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">⬆️ Sortierbar</h3>
                  <p className="text-sm text-muted-foreground">
                    Klicke auf Spaltenheader zum Sortieren (asc → desc → none)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">🎨 Custom Renderer</h3>
                  <p className="text-sm text-muted-foreground">
                    Health Rings, Badges, Icons und mehr in Tabellenzellen
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">🖱️ Row Interactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Klickbare Zeilen mit Hover-Effekten und Aktions-Buttons
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">📊 Data Indicators</h3>
                  <p className="text-sm text-muted-foreground">
                    Health Status, Alert Badges, Streak Counters integriert
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">⚡ Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimiert für große Datensätze mit effizienter Darstellung
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-center pt-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            ← Zurück
          </Button>
        </div>
      </div>
    </div>
  );
}