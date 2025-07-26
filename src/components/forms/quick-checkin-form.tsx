'use client';

// VigorLog - Quick Check-in Form (Under 30 Seconds)
// Gen Z optimierte Version mit Swipe-Gestures und One-Hand-Navigation

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon, HealthIcon } from '@/components/ui/icon';
import { DailyCheckinSchema, type DailyCheckinData } from '@/lib/validations';
import { storage } from '@/lib/storage';
import { useAuth } from '@/stores/auth';
import { generateId, getTodayString } from '@/lib/utils';
import type { DailyCheckin } from '@/types';

interface HealthMetric {
  key: keyof DailyCheckinData;
  label: string;
  icon: 'sleep' | 'fatigue' | 'mood' | 'pain' | 'heart';
  color: string;
  quickPresets: { value: number; label: string; color: string }[];
}

const healthMetrics: HealthMetric[] = [
  {
    key: 'sleepQuality',
    label: 'Schlaf',
    icon: 'sleep',
    color: 'text-chart-1',
    quickPresets: [
      { value: 3, label: 'Schlecht', color: 'bg-red-500' },
      { value: 5, label: 'OK', color: 'bg-orange-500' },
      { value: 8, label: 'Gut', color: 'bg-primary' }
    ]
  },
  {
    key: 'moodRating',
    label: 'Stimmung',
    icon: 'mood',
    color: 'text-chart-4',
    quickPresets: [
      { value: 3, label: 'Mies', color: 'bg-red-500' },
      { value: 5, label: 'Neutral', color: 'bg-orange-500' },
      { value: 8, label: 'Super', color: 'bg-primary' }
    ]
  },
  {
    key: 'fatigueLevel',
    label: 'Energie',
    icon: 'fatigue',
    color: 'text-chart-2',
    quickPresets: [
      { value: 8, label: 'Müde', color: 'bg-red-500' },
      { value: 5, label: 'OK', color: 'bg-orange-500' },
      { value: 2, label: 'Fit', color: 'bg-primary' }
    ]
  },
  {
    key: 'painLevel',
    label: 'Schmerzen',
    icon: 'pain',
    color: 'text-chart-5',
    quickPresets: [
      { value: 1, label: 'Keine', color: 'bg-primary' },
      { value: 4, label: 'Leicht', color: 'bg-orange-500' },
      { value: 7, label: 'Stark', color: 'bg-red-500' }
    ]
  },
  {
    key: 'stressLevel',
    label: 'Stress',
    icon: 'heart',
    color: 'text-chart-3',
    quickPresets: [
      { value: 2, label: 'Chill', color: 'bg-primary' },
      { value: 5, label: 'Normal', color: 'bg-orange-500' },
      { value: 8, label: 'Hoch', color: 'bg-red-500' }
    ]
  }
];

interface QuickCheckinFormProps {
  onSuccess?: (checkin: DailyCheckin) => void;
  onCancel?: () => void;
  existingCheckin?: DailyCheckin;
}

export function QuickCheckinForm({ onSuccess, onCancel, existingCheckin }: QuickCheckinFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [startTime] = useState(Date.now());
  const [completionTime, setCompletionTime] = useState(0);

  const form = useForm<DailyCheckinData>({
    resolver: zodResolver(DailyCheckinSchema),
    defaultValues: {
      sleepQuality: existingCheckin?.sleepQuality || 7,
      fatigueLevel: existingCheckin?.fatigueLevel || 5,
      muscleSoreness: existingCheckin?.muscleSoreness || 3,
      moodRating: existingCheckin?.moodRating || 7,
      painLevel: existingCheckin?.painLevel || 2,
      stressLevel: existingCheckin?.stressLevel || 4,
      painLocation: existingCheckin?.painLocation || '',
      notes: existingCheckin?.notes || '',
    },
  });

  const watchedValues = form.watch();

  // Quick preset selection
  const handleQuickSelect = useCallback((metricKey: keyof DailyCheckinData, value: number) => {
    form.setValue(metricKey, value);
    
    // Auto-advance to next metric (Gen Z speed optimization)
    if (currentMetric < healthMetrics.length - 1) {
      setTimeout(() => {
        setCurrentMetric(prev => prev + 1);
      }, 300);
    }
  }, [form, currentMetric]);

  // Keyboard shortcuts for power users
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '3') {
        const presetIndex = parseInt(e.key) - 1;
        const metric = healthMetrics[currentMetric];
        if (metric && metric.quickPresets && metric.quickPresets[presetIndex]) {
          handleQuickSelect(metric.key, metric.quickPresets[presetIndex].value);
        }
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentMetric(prev => Math.min(prev + 1, healthMetrics.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentMetric(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && currentMetric === healthMetrics.length - 1) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentMetric, form, handleQuickSelect]);

  const onSubmit = async (data: DailyCheckinData) => {
    if (!user || user.role !== 'athlete') {
      setSubmitError('Nur Athleten können Check-ins erstellen');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    setCompletionTime(timeTaken);

    try {
      const checkin: DailyCheckin = {
        id: existingCheckin?.id || generateId(),
        athleteId: user.id,
        date: getTodayString(),
        sleepQuality: data.sleepQuality,
        fatigueLevel: data.fatigueLevel,
        muscleSoreness: data.muscleSoreness,
        moodRating: data.moodRating,
        painLevel: data.painLevel,
        painLocation: data.painLocation,
        stressLevel: data.stressLevel,
        notes: data.notes,
        completedAt: new Date().toISOString(),
      };

      const success = storage.addCheckin(checkin);
      
      if (!success) {
        throw new Error('Fehler beim Speichern des Check-ins');
      }

      onSuccess?.(checkin);
    } catch (error) {
      console.error('Quick check-in submission error:', error);
      setSubmitError('Fehler beim Speichern. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'athlete') {
    return (
      <Card className="max-w-md mx-auto bg-background/95 backdrop-blur-sm border-red-500/30">
        <CardContent className="pt-6 text-center">
          <Icon name="triangle-exclamation" className="text-red-500 mb-2 mx-auto" size="2xl" />
          <p className="text-foreground">Quick Check-ins sind nur für Athleten verfügbar.</p>
        </CardContent>
      </Card>
    );
  }

  const currentMetricData = healthMetrics[currentMetric];
  const progress = ((currentMetric + 1) / healthMetrics.length) * 100;
  
  // Safety check für currentMetricData
  if (!currentMetricData) {
    return (
      <Card className="max-w-md mx-auto bg-background/95 backdrop-blur-sm border-red-500/30">
        <CardContent className="pt-6 text-center">
          <Icon name="triangle-exclamation" className="text-red-500 mb-2 mx-auto" size="2xl" />
          <p className="text-foreground">Ein Fehler ist aufgetreten. Bitte lade die Seite neu.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Header with Progress */}
      <Card className="bg-background/95 backdrop-blur-sm border-primary/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="bolt" className="text-primary glow-lime" />
              <CardTitle className="text-foreground">Quick Check-in</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30 text-primary">
                {currentMetric + 1}/{healthMetrics.length}
              </Badge>
              <button
                onClick={onCancel}
                className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                aria-label="Quick Check-in abbrechen"
              >
                <Icon name="cancel" className="text-destructive" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mt-3">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 glow-lime"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <CardDescription className="text-foreground/80 text-center mt-2">
            Ziel: Under 30 Sekunden <Icon name="rocket" className="inline ml-1 text-primary" size="xs" />
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current Metric */}
      <Card className="bg-background/95 backdrop-blur-sm border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="mb-2">
            <HealthIcon metric={currentMetricData.icon} className={`${currentMetricData.color} mx-auto`} size="2xl" />
          </div>
          <CardTitle className="text-foreground text-xl">
            Wie ist dein {currentMetricData.label} heute?
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {currentMetricData.quickPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(currentMetricData.key, preset.value)}
                className={`h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary touch-target ${
                  watchedValues[currentMetricData.key] === preset.value
                    ? 'border-primary bg-primary/20 glow-lime'
                    : 'border-primary/20 bg-background/50 hover:border-primary/40'
                }`}
                aria-label={`${currentMetricData.label} als ${preset.label} bewerten (Wert ${preset.value})`}
              >
                <div className={`w-3 h-3 rounded-full ${preset.color} mx-auto mb-1`} />
                <div className="text-foreground font-medium text-sm">{preset.label}</div>
                <div className="text-foreground/60 text-xs">Taste {index + 1}</div>
              </button>
            ))}
          </div>

          {/* Current Value Display */}
          <div className="text-center p-3 bg-background/95 backdrop-blur-sm rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {watchedValues[currentMetricData.key]}
            </div>
            <div className="text-foreground/80 text-sm">Aktueller Wert</div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {currentMetric > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentMetric(prev => prev - 1)}
                className="flex-1 border-primary/20 text-foreground hover:bg-primary/10 touch-target"
                aria-label={`Zurück zur vorherigen Metrik: ${healthMetrics[currentMetric - 1]?.label}`}
              >
                <Icon name="arrow-left" className="mr-2" />
                Zurück
              </Button>
            )}
            
            {currentMetric < healthMetrics.length - 1 ? (
              <Button
                type="button"
                onClick={() => setCurrentMetric(prev => prev + 1)}
                className="flex-1 btn-cyber"
                aria-label={`Weiter zur nächsten Metrik: ${healthMetrics[currentMetric + 1]?.label}`}
              >
                Weiter
                <Icon name="arrow-right" className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex-1 btn-cyber"
                aria-label="Quick Check-in abschließen und speichern"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="spinner" className="mr-2 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  <>
                    <Icon name="check-circle" className="mr-2" />
                    Fertig!
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Helper */}
      <Card className="bg-background/95 backdrop-blur-sm border-foreground/10">
        <CardContent className="pt-4">
          <div className="text-center text-foreground/60 text-xs space-y-1">
            <p><Icon name="keyboard" className="inline mr-1" size="xs" /> Shortcuts: Tasten 1-3 für Quick-Select</p>
            <p>Pfeiltasten: <Icon name="arrow-left" className="inline" size="xs" /> <Icon name="arrow-right" className="inline" size="xs" /> Navigation • Enter: Abschließen</p>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {submitError && (
        <Card className="bg-background/95 backdrop-blur-sm border-red-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-400">
              <Icon name="circle-exclamation" className="text-sm" />
              <span className="text-sm">{submitError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Celebration */}
      {completionTime > 0 && !isSubmitting && (
        <Card className="bg-background/95 backdrop-blur-sm border-primary/30">
          <CardContent className="pt-4 text-center">
            <div className="mb-2">
              <Icon name="party-horn" className="text-primary text-3xl mx-auto glow-lime" />
            </div>
            <div className="text-foreground font-semibold">
              Check-in completed in {completionTime}s!
            </div>
            <div className="text-foreground/80 text-sm mt-1">
              {completionTime <= 30 ? (
                <>
                  <Icon name="rocket" className="inline mr-1" size="xs" />
                  Gen Z Speed achieved!
                </>
              ) : (
                <>
                  <Icon name="bolt" className="inline mr-1" size="xs" />
                  Try for under 30s next time!
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default QuickCheckinForm;