'use client';

// VigorLog - Daily Check-in Form
// Kern-Feature: 6 Gesundheitsmetriken mit horizontalen Slidern

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Icon, HealthIcon, LoadingIcon } from '@/components/ui/icon';
import { DailyCheckinSchema, type DailyCheckinData } from '@/lib/validations';
import { storage } from '@/lib/storage';
import { useAuth } from '@/stores/auth';
import { generateId, getTodayString, formatHealthMetric } from '@/lib/utils';
import type { DailyCheckin } from '@/types';

interface HealthMetric {
  key: keyof DailyCheckinData;
  label: string;
  icon: 'sleep' | 'fatigue' | 'mood' | 'pain' | 'heart';
  color: string;
  lowLabel: string;
  highLabel: string;
  description: string;
}

const healthMetrics: HealthMetric[] = [
  {
    key: 'sleepQuality',
    label: 'Schlafqualität',
    icon: 'sleep',
    color: 'text-blue-600',
    lowLabel: 'Sehr schlecht',
    highLabel: 'Ausgezeichnet',
    description: 'Wie gut hast du heute Nacht geschlafen?'
  },
  {
    key: 'fatigueLevel',
    label: 'Müdigkeit',
    icon: 'fatigue',
    color: 'text-orange-600',
    lowLabel: 'Sehr müde',
    highLabel: 'Sehr wach',
    description: 'Wie müde fühlst du dich gerade?'
  },
  {
    key: 'muscleSoreness',
    label: 'Muskelkater',
    icon: 'heart',
    color: 'text-red-600',
    lowLabel: 'Kein Kater',
    highLabel: 'Starker Kater',
    description: 'Wie stark ist dein Muskelkater heute?'
  },
  {
    key: 'moodRating',
    label: 'Stimmung',
    icon: 'mood',
    color: 'text-green-600',
    lowLabel: 'Sehr schlecht',
    highLabel: 'Sehr gut',
    description: 'Wie ist deine Stimmung heute?'
  },
  {
    key: 'painLevel',
    label: 'Schmerzen',
    icon: 'pain',
    color: 'text-red-700',
    lowLabel: 'Keine Schmerzen',
    highLabel: 'Starke Schmerzen',
    description: 'Hast du heute Schmerzen?'
  },
  {
    key: 'stressLevel',
    label: 'Stress',
    icon: 'heart',
    color: 'text-purple-600',
    lowLabel: 'Entspannt',
    highLabel: 'Sehr gestresst',
    description: 'Wie gestresst fühlst du dich?'
  }
];

interface DailyCheckinFormProps {
  onSuccess?: (checkin: DailyCheckin) => void;
  onCancel?: () => void;
  existingCheckin?: DailyCheckin;
}

export function DailyCheckinForm({ onSuccess, onCancel, existingCheckin }: DailyCheckinFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

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
  const painLevel = form.watch('painLevel');

  const onSubmit = async (data: DailyCheckinData) => {
    if (!user || user.role !== 'athlete') {
      setSubmitError('Nur Athleten können Check-ins erstellen');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

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
      console.error('Check-in submission error:', error);
      setSubmitError('Fehler beim Speichern. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSliderColor = (value: number, metric: HealthMetric) => {
    if (metric.key === 'painLevel' || metric.key === 'fatigueLevel' || metric.key === 'stressLevel') {
      // Für negative Metriken: Rot bei hohen Werten
      if (value >= 7) return 'bg-red-500';
      if (value >= 5) return 'bg-orange-500';
      return 'bg-green-500';
    } else {
      // Für positive Metriken: Grün bei hohen Werten
      if (value >= 7) return 'bg-green-500';
      if (value >= 5) return 'bg-orange-500';
      return 'bg-red-500';
    }
  };

  const getValueDescription = (value: number) => {
    if (value >= 8) return 'Sehr gut';
    if (value >= 6) return 'Gut';
    if (value >= 4) return 'Mittel';
    if (value >= 2) return 'Schlecht';
    return 'Sehr schlecht';
  };

  const isStepView = healthMetrics.length > 3; // Multi-Step für bessere Mobile UX

  if (!user || user.role !== 'athlete') {
    return (
      <Alert className="max-w-md mx-auto">
        <Icon name="warning" className="h-4 w-4" />
        <AlertDescription>
          Daily Check-ins sind nur für Athleten verfügbar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Icon name="heart" className="text-red-500" size="2xl" />
            <CardTitle className="text-2xl">Daily Check-in</CardTitle>
          </div>
          <CardDescription>
            Wie fühlst du dich heute? (Dauert nur 1-2 Minuten)
          </CardDescription>
          {existingCheckin && (
            <Badge variant="outline" className="mx-auto">
              <Icon name="edit" className="w-3 h-3 mr-1" />
              Check-in bearbeiten
            </Badge>
          )}
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Health Metrics */}
          <div className="grid gap-6">
            {healthMetrics.map((metric, index) => (
              <Card key={metric.key} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <HealthIcon 
                      metric={metric.icon} 
                      className={`${metric.color} text-xl`} 
                    />
                    <div className="flex-1">
                      <FormLabel className="text-base font-semibold">
                        {metric.label}
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {watchedValues[metric.key]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getValueDescription(watchedValues[metric.key])}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name={metric.key}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={0}
                              max={10}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{metric.lowLabel}</span>
                              <span>{metric.highLabel}</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pain Location (conditional) */}
          {painLevel > 3 && (
            <Card>
              <CardHeader>
                <FormLabel className="flex items-center gap-2">
                  <Icon name="pain" className="text-red-600" />
                  Wo hast du Schmerzen?
                </FormLabel>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="painLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="z.B. Rechtes Knie, unterer Rücken, Schulter..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <FormLabel className="flex items-center gap-2">
                <Icon name="edit" className="text-gray-600" />
                Zusätzliche Notizen (optional)
              </FormLabel>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Besondere Ereignisse, Training, Gefühle..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Error Display */}
          {submitError && (
            <Alert variant="destructive">
              <Icon name="error" className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 text-base"
            >
              {isSubmitting ? (
                <>
                  <LoadingIcon className="mr-2" />
                  Speichere...
                </>
              ) : (
                <>
                  <Icon name="save" className="mr-2" />
                  {existingCheckin ? 'Check-in aktualisieren' : 'Check-in speichern'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="h-12"
              >
                <Icon name="cancel" className="mr-2" />
                Abbrechen
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Quick Stats Preview */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((watchedValues.sleepQuality + watchedValues.moodRating) / 2)}
              </div>
              <div className="text-xs text-muted-foreground">Wohlbefinden</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((watchedValues.fatigueLevel + watchedValues.stressLevel) / 2)}
              </div>
              <div className="text-xs text-muted-foreground">Belastung</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {Math.round((watchedValues.painLevel + watchedValues.muscleSoreness) / 2)}
              </div>
              <div className="text-xs text-muted-foreground">Körperlich</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DailyCheckinForm;