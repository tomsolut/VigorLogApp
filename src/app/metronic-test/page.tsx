'use client';

import { useState } from 'react';
import {
  MetronicButton,
  MetronicCard,
  MetronicCardContent,
  MetronicCardDescription,
  MetronicCardFooter,
  MetronicCardHeader,
  MetronicCardTitle,
  HealthScoreCard,
  MetronicAlert,
  MetronicProgress,
  HealthMetricProgress,
  MultiProgress,
  CheckInStepper,
  MobileCheckInStepper,
  MetronicBadge,
  BadgeGroup,
  HealthStatusBadge,
  StreakBadge,
  AchievementBadge,
  MetronicAvatar,
  AvatarGroup,
  AthleteAvatar,
  TeamAvatarStack,
  DashboardTabs,
} from '@/components/ui/metronic';
import { AlertCircle, CheckCircle, Home, Play, Save, Settings } from 'lucide-react';
import Link from 'next/link';

export default function MetronicTestPage() {
  const [loading, setLoading] = useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Metronic Components Test</h1>
        <p className="text-muted-foreground">Testing Metronic v9.2.3 components integration in VigorLog</p>
        <Link href="/" className="text-primary hover:underline text-sm mt-2 inline-block">
          ← Zurück zur Startseite
        </Link>
      </div>

      {/* Button Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="space-y-4">
          {/* Standard Variants */}
          <div className="flex gap-4 flex-wrap">
            <MetronicButton variant="primary">Primary</MetronicButton>
            <MetronicButton variant="secondary">Secondary</MetronicButton>
            <MetronicButton variant="destructive">Destructive</MetronicButton>
            <MetronicButton variant="outline">Outline</MetronicButton>
            <MetronicButton variant="ghost">Ghost</MetronicButton>
          </div>

          {/* VigorLog Specific Variants */}
          <div className="flex gap-4 flex-wrap">
            <MetronicButton variant="success">Success</MetronicButton>
            <MetronicButton variant="warning">Warning</MetronicButton>
            <MetronicButton variant="info">Info</MetronicButton>
          </div>

          {/* Sizes */}
          <div className="flex gap-4 items-center flex-wrap">
            <MetronicButton size="sm">Small</MetronicButton>
            <MetronicButton size="md">Medium</MetronicButton>
            <MetronicButton size="lg">Large</MetronicButton>
            <MetronicButton size="icon" variant="outline">
              <Settings className="h-4 w-4" />
            </MetronicButton>
          </div>

          {/* With Icons */}
          <div className="flex gap-4 flex-wrap">
            <MetronicButton icon={Play} variant="success">
              Start Check-in
            </MetronicButton>
            <MetronicButton icon={Save} iconPosition="right" variant="primary">
              Speichern
            </MetronicButton>
            <MetronicButton loading onClick={handleLoadingTest}>
              {loading ? 'Lädt...' : 'Test Loading'}
            </MetronicButton>
          </div>

          {/* Disabled State */}
          <div className="flex gap-4 flex-wrap">
            <MetronicButton disabled>Disabled</MetronicButton>
            <MetronicButton variant="outline" disabled>
              Disabled Outline
            </MetronicButton>
          </div>
        </div>
      </section>

      {/* Card Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Card */}
          <MetronicCard>
            <MetronicCardHeader>
              <MetronicCardTitle>Standard Card</MetronicCardTitle>
            </MetronicCardHeader>
            <MetronicCardContent>
              <MetronicCardDescription>
                Dies ist eine Standard-Card mit Metronic-Styling. Sie unterstützt Header, Content und Footer.
              </MetronicCardDescription>
            </MetronicCardContent>
            <MetronicCardFooter>
              <MetronicButton size="sm" variant="outline">
                Mehr erfahren
              </MetronicButton>
            </MetronicCardFooter>
          </MetronicCard>

          {/* Accent Card */}
          <MetronicCard variant="accent">
            <MetronicCardHeader>
              <MetronicCardTitle>Accent Card</MetronicCardTitle>
            </MetronicCardHeader>
            <MetronicCardContent>
              <MetronicCardDescription>
                Eine Accent-Variante mit einem subtilen Hintergrund für besondere Inhalte.
              </MetronicCardDescription>
            </MetronicCardContent>
          </MetronicCard>

          {/* Stats Card */}
          <MetronicCard variant="stats" hover>
            <MetronicCardHeader>
              <MetronicCardTitle>Statistik Card</MetronicCardTitle>
            </MetronicCardHeader>
            <MetronicCardContent>
              <div className="text-3xl font-bold text-primary">156</div>
              <MetronicCardDescription>Aktive Athleten</MetronicCardDescription>
            </MetronicCardContent>
          </MetronicCard>
        </div>
      </section>

      {/* Health Score Card */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Health Score Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HealthScoreCard score={95} trend={5} status="excellent" />
          <HealthScoreCard score={78} trend={2} status="good" />
          <HealthScoreCard score={65} trend={-3} status="moderate" />
          <HealthScoreCard score={45} trend={-8} status="poor" />
        </div>
      </section>

      {/* Alert Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
        <div className="space-y-4">
          <MetronicAlert>
            <AlertCircle className="h-4 w-4" />
            <div>
              <strong>Info:</strong> Dies ist eine Standard-Alert-Nachricht
            </div>
          </MetronicAlert>

          <MetronicAlert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div>
              <strong>Fehler:</strong> Es ist ein Fehler aufgetreten
            </div>
          </MetronicAlert>

          <MetronicAlert className="border-green-500/30 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <strong>Erfolg:</strong> Check-in erfolgreich gespeichert
            </div>
          </MetronicAlert>
        </div>
      </section>

      {/* Performance Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Performance Test</h2>
        <MetronicCard>
          <MetronicCardHeader>
            <MetronicCardTitle>Bundle Size Comparison</MetronicCardTitle>
          </MetronicCardHeader>
          <MetronicCardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Metronic Button:</span>
                <span className="font-mono text-sm">~4.2KB</span>
              </div>
              <div className="flex justify-between">
                <span>Metronic Card:</span>
                <span className="font-mono text-sm">~3.8KB</span>
              </div>
              <div className="flex justify-between">
                <span>Health Score Card:</span>
                <span className="font-mono text-sm">~1.5KB</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="font-mono">~9.5KB</span>
                </div>
              </div>
            </div>
          </MetronicCardContent>
        </MetronicCard>
      </section>

      {/* Progress Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Progress Components</h2>
        <div className="space-y-6">
          {/* Basic Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Progress</h3>
            <MetronicProgress value={75} showLabel label="Training Fortschritt" />
            <MetronicProgress value={45} indicatorVariant="warning" size="lg" />
            <MetronicProgress value={90} indicatorVariant="success" striped animated />
          </div>

          {/* Health Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Health Metrics</h3>
            <HealthMetricProgress metric="sleep" value={85} />
            <HealthMetricProgress metric="fatigue" value={30} />
            <HealthMetricProgress metric="mood" value={75} />
            <HealthMetricProgress metric="stress" value={45} />
          </div>

          {/* Multi Progress */}
          <div>
            <h3 className="text-lg font-medium mb-2">Multi Progress</h3>
            <MultiProgress
              values={[
                { value: 30, variant: 'success', label: 'Completed' },
                { value: 20, variant: 'warning', label: 'In Progress' },
                { value: 10, variant: 'danger', label: 'Failed' },
              ]}
              size="lg"
            />
          </div>
        </div>
      </section>

      {/* Stepper Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Stepper Component</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Desktop/Responsive Stepper */}
          <MetronicCard>
            <MetronicCardHeader>
              <MetronicCardTitle>Check-in Flow (Responsive)</MetronicCardTitle>
              <MetronicCardDescription>
                Automatische Anpassung für Desktop und Mobile
              </MetronicCardDescription>
            </MetronicCardHeader>
            <MetronicCardContent>
              <CheckInStepper onComplete={() => alert('Check-in completed!')} />
            </MetronicCardContent>
          </MetronicCard>

          {/* Mobile-optimized Stepper */}
          <MetronicCard>
            <MetronicCardHeader>
              <MetronicCardTitle>Mobile-Optimized Stepper</MetronicCardTitle>
              <MetronicCardDescription>
                Speziell für Touch-Geräte optimiert
              </MetronicCardDescription>
            </MetronicCardHeader>
            <MetronicCardContent>
              <MobileCheckInStepper onComplete={() => alert('Mobile check-in completed!')} />
            </MetronicCardContent>
          </MetronicCard>
        </div>
      </section>

      {/* Badge Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Badge Components</h2>
        <div className="space-y-4">
          {/* Standard Badges */}
          <div className="flex gap-2 flex-wrap">
            <MetronicBadge>Default</MetronicBadge>
            <MetronicBadge variant="success">Success</MetronicBadge>
            <MetronicBadge variant="warning">Warning</MetronicBadge>
            <MetronicBadge variant="info">Info</MetronicBadge>
            <MetronicBadge variant="destructive">Error</MetronicBadge>
          </div>

          {/* Badge Sizes & Styles */}
          <div className="flex gap-2 items-center flex-wrap">
            <MetronicBadge size="xs">XS</MetronicBadge>
            <MetronicBadge size="sm">Small</MetronicBadge>
            <MetronicBadge size="md">Medium</MetronicBadge>
            <MetronicBadge size="lg">Large</MetronicBadge>
            <MetronicBadge shape="circle" variant="success">99+</MetronicBadge>
            <MetronicBadge closable onClose={() => console.log('Closed')}>Closable</MetronicBadge>
          </div>

          {/* Health Status Badges */}
          <div className="flex gap-2 flex-wrap">
            <HealthStatusBadge status="excellent" />
            <HealthStatusBadge status="good" />
            <HealthStatusBadge status="moderate" />
            <HealthStatusBadge status="poor" />
          </div>

          {/* Streak & Achievement Badges */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Streak Badges mit Font Awesome Icons:</p>
            <div className="flex gap-2 flex-wrap mb-4">
              <StreakBadge days={7} />
              <StreakBadge days={30} />
              <StreakBadge days={100} />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Streak Badges mit Emojis:</p>
            <div className="flex gap-2 flex-wrap">
              <StreakBadge days={7} useEmoji />
              <StreakBadge days={30} useEmoji />
              <StreakBadge days={100} useEmoji />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Achievement Badges mit Font Awesome Icons:</p>
            <div className="flex gap-2 flex-wrap mb-4">
              <AchievementBadge type="first-checkin" />
              <AchievementBadge type="week-streak" />
              <AchievementBadge type="perfect-week" />
              <AchievementBadge type="month-streak" />
              <AchievementBadge type="team-player" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Achievement Badges mit Emojis:</p>
            <div className="flex gap-2 flex-wrap">
              <AchievementBadge type="first-checkin" useEmoji />
              <AchievementBadge type="week-streak" useEmoji />
              <AchievementBadge type="perfect-week" useEmoji />
            </div>
          </div>

          {/* Badge Group */}
          <BadgeGroup max={3}>
            <MetronicBadge variant="info">React</MetronicBadge>
            <MetronicBadge variant="info">TypeScript</MetronicBadge>
            <MetronicBadge variant="info">Next.js</MetronicBadge>
            <MetronicBadge variant="info">Tailwind</MetronicBadge>
            <MetronicBadge variant="info">Metronic</MetronicBadge>
          </BadgeGroup>
        </div>
      </section>

      {/* Avatar Tests */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Avatar Components</h2>
        <div className="space-y-6">
          {/* Basic Avatars */}
          <div className="flex gap-4 items-center">
            <MetronicAvatar src="https://i.pravatar.cc/150?img=1" alt="User 1" size="xs" />
            <MetronicAvatar src="https://i.pravatar.cc/150?img=2" alt="User 2" size="sm" />
            <MetronicAvatar src="https://i.pravatar.cc/150?img=3" alt="User 3" size="md" />
            <MetronicAvatar src="https://i.pravatar.cc/150?img=4" alt="User 4" size="lg" />
            <MetronicAvatar src="https://i.pravatar.cc/150?img=5" alt="User 5" size="xl" />
          </div>

          {/* Avatars with Status */}
          <div className="flex gap-4">
            <MetronicAvatar fallback="JD" status="online" />
            <MetronicAvatar fallback="AK" status="offline" />
            <MetronicAvatar fallback="ML" status="busy" />
            <MetronicAvatar fallback="TK" status="away" />
            <MetronicAvatar fallback="PS" status="training" />
          </div>

          {/* Athlete Avatars */}
          <div className="flex gap-4">
            <AthleteAvatar name="Max Mustermann" healthStatus="excellent" status="online" />
            <AthleteAvatar name="Anna Schmidt" healthStatus="good" status="training" />
            <AthleteAvatar name="Tom Weber" healthStatus="moderate" status="away" />
            <AthleteAvatar name="Lisa Meyer" healthStatus="poor" status="offline" />
          </div>

          {/* Avatar Groups */}
          <div className="space-y-4">
            <AvatarGroup max={5}>
              <MetronicAvatar src="https://i.pravatar.cc/150?img=1" alt="User 1" />
              <MetronicAvatar src="https://i.pravatar.cc/150?img=2" alt="User 2" />
              <MetronicAvatar src="https://i.pravatar.cc/150?img=3" alt="User 3" />
              <MetronicAvatar src="https://i.pravatar.cc/150?img=4" alt="User 4" />
              <MetronicAvatar src="https://i.pravatar.cc/150?img=5" alt="User 5" />
              <MetronicAvatar src="https://i.pravatar.cc/150?img=6" alt="User 6" />
              <MetronicAvatar src="https://i.pravatar.cc/150?img=7" alt="User 7" />
            </AvatarGroup>

            <TeamAvatarStack
              team={[
                { id: '1', name: 'Max Mustermann', status: 'online' },
                { id: '2', name: 'Anna Schmidt', status: 'training' },
                { id: '3', name: 'Tom Weber', status: 'away' },
                { id: '4', name: 'Lisa Meyer', status: 'offline' },
                { id: '5', name: 'Paul Fischer', status: 'online' },
              ]}
              max={4}
            />
          </div>
        </div>
      </section>

      {/* Tabs Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Tabs Component</h2>
        <DashboardTabs onTabChange={(tab) => console.log('Tab changed:', tab)} />
      </section>

      {/* Navigation */}
      <div className="flex gap-4 mt-12">
        <Link href="/">
          <MetronicButton variant="outline" icon={Home}>
            Zurück zur Startseite
          </MetronicButton>
        </Link>
        <Link href="/athlete">
          <MetronicButton variant="primary">
            Athleten-Dashboard testen
          </MetronicButton>
        </Link>
      </div>
    </div>
  );
}