'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@/components/ui/icon';
import { storage } from '@/lib/storage';
import { Alert, Athlete, Coach, DailyCheckin } from '@/types';
import { formatDate, formatDateTime, getHealthStatusColor, getAlertSeverityColor } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface HealthMetricTrend {
  metric: string;
  current: number;
  average: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export default function AthleteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const athleteId = params.id as string;
  const highlightAlertId = searchParams.get('alert');

  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [healthTrends, setHealthTrends] = useState<HealthMetricTrend[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7' | '14' | '30'>('7');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Small delay to ensure store is hydrated
    const checkAuth = setTimeout(() => {
      const currentUser = useAuthStore.getState().currentUser;
      logger.info('AthleteDetailPage', 'Auth check', { currentUser, athleteId });
      
      if (!currentUser) {
        logger.warn('AthleteDetailPage', 'No user found, redirecting to home');
        router.push('/');
        return;
      }
      
      if (currentUser.role !== 'coach') {
        logger.warn('AthleteDetailPage', 'User is not a coach', { role: currentUser.role });
        router.push('/');
        return;
      }

      setAuthChecked(true);
      loadAthleteData();
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [athleteId, router]);

  const loadAthleteData = () => {
    try {
      setLoading(true);
      
      // Load athlete
      const allUsers = storage.getUsers();
      const foundAthlete = allUsers.find(u => u.id === athleteId && u.role === 'athlete') as Athlete;
      
      if (!foundAthlete) {
        logger.error('AthleteDetail', 'Athlete not found', { athleteId });
        router.push('/coach');
        return;
      }
      
      setAthlete(foundAthlete);
      
      // Load checkins
      const athleteCheckins = storage.getAthleteCheckins(athleteId);
      setCheckins(athleteCheckins);
      
      // Load alerts
      const athleteAlerts = storage.getAlerts().filter(a => a.athleteId === athleteId);
      setAlerts(athleteAlerts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      
      // Calculate health trends
      calculateHealthTrends(athleteCheckins);
      
      logger.info('AthleteDetail', 'Athlete data loaded', {
        athlete: foundAthlete.email,
        checkins: athleteCheckins.length,
        alerts: athleteAlerts.length
      });
    } catch (error) {
      logger.error('AthleteDetail', 'Error loading athlete data', { error });
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthTrends = (checkins: DailyCheckin[]) => {
    const days = parseInt(selectedTimeRange);
    const recentCheckins = checkins.slice(0, days);
    const previousCheckins = checkins.slice(days, days * 2);
    
    if (recentCheckins.length === 0) {
      setHealthTrends([]);
      return;
    }
    
    const metrics = [
      { key: 'sleepQuality', name: 'Schlaf', inverted: false },
      { key: 'fatigueLevel', name: 'Müdigkeit', inverted: true },
      { key: 'muscleSoreness', name: 'Muskelkater', inverted: true },
      { key: 'moodRating', name: 'Stimmung', inverted: false },
      { key: 'painLevel', name: 'Schmerzen', inverted: true },
      { key: 'stressLevel', name: 'Stress', inverted: true }
    ];
    
    const trends: HealthMetricTrend[] = metrics.map(metric => {
      const currentAvg = recentCheckins.reduce((sum, c) => sum + (c as any)[metric.key], 0) / recentCheckins.length;
      const previousAvg = previousCheckins.length > 0
        ? previousCheckins.reduce((sum, c) => sum + (c as any)[metric.key], 0) / previousCheckins.length
        : currentAvg;
      
      const normalizedCurrent = metric.inverted ? 10 - currentAvg : currentAvg;
      const normalizedPrevious = metric.inverted ? 10 - previousAvg : previousAvg;
      const change = normalizedCurrent - normalizedPrevious;
      
      return {
        metric: metric.name,
        current: normalizedCurrent,
        average: normalizedCurrent,
        trend: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
        change: Math.abs(change)
      };
    });
    
    setHealthTrends(trends);
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;
      
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser) {
        logger.error('AthleteDetail', 'No user found when resolving alert');
        return;
      }
      
      const updatedAlert: Alert = {
        ...alert,
        isResolved: true,
        resolvedBy: currentUser.id,
        resolvedAt: new Date().toISOString()
      };
      
      storage.updateAlert(updatedAlert);
      setAlerts(alerts.map(a => a.id === alertId ? updatedAlert : a));
      
      logger.info('AthleteDetail', 'Alert resolved', { alertId, resolvedBy: currentUser.id });
    } catch (error) {
      logger.error('AthleteDetail', 'Error resolving alert', { error: error instanceof Error ? error.message : error });
    }
  };

  const getMetricIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'arrow-up';
      case 'down': return 'arrow-down';
      case 'stable': return 'minus';
    }
  };

  const getMetricColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  const getMetricHeatmapColor = (metric: string, value: number): string => {
    // Definiere optimale Bereiche für jede Metrik
    const optimalRanges: Record<string, { good: [number, number], warning: [number, number], critical: [number, number] }> = {
      'Schlaf': { good: [7, 10], warning: [5, 7], critical: [0, 5] },
      'Müdigkeit': { good: [0, 3], warning: [3, 6], critical: [6, 10] },
      'Muskelkater': { good: [0, 3], warning: [3, 6], critical: [6, 10] },
      'Stimmung': { good: [7, 10], warning: [4, 7], critical: [0, 4] },
      'Schmerzen': { good: [0, 3], warning: [3, 6], critical: [6, 10] },
      'Stress': { good: [0, 3], warning: [3, 6], critical: [6, 10] }
    };

    const range = optimalRanges[metric];
    if (!range) return 'bg-gray-100 border-gray-300';

    // Prüfe in welchem Bereich der Wert liegt
    if (value >= range.good[0] && value <= range.good[1]) {
      return 'bg-green-50 border-green-300';
    } else if ((value >= range.warning[0] && value < range.good[0]) || 
               (value > range.good[1] && value <= range.warning[1])) {
      return 'bg-orange-50 border-orange-300';
    } else {
      return 'bg-red-50 border-red-300';
    }
  };

  const getMetricTextColor = (metric: string, value: number): string => {
    const bgColor = getMetricHeatmapColor(metric, value);
    if (bgColor.includes('green')) return 'text-green-700';
    if (bgColor.includes('orange')) return 'text-orange-700';
    if (bgColor.includes('red')) return 'text-red-700';
    return 'text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="spinner" className="animate-spin text-4xl text-primary mb-4" />
          <p className="text-muted-foreground">Athletendaten werden geladen...</p>
        </div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="exclamation-triangle" className="text-4xl text-orange-600 mb-4" />
          <p className="text-foreground">Athlet nicht gefunden</p>
          <button onClick={() => router.push('/coach')} className="btn-primary mt-4">
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    );
  }

  const latestCheckin = checkins[0];
  const hasCheckinToday = latestCheckin && new Date(latestCheckin.date).toDateString() === new Date().toDateString();

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="text-center">
          <Icon name="loading" className="text-primary mb-4 animate-spin" size="2xl" />
          <p className="text-lg text-foreground">Lade Athletendaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/coach')}
              className="btn-ghost"
            >
              <Icon name="arrow-left" className="mr-2" />
              Zurück
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {athlete.firstName} {athlete.lastName}
              </h1>
              <p className="text-muted-foreground">
                {athlete.sport} • {athlete.birthDate && `${new Date().getFullYear() - new Date(athlete.birthDate).getFullYear()} Jahre`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${getHealthStatusColor(athlete.healthStatus)}`}>
              <span className="font-medium">Status: {athlete.healthStatus}</span>
            </div>
            <button className="btn-secondary">
              <Icon name="envelope" className="mr-2" />
              Kontaktieren
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon name="calendar-check" className="text-2xl text-primary" />
              <span className="text-sm text-muted-foreground">Check-in heute</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {hasCheckinToday ? (
                <span className="text-green-600 flex items-center gap-2">
                  <Icon name="check" className="text-lg" />
                  Erledigt
                </span>
              ) : (
                <span className="text-orange-600">Ausstehend</span>
              )}
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon name="fire" className="text-2xl text-primary" />
              <span className="text-sm text-muted-foreground">Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{athlete.currentStreak} Tage</p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon name="exclamation-triangle" className="text-2xl text-orange-600" />
              <span className="text-sm text-muted-foreground">Offene Warnungen</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {alerts.filter(a => !a.isResolved).length}
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon name="trophy" className="text-2xl text-primary" />
              <span className="text-sm text-muted-foreground">Punkte</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{athlete.totalPoints}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Trends */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Gesundheitstrends
                </h2>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as '7' | '14' | '30')}
                  className="input max-w-[150px]"
                >
                  <option value="7">7 Tage</option>
                  <option value="14">14 Tage</option>
                  <option value="30">30 Tage</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {healthTrends.map(trend => (
                  <div 
                    key={trend.metric} 
                    className={`p-4 rounded-lg border-2 transition-all ${getMetricHeatmapColor(trend.metric, trend.current)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${getMetricTextColor(trend.metric, trend.current)}`}>
                        {trend.metric}
                      </span>
                      <Icon 
                        name={getMetricIcon(trend.trend)} 
                        className={`text-sm ${getMetricTextColor(trend.metric, trend.current)}`} 
                      />
                    </div>
                    <p className={`text-2xl font-bold ${getMetricTextColor(trend.metric, trend.current)}`}>
                      {trend.current.toFixed(1)}
                    </p>
                    <p className={`text-xs mt-1 ${getMetricTextColor(trend.metric, trend.current)}`}>
                      {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>
              
              {healthTrends.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Noch keine Daten für Trends vorhanden
                </p>
              )}
            </div>
            
            {/* Recent Check-ins */}
            <div className="bg-card rounded-xl border border-border p-6 mt-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Letzte Check-ins
              </h2>
              
              <div className="space-y-3">
                {checkins.slice(0, 5).map(checkin => (
                  <div key={checkin.id} className="p-4 rounded-lg bg-background/50 border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">
                          {formatDate(checkin.date)}
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Schlaf:</span>
                            <span className="ml-2 font-medium">{checkin.sleepQuality}/10</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stimmung:</span>
                            <span className="ml-2 font-medium">{checkin.moodRating}/10</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Schmerzen:</span>
                            <span className="ml-2 font-medium">{checkin.painLevel}/10</span>
                          </div>
                        </div>
                        {checkin.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            "{checkin.notes}"
                          </p>
                        )}
                      </div>
                      <Icon name="chevron-right" className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
                
                {checkins.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Noch keine Check-ins vorhanden
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Alerts & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Warnungen & Hinweise
              </h2>
              
              <div className="space-y-3">
                {alerts.filter(a => !a.isResolved).slice(0, 5).map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      highlightAlertId === alert.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 mb-1 ${getAlertSeverityColor(alert.severity).split(' ')[0]}`}>
                          <Icon name="exclamation-triangle" className="text-sm" />
                          <span className="text-sm font-medium">
                            {alert.severity === 'critical' ? 'Kritisch' :
                             alert.severity === 'high' ? 'Hoch' :
                             alert.severity === 'medium' ? 'Mittel' : 'Niedrig'}
                          </span>
                        </div>
                        <p className="font-medium text-foreground text-sm">
                          {alert.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDateTime(alert.createdAt)}
                        </p>
                      </div>
                    </div>
                    {alert.actionRequired && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="mt-3 w-full btn-primary text-sm"
                      >
                        Als erledigt markieren
                      </button>
                    )}
                  </div>
                ))}
                
                {alerts.filter(a => !a.isResolved).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Keine offenen Warnungen
                  </p>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-card rounded-xl border border-border p-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Schnellaktionen
              </h3>
              <div className="space-y-2">
                <button className="w-full btn-secondary justify-start">
                  <Icon name="calendar-plus" className="mr-2" />
                  Training planen
                </button>
                <button className="w-full btn-secondary justify-start">
                  <Icon name="comment" className="mr-2" />
                  Nachricht senden
                </button>
                <button className="w-full btn-secondary justify-start">
                  <Icon name="file-medical" className="mr-2" />
                  Bericht exportieren
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}