'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icon, HealthIcon, type IconName } from '@/components/ui/icon';
import { useAuthStore } from '@/stores/auth';
import { storage } from '@/lib/storage';
import { logger } from '@/lib/logger';
import type { CheckIn, HealthMetric, Parent, Athlete, DailyCheckin } from '@/types';

interface Child {
  id: string;
  name: string;
  role: string;
  dateOfBirth?: string;
  lastCheckIn?: DailyCheckin;
  consentStatus?: 'pending' | 'approved' | 'parent-only';
}

export default function ParentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Use getState directly like Coach Dashboard
    const checkAuth = setTimeout(() => {
      const currentUser = useAuthStore.getState().currentUser;
      logger.info('ParentDashboard', 'Auth check', { currentUser });
      
      if (!currentUser) {
        logger.warn('ParentDashboard', 'No user found, redirecting to home');
        router.push('/');
        return;
      }
      
      if (currentUser.role !== 'parent') {
        logger.warn('ParentDashboard', 'User is not a parent', { role: currentUser.role });
        router.push('/');
        return;
      }

      setUser(currentUser as Parent);
      setAuthChecked(true);
      loadChildrenData();
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [router]);

  const loadChildrenData = () => {
    try {
      setLoading(true);
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser || currentUser.role !== 'parent') return;
      
      const parent = currentUser as Parent;
      logger.info('ParentDashboard', 'Loading children data', { parentId: parent.id, childrenIds: parent.childrenIds });
      
      // Get actual children from storage
      const allUsers = storage.getUsers();
      const childrenData: Child[] = parent.childrenIds.map(childId => {
        const child = allUsers.find(u => u.id === childId && u.role === 'athlete') as Athlete;
        if (!child) return null;
        
        // Get today's check-in
        const todayCheckins = storage.getCheckins().filter(c => 
          c.athleteId === child.id && 
          c.date === new Date().toISOString().split('T')[0]
        );
        
        return {
          id: child.id,
          name: `${child.firstName} ${child.lastName}`,
          role: 'athlete',
          dateOfBirth: child.birthDate,
          consentStatus: 'approved' as const,
          lastCheckIn: todayCheckins[0]
        };
      }).filter(Boolean) as Child[];

      // Check for alerts
      const newAlerts: string[] = [];
      childrenData.forEach(child => {
        if (child.lastCheckIn) {
          // Check pain level
          if (child.lastCheckIn.painLevel > 7) {
            newAlerts.push(`${child.name} meldet hohe Schmerzen (${child.lastCheckIn.painLevel}/10)`);
          }
          // Check fatigue
          if (child.lastCheckIn.fatigueLevel > 7) {
            newAlerts.push(`${child.name} ist sehr müde (${child.lastCheckIn.fatigueLevel}/10)`);
          }
          // Check mood
          if (child.lastCheckIn.moodRating < 4) {
            newAlerts.push(`${child.name} hat niedrige Stimmung (${child.lastCheckIn.moodRating}/10)`);
          }
        } else {
          newAlerts.push(`${child.name} hat heute noch keinen Check-in durchgeführt`);
        }
      });

      setChildren(childrenData);
      setAlerts(newAlerts);
      logger.info('ParentDashboard', 'Children data loaded', { 
        childrenCount: childrenData.length,
        alertsCount: newAlerts.length 
      });
    } catch (error) {
      logger.error('ParentDashboard', 'Error loading children data', { error });
    } finally {
      setLoading(false);
    }
  };

  // Etablierte Farblogik aus Athlete Dashboard
  const getMetricValueColor = (metric: string, value: number): string => {
    // Metriken wo niedrige Werte gut sind
    const negativeMetrics = ['painLevel', 'pain', 'fatigueLevel', 'fatigue', 'stressLevel', 'stress', 'muscleSoreness'];
    
    if (negativeMetrics.includes(metric)) {
      // Niedrig = gut (grün), Hoch = schlecht (rot)
      if (value <= 3) return 'text-green-600';
      if (value <= 6) return 'text-orange-600';
      return 'text-red-600';
    } else {
      // Hoch = gut (grün), Niedrig = schlecht (rot) - für Schlaf und Stimmung
      if (value >= 7) return 'text-green-600';
      if (value >= 4) return 'text-orange-600';
      return 'text-red-600';
    }
  };

  const getOverallHealthStatus = (checkIn: DailyCheckin | undefined): { status: string; color: string; icon: IconName } => {
    if (!checkIn) {
      return { status: 'Kein Check-in', color: 'text-muted-foreground', icon: 'circle-question' };
    }

    const metrics = [
      { name: 'sleep', value: checkIn.sleepQuality, isPositive: true },
      { name: 'mood', value: checkIn.moodRating, isPositive: true },
      { name: 'painLevel', value: checkIn.painLevel, isPositive: false },
      { name: 'fatigueLevel', value: checkIn.fatigueLevel, isPositive: false },
      { name: 'stressLevel', value: checkIn.stressLevel, isPositive: false },
      { name: 'muscleSoreness', value: checkIn.muscleSoreness || 0, isPositive: false }
    ];

    let score = 0;
    metrics.forEach(metric => {
      if (metric.isPositive) {
        if (metric.value >= 7) score += 2;
        else if (metric.value >= 4) score += 1;
      } else {
        if (metric.value <= 3) score += 2;
        else if (metric.value <= 6) score += 1;
      }
    });

    if (score >= 10) {
      return { status: 'Sehr gut', color: 'text-green-600', icon: 'circle-check' as IconName };
    } else if (score >= 6) {
      return { status: 'Gut', color: 'text-orange-600', icon: 'circle-exclamation' as IconName };
    } else {
      return { status: 'Aufmerksamkeit nötig', color: 'text-red-600', icon: 'triangle-exclamation' as IconName };
    }
  };

  // Show loading while checking auth
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-4 flex items-center justify-center">
        <div className="text-center">
          <Icon name="spinner" className="text-4xl text-primary animate-spin mb-4" />
          <p className="text-foreground">
            {!authChecked ? 'Authentifizierung wird überprüft...' : 'Lade Kinderdaten...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Eltern-Dashboard
            </h1>
            <p className="text-muted-foreground">
              Willkommen zurück, {user?.firstName}! Überwachen Sie die Gesundheit Ihrer Kinder
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                useAuthStore.getState().logout();
                router.push('/');
              }}
              variant="outline"
            >
              <Icon name="logout" className="mr-2" />
              Abmelden
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive">
                <Icon name="triangle-exclamation" />
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Children Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {children.map((child) => {
            const healthStatus = getOverallHealthStatus(child.lastCheckIn);
            return (
              <Card 
                key={child.id} 
                className={`cursor-pointer transition-all ${
                  selectedChild === child.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedChild(child.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{child.name}</CardTitle>
                    <Icon 
                      name={healthStatus.icon} 
                      className={`text-2xl ${healthStatus.color}`} 
                    />
                  </div>
                  <CardDescription>
                    {child.dateOfBirth && `Alter: ${new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()} Jahre`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gesundheitsstatus:</span>
                      <span className={`font-semibold ${healthStatus.color}`}>
                        {healthStatus.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Letzter Check-in:</span>
                      <span className="text-sm">
                        {child.lastCheckIn ? 'Heute' : 'Ausstehend'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Einwilligung:</span>
                      <span className="text-sm text-green-600">
                        <Icon name="check" className="inline mr-1" />
                        Genehmigt
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Child Details */}
        {selectedChild && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="chart-line" className="text-primary" />
                Detaillierte Gesundheitsdaten - {children.find(c => c.id === selectedChild)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const child = children.find(c => c.id === selectedChild);
                if (!child?.lastCheckIn) {
                  return (
                    <p className="text-muted-foreground text-center py-8">
                      Keine Check-in Daten für heute verfügbar
                    </p>
                  );
                }

                const checkIn = child.lastCheckIn;
                const metrics: { 
                  label: string; 
                  value: number; 
                  metric: string; 
                  healthMetric: 'sleep' | 'mood' | 'pain' | 'heart' | 'fatigue'; 
                  iconColor: string;
                }[] = [
                  { label: 'Schlafqualität', value: checkIn.sleepQuality, metric: 'sleep', healthMetric: 'sleep', iconColor: 'text-blue-600' },
                  { label: 'Stimmung', value: checkIn.moodRating, metric: 'mood', healthMetric: 'mood', iconColor: 'text-green-600' },
                  { label: 'Schmerzniveau', value: checkIn.painLevel, metric: 'painLevel', healthMetric: 'pain', iconColor: 'text-red-600' },
                  { label: 'Müdigkeit', value: checkIn.fatigueLevel, metric: 'fatigueLevel', healthMetric: 'fatigue', iconColor: 'text-orange-600' },
                  { label: 'Stress', value: checkIn.stressLevel, metric: 'stressLevel', healthMetric: 'heart', iconColor: 'text-purple-600' },
                  { label: 'Muskelkater', value: checkIn.muscleSoreness, metric: 'muscleSoreness', healthMetric: 'heart', iconColor: 'text-red-600' }
                ];

                return (
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                    {metrics.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6 text-center">
                          <HealthIcon 
                            metric={item.healthMetric} 
                            className={`${item.iconColor} mx-auto mb-2`} 
                            size="xl" 
                          />
                          <div className={`text-2xl font-bold ${getMetricValueColor(item.metric, item.value)}`}>
                            {item.value}/10
                          </div>
                          <div className="text-sm text-muted-foreground">{item.label}</div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {checkIn.painLocation && checkIn.painLocation.length > 0 && (
                      <div className="p-4 border rounded-lg md:col-span-2 lg:col-span-3">
                        <p className="text-sm text-muted-foreground mb-2">Schmerzorte:</p>
                        <div className="flex flex-wrap gap-2">
                          {checkIn.painLocation.map((location, index) => (
                            <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {checkIn.notes && (
                      <div className="p-4 border rounded-lg md:col-span-2 lg:col-span-3">
                        <p className="text-sm text-muted-foreground mb-1">Notizen:</p>
                        <p className="text-foreground">{checkIn.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="border-primary text-primary hover:bg-primary hover:text-background"
          >
            <Icon name="arrow-left" className="mr-2" />
            Zurück zur Startseite
          </Button>
          <Button
            onClick={() => router.push('/parent/consent')}
            className="bg-primary text-background hover:bg-primary/90"
          >
            <Icon name="file-contract" className="mr-2" />
            Einwilligungen verwalten
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/parent/communication')}
            className="border-primary text-primary hover:bg-primary hover:text-background"
          >
            <Icon name="comments" className="mr-2" />
            Mit Trainer kommunizieren
          </Button>
        </div>
      </div>
    </div>
  );
}