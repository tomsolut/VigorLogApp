'use client';

// VigorLog - Daily Check-in Page für Athleten

import { useState, useEffect } from 'react';
import { DailyCheckinForm } from '@/components/forms/daily-checkin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { useAuth } from '@/stores/auth';
import { storage } from '@/lib/storage';
import { getTodayString, formatDate, calculateStreak } from '@/lib/utils';
import type { DailyCheckin } from '@/types';

export default function AthleteCheckinPage() {
  const { user } = useAuth();
  const [existingCheckin, setExistingCheckin] = useState<DailyCheckin | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState<DailyCheckin[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'athlete') return;

    // Lade heutigen Check-in falls vorhanden
    const checkins = storage.getCheckinsByAthleteId(user.id);
    const todayCheckin = checkins.find(c => c.date === getTodayString());
    
    if (todayCheckin) {
      setExistingCheckin(todayCheckin);
      setIsCompleted(true);
    }

    // Berechne Streak
    const streak = calculateStreak(checkins);
    setCurrentStreak(streak);

    // Lade letzte 7 Check-ins
    const recent = storage.getRecentCheckins(user.id, 7);
    setRecentCheckins(recent);
  }, [user]);

  const handleCheckinSuccess = (checkin: DailyCheckin) => {
    setExistingCheckin(checkin);
    setIsCompleted(true);
    
    // Aktualisiere Streak
    if (user) {
      const allCheckins = storage.getCheckinsByAthleteId(user.id);
      const newStreak = calculateStreak(allCheckins);
      setCurrentStreak(newStreak);
    }

    // Zeige Erfolgs-Feedback
    // Hier könnte eine Toast-Notification angezeigt werden
  };

  const handleEditCheckin = () => {
    setIsCompleted(false);
  };

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

  if (isCompleted && existingCheckin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-3 mb-2">
                <Icon name="success" className="text-green-500 text-3xl" />
                <CardTitle className="text-2xl text-green-700">
                  Check-in abgeschlossen!
                </CardTitle>
              </div>
              <CardDescription className="text-green-600">
                Danke für dein tägliches Check-in. Deine Gesundheitsdaten wurden gespeichert.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Streak Info */}
          {currentStreak > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="fire" className="text-orange-500 text-2xl" />
                    <div>
                      <h3 className="font-semibold">Streak</h3>
                      <p className="text-sm text-muted-foreground">
                        Tage in Folge
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-500">
                    {currentStreak}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Today's Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="calendar" className="text-blue-600" />
                Heutiges Check-in
              </CardTitle>
              <CardDescription>
                {formatDate(existingCheckin.date)} - {new Date(existingCheckin.completedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {existingCheckin.sleepQuality}
                  </div>
                  <div className="text-xs text-muted-foreground">Schlaf</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {existingCheckin.moodRating}
                  </div>
                  <div className="text-xs text-muted-foreground">Stimmung</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {existingCheckin.fatigueLevel}
                  </div>
                  <div className="text-xs text-muted-foreground">Müdigkeit</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {existingCheckin.muscleSoreness}
                  </div>
                  <div className="text-xs text-muted-foreground">Muskelkater</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">
                    {existingCheckin.painLevel}
                  </div>
                  <div className="text-xs text-muted-foreground">Schmerzen</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {existingCheckin.stressLevel}
                  </div>
                  <div className="text-xs text-muted-foreground">Stress</div>
                </div>
              </div>

              {existingCheckin.painLevel > 3 && existingCheckin.painLocation && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 flex items-center gap-2">
                    <Icon name="pain" className="text-red-600" />
                    Schmerzbereich
                  </h4>
                  <p className="text-red-700 mt-1">{existingCheckin.painLocation}</p>
                </div>
              )}

              {existingCheckin.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <Icon name="edit" className="text-gray-600" />
                    Notizen
                  </h4>
                  <p className="text-gray-700 mt-1">{existingCheckin.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleEditCheckin}
              variant="outline"
              className="flex-1"
            >
              <Icon name="edit" className="mr-2" />
              Check-in bearbeiten
            </Button>
            <Button 
              onClick={() => window.history.back()}
              className="flex-1"
            >
              <Icon name="home" className="mr-2" />
              Zum Dashboard
            </Button>
          </div>

          {/* Motivation */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="pt-6 text-center">
              <Icon name="trophy" className="text-yellow-500 text-2xl mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Gut gemacht!</h3>
              <p className="text-sm text-muted-foreground">
                {currentStreak >= 7 
                  ? `Fantastisch! Du hast bereits ${currentStreak} Tage in Folge eingecheckt.`
                  : `Komm morgen wieder für deinen nächsten Check-in!`
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Willkommen zurück, {user.firstName}!</h1>
            <p className="text-muted-foreground">
              {existingCheckin ? 'Bearbeite dein heutiges Check-in' : 'Zeit für dein tägliches Check-in'}
            </p>
          </div>
          {currentStreak > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Icon name="fire" className="text-orange-500" />
              {currentStreak} Tage Streak
            </Badge>
          )}
        </div>

        {recentCheckins.length === 0 && (
          <Alert>
            <Icon name="info" className="h-4 w-4" />
            <AlertDescription>
              Das ist dein erstes Check-in! Es dauert nur 1-2 Minuten und hilft dabei, deine Gesundheit zu überwachen.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Daily Check-in Form */}
      <DailyCheckinForm
        onSuccess={handleCheckinSuccess}
        existingCheckin={existingCheckin}
      />
    </div>
  );
}