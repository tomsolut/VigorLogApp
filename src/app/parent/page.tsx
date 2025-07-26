'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icon } from '@/components/ui/icon';
import { useAuthStore } from '@/stores/auth';
import { storage } from '@/lib/storage';
import type { CheckIn, HealthMetric } from '@/types';

interface Child {
  id: string;
  name: string;
  role: string;
  dateOfBirth?: string;
  lastCheckIn?: CheckIn;
  consentStatus?: 'pending' | 'approved' | 'parent-only';
}

export default function ParentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'parent') {
      router.push('/');
    } else {
      loadChildrenData();
    }
  }, [isAuthenticated, user, router]);

  const loadChildrenData = () => {
    // Mock data - in production this would come from an API
    const mockChildren: Child[] = [
      {
        id: 'athlete-1',
        name: 'Max Mustermann',
        role: 'athlete',
        dateOfBirth: '2008-03-15',
        consentStatus: 'approved',
        lastCheckIn: storage.get(`checkin_athlete-1_${new Date().toISOString().split('T')[0]}`)
      },
      {
        id: 'athlete-2',
        name: 'Sophie Müller',
        role: 'athlete',
        dateOfBirth: '2009-07-22',
        consentStatus: 'approved',
        lastCheckIn: storage.get(`checkin_athlete-2_${new Date().toISOString().split('T')[0]}`)
      }
    ];

    // Check for alerts
    const newAlerts: string[] = [];
    mockChildren.forEach(child => {
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
        if (child.lastCheckIn.mood < 4) {
          newAlerts.push(`${child.name} hat niedrige Stimmung (${child.lastCheckIn.mood}/10)`);
        }
      } else {
        newAlerts.push(`${child.name} hat heute noch keinen Check-in durchgeführt`);
      }
    });

    setChildren(mockChildren);
    setAlerts(newAlerts);
    setLoading(false);
  };

  const getMetricColor = (metric: string, value: number): string => {
    const negativeMetrics = ['painLevel', 'pain', 'fatigueLevel', 'fatigue', 'stressLevel', 'stress', 'muscleSoreness'];
    
    if (negativeMetrics.includes(metric)) {
      if (value <= 3) return 'text-green-600';
      if (value <= 6) return 'text-orange-600';
      return 'text-red-600';
    } else {
      if (value >= 7) return 'text-green-600';
      if (value >= 4) return 'text-orange-600';
      return 'text-red-600';
    }
  };

  const getOverallHealthStatus = (checkIn: CheckIn | undefined): { status: string; color: string; icon: string } => {
    if (!checkIn) {
      return { status: 'Kein Check-in', color: 'text-muted-foreground', icon: 'circle-question' };
    }

    const metrics = [
      { name: 'sleep', value: checkIn.sleepHours, isPositive: true },
      { name: 'mood', value: checkIn.mood, isPositive: true },
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
      return { status: 'Sehr gut', color: 'text-green-600', icon: 'circle-check' };
    } else if (score >= 6) {
      return { status: 'Gut', color: 'text-orange-600', icon: 'circle-exclamation' };
    } else {
      return { status: 'Aufmerksamkeit nötig', color: 'text-red-600', icon: 'triangle-exclamation' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <Icon name="spinner" className="text-4xl text-primary animate-spin mb-4" />
          <p className="text-foreground">Lade Kinderdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Eltern-Dashboard
          </h1>
          <p className="text-muted-foreground">
            Überwachen Sie die Gesundheit Ihrer Kinder
          </p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} className="border-red-600 bg-red-50">
                <Icon name="triangle-exclamation" className="text-red-600" />
                <AlertDescription className="text-red-800">{alert}</AlertDescription>
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
                const metrics: { label: string; value: number; metric: string; unit?: string }[] = [
                  { label: 'Schlaf', value: checkIn.sleepHours, metric: 'sleep', unit: 'Stunden' },
                  { label: 'Stimmung', value: checkIn.mood, metric: 'mood' },
                  { label: 'Schmerzniveau', value: checkIn.painLevel, metric: 'painLevel' },
                  { label: 'Müdigkeit', value: checkIn.fatigueLevel, metric: 'fatigueLevel' },
                  { label: 'Stress', value: checkIn.stressLevel, metric: 'stressLevel' },
                  { label: 'Muskelkater', value: checkIn.muscleSoreness || 0, metric: 'muscleSoreness' }
                ];

                return (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {metrics.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        <p className={`text-2xl font-bold ${getMetricColor(item.metric, item.value)}`}>
                          {item.value}{item.unit ? ` ${item.unit}` : '/10'}
                        </p>
                      </div>
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