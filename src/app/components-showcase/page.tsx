'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Tabs component not needed for this showcase
import { Icon } from '@/components/ui/icon';

// Import all custom components
import { HealthRingProgress, HealthRingMini, HealthRingSmall, HealthRingMedium, HealthRingLarge } from '@/components/ui/health-ring-progress';
import { TouchSlider, HealthSlider, MoodSlider, StressSlider } from '@/components/ui/touch-slider';
import { HealthScoreCard, MetricCard, HealthMetricCard } from '@/components/ui/health-score-card';
import { TeamHealthOverview, TeamHealthCompact } from '@/components/ui/team-health-overview';
import { AlertSummary, AlertBadge } from '@/components/ui/alert-summary';
import { StreakBadge, StreakFire, StreakMilestone, StreakCounter } from '@/components/ui/streak-badge';
import { MobileNav, AthleteNav, CoachNav, FloatingActionButton, TabNav } from '@/components/ui/mobile-nav';

export default function ComponentsShowcasePage() {
  const [sliderValue, setSliderValue] = useState(7);
  const [activeTab, setActiveTab] = useState('overview');

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

  const navItems = [
    { href: '/dashboard', icon: 'home', label: 'Home' },
    { href: '/checkin', icon: 'add', label: 'Check-in' },
    { href: '/progress', icon: 'chart', label: 'Progress' },
    { href: '/alerts', icon: 'warning', label: 'Alerts', badge: 3 },
    { href: '/profile', icon: 'user', label: 'Profile' },
  ];

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: 'dashboard' },
    { id: 'team', label: 'Team', icon: 'users' },
    { id: 'metrics', label: 'Metriken', icon: 'chart' },
    { id: 'settings', label: 'Einstellungen', icon: 'cog' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-24">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <HealthScoreCard
                  title="Energie"
                  value={65}
                  icon="fatigue"
                  iconColor="text-yellow-500"
                  size="sm"
                />
                <HealthScoreCard
                  title="Stress"
                  value={35}
                  icon="heart"
                  iconColor="text-purple-500"
                  size="sm"
                />
                <HealthScoreCard
                  title="Mood"
                  value={78}
                  icon="mood"
                  iconColor="text-green-500"
                  size="sm"
                />
                <HealthScoreCard
                  title="Recovery"
                  value={88}
                  icon="recovery"
                  iconColor="text-lime-500"
                  size="sm"
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
              <div className="grid md:grid-cols-2 gap-4">
                <TeamHealthCompact
                  teamName="Frauen Team"
                  members={sampleTeamMembers.slice(0, 2)}
                />
                <TeamHealthCompact
                  teamName="Jugend A"
                  members={sampleTeamMembers.slice(2)}
                />
              </div>
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
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Fire Animation:</span>
                <StreakFire intensity={1} />
                <StreakFire intensity={3} />
                <StreakFire intensity={5} />
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
                <TouchSlider
                  value={6}
                  onChange={(v) => console.log('Custom:', v)}
                  label="Energie Level"
                  color="warning"
                  size="lg"
                  showTicks
                />
              </div>
            </CardContent>
          </Card>

          {/* Mobile Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Mobile Navigation</CardTitle>
              <CardDescription>
                Native App-ähnliche Navigation für mobile Geräte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Tab Navigation</h3>
                <TabNav
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3">Bottom Navigation Preview</h3>
                <div className="relative h-20 bg-muted rounded-lg overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-background border-t">
                    <div className="flex items-center justify-around h-16">
                      {navItems.map((item) => (
                        <div key={item.href} className="flex flex-col items-center gap-1 text-muted-foreground">
                          <Icon name={item.icon} className="w-5 h-5" />
                          <span className="text-[10px]">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3">Floating Action Button</h3>
                <div className="flex gap-3">
                  <FloatingActionButton
                    onClick={() => console.log('FAB clicked')}
                    className="relative bottom-auto position-static"
                  />
                  <FloatingActionButton
                    onClick={() => console.log('Edit clicked')}
                    icon="edit"
                    className="relative bottom-auto position-static bg-blue-600"
                  />
                  <FloatingActionButton
                    onClick={() => console.log('Camera clicked')}
                    icon="photo"
                    className="relative bottom-auto position-static bg-purple-600"
                  />
                </div>
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

      {/* Demo Mobile Navigation */}
      <AthleteNav alerts={3} />
    </div>
  );
}