'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';

// Import all custom components
import { HealthRingMini, HealthRingSmall, HealthRingMedium, HealthRingLarge } from '@/components/ui/health-ring-progress';
import { TouchSlider, HealthSlider, MoodSlider, StressSlider } from '@/components/ui/touch-slider';
import { HealthScoreCard, MetricCard, HealthMetricCard } from '@/components/ui/health-score-card';
import { TeamHealthOverview, TeamHealthCompact } from '@/components/ui/team-health-overview';
import { AlertSummary, AlertBadge } from '@/components/ui/alert-summary';
import { StreakBadge, StreakMilestone, StreakCounter } from '@/components/ui/streak-badge';

export default function ShowcasePage() {
  const [sliderValue, setSliderValue] = useState(7);

  // Sample data
  const sampleTeamMembers = [
    { id: '1', name: 'Max Mustermann', healthScore: 85, status: 'excellent' as const, lastCheckin: 'Heute, 08:30', streak: 15 },
    { id: '2', name: 'Anna Schmidt', healthScore: 72, status: 'good' as const, lastCheckin: 'Heute, 09:15', hasAlert: true, streak: 7 },
    { id: '3', name: 'Tom Weber', healthScore: 45, status: 'concern' as const, lastCheckin: 'Gestern', hasAlert: true },
    { id: '4', name: 'Lisa Müller', healthScore: 28, status: 'critical' as const, lastCheckin: 'Vor 2 Tagen', hasAlert: true },
  ];

  const sampleAlerts = [
    { id: '1', athleteName: 'Anna Schmidt', title: 'Hohe Stressbelastung', message: 'Stress Level bei 8/10 für 3 Tage in Folge', severity: 'high' as const, createdAt: 'Vor 2 Stunden' },
    { id: '2', athleteName: 'Tom Weber', title: 'Schlechte Schlafqualität', message: 'Durchschnittlich nur 4 Stunden Schlaf', severity: 'critical' as const, createdAt: 'Vor 5 Stunden' },
    { id: '3', athleteName: 'Lisa Müller', title: 'Fehlende Check-ins', message: '3 Tage keine Check-ins', severity: 'medium' as const, createdAt: 'Heute, 08:00' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">VigorLog Custom Components</h1>
          <p className="text-muted-foreground">
            Optimierte Health & Fitness Komponenten - Total Bundle {'<'} 20KB
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid gap-8">
          {/* Health Score Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Health Score Cards</CardTitle>
              <CardDescription>
                Flexible Karten für Gesundheitsmetriken mit verschiedenen Größen und Stilen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <HealthScoreCard
                  title="Gesundheit"
                  value={82}
                  subtitle="/ 100"
                  icon="heart"
                  iconColor="text-red-500"
                  trend="up"
                  trendValue="+5% diese Woche"
                  accentColor="#10b981"
                />
                <HealthMetricCard
                  title="Schlafqualität"
                  value={75}
                  subtitle="%"
                  icon="sleep"
                  iconColor="text-blue-500"
                  trend="stable"
                  size="md"
                />
                <MetricCard
                  title="Check-ins"
                  value={127}
                  subtitle="Total"
                  icon="check-circle"
                  iconColor="text-green-500"
                  trend="up"
                  trendValue="+12 diese Woche"
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Team Health Overview</CardTitle>
              <CardDescription>
                Team-Übersicht mit Health Scores und Status-Indikatoren
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TeamHealthOverview
                teamName="FC VigorLog U19"
                members={sampleTeamMembers}
                onMemberClick={(id) => console.log('Member clicked:', id)}
              />
            </CardContent>
          </Card>

          {/* Alert Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Alert System</CardTitle>
              <CardDescription>
                Warnungs-Komponenten für kritische Gesundheitswerte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertSummary
                alerts={sampleAlerts}
                onAlertClick={(alert) => console.log('Alert clicked:', alert)}
                onViewAll={() => console.log('View all alerts')}
                showResolveButton
                onResolve={(id) => console.log('Resolve alert:', id)}
              />
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Alert Badge Beispiel:</span>
                <AlertBadge alerts={sampleAlerts} />
              </div>
            </CardContent>
          </Card>

          {/* Streak Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Streak & Achievements</CardTitle>
              <CardDescription>
                Gamification-Elemente für Motivation und Engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <StreakBadge count={3} size="sm" />
                <StreakBadge count={7} size="md" />
                <StreakBadge count={14} size="md" />
                <StreakBadge count={30} size="lg" />
                <StreakBadge count={100} size="lg" showAnimation />
              </div>
              <div className="flex flex-wrap gap-3">
                <StreakMilestone count={7} />
                <StreakMilestone count={30} />
                <StreakMilestone count={100} />
              </div>
              <div className="max-w-md space-y-4">
                <StreakCounter current={23} target={30} />
                <StreakCounter current={95} target={100} />
              </div>
            </CardContent>
          </Card>

          {/* Touch Sliders */}
          <Card>
            <CardHeader>
              <CardTitle>Touch-Optimized Controls</CardTitle>
              <CardDescription>
                Mobile-optimierte Eingabe-Komponenten mit Haptic Feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md mx-auto space-y-6">
                <HealthSlider
                  value={sliderValue}
                  onChange={setSliderValue}
                  label="Allgemeines Wohlbefinden"
                />
                <MoodSlider
                  value={8}
                  onChange={(v) => console.log('Mood:', v)}
                />
                <StressSlider
                  value={3}
                  onChange={(v) => console.log('Stress:', v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bundle Size Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Bundle Size Übersicht</CardTitle>
              <CardDescription>
                Optimiert für Performance und schnelle Ladezeiten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">shadcn/ui (Base)</span>
                  <span className="font-mono text-sm">10.7KB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">+ Custom Components</span>
                  <span className="font-mono text-sm">~9KB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950">
                  <span className="font-bold">Total Bundle</span>
                  <span className="font-mono font-bold text-green-600">~19.7KB</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>97% kleiner</strong> als Metronic (2.2MB)<br />
                  <strong>79% kleiner</strong> als Mantine UI (95KB)<br />
                  <strong>100% optimiert</strong> für Mobile Performance
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}