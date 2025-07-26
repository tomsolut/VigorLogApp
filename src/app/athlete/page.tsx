'use client';

// VigorLog - Athlete Dashboard

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Icon, HealthIcon } from '@/components/ui/icon';
import { DailyCheckinForm } from '@/components/forms/daily-checkin-form';
import { QuickCheckinForm } from '@/components/forms/quick-checkin-form';
import { useAuth } from '@/stores/auth';
import { storage } from '@/lib/storage';
import { getTodayString, formatDate, calculateStreak } from '@/lib/utils';
import { logger } from '@/lib/logger';
import type { DailyCheckin } from '@/types';

// Hilfsfunktion für die richtige Farbgebung basierend auf Metrik und Wert
function getMetricValueColor(metric: string, value: number): string {
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
}

export default function AthleteDashboard() {
  const { user, logout } = useAuth();
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState<DailyCheckin[]>([]);
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const [checkinMode, setCheckinMode] = useState<'quick' | 'detailed'>('quick'); // Gen Z default: quick
  const [weeklyAverage, setWeeklyAverage] = useState({
    sleep: 0,
    mood: 0,
    pain: 0,
    stress: 0
  });

  useEffect(() => {
    logger.info('AthleteDashboard', 'Component mounted/updated', { user });
    
    if (!user || user.role !== 'athlete') {
      logger.warn('AthleteDashboard', 'Invalid user or role', { user });
      return;
    }

    try {
      logger.debug('AthleteDashboard', 'Loading athlete data', { userId: user.id });
      
      // Für Sophie (demo-athlete-2): Entferne heutige Check-ins beim Dashboard-Aufruf
      if (user.id === 'demo-athlete-2') {
        const todayString = getTodayString();
        const allCheckins = storage.getCheckins();
        const filteredCheckins = allCheckins.filter(c => 
          !(c.athleteId === 'demo-athlete-2' && c.date === todayString)
        );
        storage.updateCheckins(filteredCheckins);
        logger.info('AthleteDashboard', 'Removed today\'s check-in for Sophie demo', { date: todayString });
      }
      
      // Lade Daten
      const checkins = storage.getCheckinsByAthleteId(user.id);
      logger.debug('AthleteDashboard', 'Checkins loaded', { count: checkins.length });
      
      // Dedupliziere Check-ins basierend auf ID
      const uniqueCheckins = checkins.filter((checkin, index, self) =>
        index === self.findIndex((c) => c.id === checkin.id)
      );
      
      if (uniqueCheckins.length !== checkins.length) {
        logger.warn('AthleteDashboard', 'Duplicate checkins detected and removed', {
          original: checkins.length,
          unique: uniqueCheckins.length
        });
      }
      
      const today = uniqueCheckins.find(c => c.date === getTodayString());
      let recent = storage.getRecentCheckins(user.id, 7);
      
      // Dedupliziere auch die recent checkins
      recent = recent.filter((checkin, index, self) =>
        index === self.findIndex((c) => c.id === checkin.id)
      );
      const streak = calculateStreak(uniqueCheckins);

      logger.info('AthleteDashboard', 'Data processed', {
        todayCheckin: !!today,
        recentCount: recent.length,
        streak
      });

      setTodayCheckin(today || null);
      setRecentCheckins(recent);
      setCurrentStreak(streak);

      // Berechne Wochendurchschnitt
      if (recent.length > 0) {
        const avg = {
          sleep: Math.round(recent.reduce((sum, c) => sum + c.sleepQuality, 0) / recent.length),
          mood: Math.round(recent.reduce((sum, c) => sum + c.moodRating, 0) / recent.length),
          pain: Math.round(recent.reduce((sum, c) => sum + c.painLevel, 0) / recent.length),
          stress: Math.round(recent.reduce((sum, c) => sum + c.stressLevel, 0) / recent.length)
        };
        setWeeklyAverage(avg);
        logger.debug('AthleteDashboard', 'Weekly averages calculated', avg);
      }
    } catch (error) {
      logger.error('AthleteDashboard', 'Error loading data', { error });
    }
  }, [user]);

  if (!user || user.role !== 'athlete') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto">
          <Icon name="warning" className="h-4 w-4" />
          <AlertDescription>
            Diese Seite ist nur für Athleten verfügbar.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Willkommen, {user.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Hier ist deine Gesundheitsübersicht für heute
            </p>
          </div>
          <div className="flex items-center gap-3">
            {currentStreak > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Icon name="fire" className="text-orange-500" />
                {currentStreak} Tage Streak
              </Badge>
            )}
            <Button 
              variant="outline" 
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="flex items-center gap-2"
            >
              <Icon name="logout" className="text-gray-600" />
              Abmelden
            </Button>
          </div>
        </div>

        {/* Today's Check-in Status */}
        <Card className={todayCheckin ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon 
                  name={todayCheckin ? 'success' : 'warning'} 
                  className={todayCheckin ? 'text-green-500' : 'text-orange-500'} 
                  size="xl" 
                />
                <div>
                  <CardTitle className={todayCheckin ? 'text-green-800' : 'text-orange-800'}>
                    {todayCheckin ? 'Check-in abgeschlossen' : 'Check-in ausstehend'}
                  </CardTitle>
                  <CardDescription className={todayCheckin ? 'text-green-600' : 'text-orange-600'}>
                    {todayCheckin 
                      ? `Heute um ${new Date(todayCheckin.completedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} abgeschlossen`
                      : 'Vergiss nicht dein tägliches Check-in'
                    }
                  </CardDescription>
                </div>
              </div>
              <Link href="/athlete/checkin">
                <Button className={todayCheckin ? '' : 'animate-pulse'}>
                  <Icon name={todayCheckin ? 'edit' : 'add'} className="mr-2" />
                  {todayCheckin ? 'Bearbeiten' : 'Jetzt starten'}
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        {todayCheckin && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <HealthIcon metric="sleep" className="text-blue-600 text-2xl mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getMetricValueColor('sleepQuality', todayCheckin.sleepQuality)}`}>
                  {todayCheckin.sleepQuality}
                </div>
                <div className="text-sm text-muted-foreground">Schlaf</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <HealthIcon metric="mood" className="text-green-600 text-2xl mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getMetricValueColor('moodRating', todayCheckin.moodRating)}`}>
                  {todayCheckin.moodRating}
                </div>
                <div className="text-sm text-muted-foreground">Stimmung</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <HealthIcon metric="pain" className="text-red-600 text-2xl mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getMetricValueColor('painLevel', todayCheckin.painLevel)}`}>
                  {todayCheckin.painLevel}
                </div>
                <div className="text-sm text-muted-foreground">Schmerzen</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <HealthIcon metric="heart" className="text-purple-600 text-2xl mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getMetricValueColor('stressLevel', todayCheckin.stressLevel)}`}>
                  {todayCheckin.stressLevel}
                </div>
                <div className="text-sm text-muted-foreground">Stress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <HealthIcon metric="fatigue" className="text-orange-600 text-2xl mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getMetricValueColor('fatigueLevel', todayCheckin.fatigueLevel)}`}>
                  {todayCheckin.fatigueLevel}
                </div>
                <div className="text-sm text-muted-foreground">Müdigkeit</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <HealthIcon metric="heart" className="text-red-600 text-2xl mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getMetricValueColor('muscleSoreness', todayCheckin.muscleSoreness)}`}>
                  {todayCheckin.muscleSoreness}
                </div>
                <div className="text-sm text-muted-foreground">Muskelkater</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Weekly Overview */}
        {recentCheckins.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="chart" className="text-blue-600" />
                  7-Tage Durchschnitt
                </CardTitle>
                <CardDescription>
                  Deine durchschnittlichen Werte der letzten Woche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HealthIcon metric="sleep" className="text-blue-600" />
                      <span>Schlaf</span>
                    </div>
                    <div className="font-semibold">{weeklyAverage.sleep}/10</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HealthIcon metric="mood" className="text-green-600" />
                      <span>Stimmung</span>
                    </div>
                    <div className="font-semibold">{weeklyAverage.mood}/10</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HealthIcon metric="pain" className="text-red-600" />
                      <span>Schmerzen</span>
                    </div>
                    <div className="font-semibold">{weeklyAverage.pain}/10</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HealthIcon metric="heart" className="text-purple-600" />
                      <span>Stress</span>
                    </div>
                    <div className="font-semibold">{weeklyAverage.stress}/10</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="calendar" className="text-green-600" />
                  Letzte Check-ins
                </CardTitle>
                <CardDescription>
                  Deine letzten {recentCheckins.length} Check-ins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCheckins.slice(0, 5).map((checkin) => (
                    <div key={checkin.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="font-medium">{formatDate(checkin.date)}</div>
                        <div className="text-sm text-muted-foreground">
                          Mood: {checkin.moodRating}, Schlaf: {checkin.sleepQuality}
                        </div>
                      </div>
                      <Badge variant={checkin.painLevel > 5 ? 'destructive' : 'secondary'}>
                        {checkin.painLevel > 5 ? 'Schmerzen' : 'OK'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {!todayCheckin ? (
            <Card className="bg-background/95 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all">
              <CardContent className="pt-6 text-center">
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setCheckinMode('quick');
                      setShowCheckinForm(true);
                    }}
                    className="btn-cyber w-full mb-3"
                    aria-label="Quick Check-in starten - optimiert für unter 30 Sekunden"
                  >
                    <Icon name="bolt" className="mr-2" />
                    Quick Check-in (30s)
                  </button>
                  <button
                    onClick={() => {
                      setCheckinMode('detailed');
                      setShowCheckinForm(true);
                    }}
                    className="w-full btn-electric"
                    aria-label="Detailliertes Check-in starten - alle Optionen verfügbar"
                  >
                    <Icon name="edit" className="mr-2" />
                    Detailed Check-in
                  </button>
                </div>
                <p className="text-sm text-foreground/80">
                  Gen Z Speed oder klassisch - du entscheidest!
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-background/95 backdrop-blur-sm border-primary/30">
              <CardContent className="pt-6 text-center">
                <Icon name="check-circle" className="text-primary text-3xl mx-auto mb-3 glow-lime" />
                <h3 className="font-semibold mb-2 text-foreground">Check-in Done!</h3>
                <p className="text-sm text-foreground/80 mb-3">
                  Heute schon erledigt - gut gemacht!
                </p>
                <Button
                  onClick={() => {
                    setCheckinMode('detailed');
                    setShowCheckinForm(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Icon name="edit" className="mr-2 w-4 h-4" />
                  Bearbeiten
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="hover:shadow-md transition-shadow cursor-pointer opacity-75">
            <CardContent className="pt-6 text-center">
              <Icon name="chart" className="text-green-600 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Trends anzeigen</h3>
              <p className="text-sm text-muted-foreground">
                Deine Gesundheitstrends im Detail
              </p>
              <Badge variant="outline" className="mt-2">Bald</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer opacity-75">
            <CardContent className="pt-6 text-center">
              <Icon name="trophy" className="text-yellow-600 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Achievements</h3>
              <p className="text-sm text-muted-foreground">
                Deine Erfolge und Streaks
              </p>
              <Badge variant="outline" className="mt-2">Bald</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Motivation */}
        {currentStreak >= 3 && (
          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="pt-6 text-center">
              <Icon name="fire" className="text-orange-500 text-3xl mx-auto mb-3" />
              <h3 className="font-semibold text-orange-800">Fantastischer Streak!</h3>
              <p className="text-orange-600">
                Du hast bereits {currentStreak} Tage in Folge eingecheckt. Weiter so!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Check-in Form Modal */}
        {showCheckinForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {checkinMode === 'quick' ? (
                <QuickCheckinForm
                  existingCheckin={todayCheckin || undefined}
                  onSuccess={(checkin) => {
                    logger.info('AthleteDashboard', 'Quick check-in completed', { checkinId: checkin.id });
                    setTodayCheckin(checkin);
                    setShowCheckinForm(false);
                    
                    // Aktualisiere Daten manuell statt Reload
                    const checkins = storage.getCheckinsByAthleteId(user!.id);
                    const recent = storage.getRecentCheckins(user!.id, 7);
                    const streak = calculateStreak(checkins);
                    
                    setRecentCheckins(recent);
                    setCurrentStreak(streak);
                    
                    // Neuberechnung der Durchschnittswerte
                    if (recent.length > 0) {
                      const avg = {
                        sleep: Math.round(recent.reduce((sum, c) => sum + c.sleepQuality, 0) / recent.length),
                        mood: Math.round(recent.reduce((sum, c) => sum + c.moodRating, 0) / recent.length),
                        pain: Math.round(recent.reduce((sum, c) => sum + c.painLevel, 0) / recent.length),
                        stress: Math.round(recent.reduce((sum, c) => sum + c.stressLevel, 0) / recent.length)
                      };
                      setWeeklyAverage(avg);
                    }
                  }}
                  onCancel={() => setShowCheckinForm(false)}
                />
              ) : (
                <DailyCheckinForm
                  existingCheckin={todayCheckin || undefined}
                  onSuccess={(checkin) => {
                    logger.info('AthleteDashboard', 'Daily check-in completed', { checkinId: checkin.id });
                    setTodayCheckin(checkin);
                    setShowCheckinForm(false);
                    
                    // Aktualisiere Daten manuell statt Reload
                    const checkins = storage.getCheckinsByAthleteId(user!.id);
                    const recent = storage.getRecentCheckins(user!.id, 7);
                    const streak = calculateStreak(checkins);
                    
                    setRecentCheckins(recent);
                    setCurrentStreak(streak);
                    
                    // Neuberechnung der Durchschnittswerte
                    if (recent.length > 0) {
                      const avg = {
                        sleep: Math.round(recent.reduce((sum, c) => sum + c.sleepQuality, 0) / recent.length),
                        mood: Math.round(recent.reduce((sum, c) => sum + c.moodRating, 0) / recent.length),
                        pain: Math.round(recent.reduce((sum, c) => sum + c.painLevel, 0) / recent.length),
                        stress: Math.round(recent.reduce((sum, c) => sum + c.stressLevel, 0) / recent.length)
                      };
                      setWeeklyAverage(avg);
                    }
                  }}
                  onCancel={() => setShowCheckinForm(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}