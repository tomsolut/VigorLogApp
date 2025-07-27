'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Icon, RoleIcon } from '@/components/ui/icon';
import { HealthScoreCard } from '@/components/ui/health-score-card';
import { AlertSummary } from '@/components/ui/alert-summary';
import { AdminNav } from '@/components/ui/mobile-nav';
import { useAuth } from '@/stores/auth';
import { storage } from '@/lib/storage';
import { getTodayString } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface SystemStats {
  totalUsers: number;
  usersByRole: {
    athletes: number;
    coaches: number;
    parents: number;
    admins: number;
  };
  todayCheckins: number;
  totalCheckins: number;
  activeAlerts: number;
}

interface AdminAlert {
  id: string;
  athleteName: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    usersByRole: {
      athletes: 0,
      coaches: 0,
      parents: 0,
      admins: 0
    },
    todayCheckins: 0,
    totalCheckins: 0,
    activeAlerts: 0
  });
  const [systemAlerts, setSystemAlerts] = useState<AdminAlert[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      logger.warn('AdminDashboard', 'Unauthorized access attempt', { user });
      router.push('/');
      return;
    }

    // Lade System-Statistiken
    const users = storage.getUsers();
    const allCheckins = storage.getCheckins();
    const todayString = getTodayString();
    const todayCheckins = allCheckins.filter(c => c.date === todayString);

    // Zähle Benutzer nach Rolle
    const usersByRole = users.reduce((acc, user) => {
      if (user.role === 'athlete') acc.athletes++;
      else if (user.role === 'coach') acc.coaches++;
      else if (user.role === 'parent') acc.parents++;
      else if (user.role === 'admin') acc.admins++;
      return acc;
    }, { athletes: 0, coaches: 0, parents: 0, admins: 0 });

    // Zähle aktive Alerts (Check-ins mit hohen Schmerz- oder Stresswerten)
    const activeAlerts = todayCheckins.filter(c => 
      c.painLevel > 7 || c.stressLevel > 7 || c.fatigueLevel > 8
    ).length;

    // Lade Alerts für AdminAlert Component
    const alerts = storage.getAlerts()?.filter(alert => !alert.isResolved) || [];
    const adminAlerts: AdminAlert[] = alerts.map(alert => {
      const athlete = users.find(u => u.id === alert.athleteId);
      return {
        id: alert.id,
        athleteName: athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Unbekannter Athlet',
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        createdAt: new Date(alert.createdAt).toLocaleDateString('de-DE')
      };
    });

    setStats({
      totalUsers: users.length,
      usersByRole,
      todayCheckins: todayCheckins.length,
      totalCheckins: allCheckins.length,
      activeAlerts
    });

    setSystemAlerts(adminAlerts);

    logger.info('AdminDashboard', 'Stats loaded', { stats, alertsCount: adminAlerts.length });
  }, [user, router]);

  const handleAlertClick = (alert: AdminAlert) => {
    // Navigate to athlete or alerts management page
    router.push(`/admin/alerts?alertId=${alert.id}`);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Icon name="cog" className="text-orange-500" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Systemverwaltung und Übersicht
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="flex items-center gap-2"
            >
              <Icon name="logout" className="text-gray-600" />
              Abmelden
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthScoreCard
            title="Gesamtnutzer"
            value={stats.totalUsers}
            subtitle="Registrierte Benutzer"
            icon="users"
            iconColor="text-blue-600"
            showRing={false}
            accentColor="blue"
          />
          
          <HealthScoreCard
            title="Check-ins heute"
            value={stats.todayCheckins}
            subtitle={`von ${stats.usersByRole.athletes} Athleten`}
            icon="check-circle"
            iconColor="text-green-600"
            showRing={false}
            accentColor="green"
          />
          
          <HealthScoreCard
            title="Gesamt Check-ins"
            value={stats.totalCheckins}
            subtitle="Alle Zeit"
            icon="chart"
            iconColor="text-purple-600"
            showRing={false}
            accentColor="purple"
          />
          
          <HealthScoreCard
            title="Aktive Warnungen"
            value={stats.activeAlerts}
            subtitle="Kritische Werte"
            icon="warning"
            iconColor={stats.activeAlerts > 0 ? "text-red-600" : "text-gray-600"}
            showRing={false}
            accentColor={stats.activeAlerts > 0 ? "red" : "gray"}
          />
        </div>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="users" className="text-gray-600" />
              Benutzerverteilung
            </CardTitle>
            <CardDescription>
              Anzahl der Benutzer nach Rolle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <RoleIcon role="athlete" className="text-primary mx-auto mb-2" size="xl" />
                <div className="text-2xl font-bold text-primary">{stats.usersByRole.athletes}</div>
                <p className="text-sm text-muted-foreground">Athleten</p>
              </div>
              <div className="text-center">
                <RoleIcon role="coach" className="text-blue-600 mx-auto mb-2" size="xl" />
                <div className="text-2xl font-bold text-blue-600">{stats.usersByRole.coaches}</div>
                <p className="text-sm text-muted-foreground">Coaches</p>
              </div>
              <div className="text-center">
                <RoleIcon role="parent" className="text-green-600 mx-auto mb-2" size="xl" />
                <div className="text-2xl font-bold text-green-600">{stats.usersByRole.parents}</div>
                <p className="text-sm text-muted-foreground">Eltern</p>
              </div>
              <div className="text-center">
                <RoleIcon role="admin" className="text-orange-500 mx-auto mb-2" size="xl" />
                <div className="text-2xl font-bold text-orange-500">{stats.usersByRole.admins}</div>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Schnellzugriff</h2>
            <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Icon name="users" className="text-blue-600 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Benutzer verwalten</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Benutzer hinzufügen, bearbeiten
              </p>
              <Button className="w-full" variant="outline" onClick={() => router.push('/admin/users')}>
                <Icon name="arrow-right" className="mr-2" />
                Zur Verwaltung
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Icon name="shirt-jersey" className="text-green-600 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Teams verwalten</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Teams und Zuordnungen
              </p>
              <Button className="w-full" variant="outline" onClick={() => router.push('/admin/teams')}>
                <Icon name="arrow-right" className="mr-2" />
                Teams anzeigen
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Icon name="chart" className="text-purple-600 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Detaillierte Statistiken
              </p>
              <Button className="w-full" variant="outline" onClick={() => router.push('/admin/analytics')}>
                <Icon name="arrow-right" className="mr-2" />
                Zu Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Icon name="cog" className="text-orange-500 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Einstellungen</h3>
              <p className="text-sm text-muted-foreground mb-3">
                System-Konfiguration
              </p>
              <Button className="w-full" variant="outline" onClick={() => router.push('/admin/settings')}>
                <Icon name="arrow-right" className="mr-2" />
                Einstellungen
              </Button>
            </CardContent>
          </Card>
            </div>
          </div>

          {/* System Alerts */}
          <div className="lg:col-span-1">
            <AlertSummary
              alerts={systemAlerts}
              onAlertClick={handleAlertClick}
              onViewAll={() => router.push('/admin/alerts')}
              maxItems={4}
              showResolveButton={false}
            />
          </div>
        </div>

        {/* Recent Activity */}
        {stats.activeAlerts > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <Icon name="warning" className="text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{stats.activeAlerts} kritische Check-ins heute!</strong> 
              <span className="block mt-1">Athleten mit hohen Schmerz-, Stress- oder Müdigkeitswerten benötigen möglicherweise Aufmerksamkeit.</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Notice */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Icon name="info" className="text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Demo-Modus</h4>
                <p className="text-sm text-gray-600">
                  Dies ist eine Demo-Version des Admin-Dashboards. In der Produktionsversion würden hier erweiterte 
                  Verwaltungsfunktionen, Echtzeit-Statistiken und detaillierte Benutzeranalysen verfügbar sein.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Mobile Navigation */}
      <AdminNav alerts={systemAlerts.length} />
    </div>
  );
}