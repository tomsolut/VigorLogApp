'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@/components/ui/icon';
import { TeamHealthOverview as TeamHealthOverviewComponent } from '@/components/ui/team-health-overview';
import { AlertSummary } from '@/components/ui/alert-summary';
import { HealthScoreCard } from '@/components/ui/health-score-card';
import { CoachNav } from '@/components/ui/mobile-nav';
import { storage } from '@/lib/storage';
import { Alert, Athlete, Coach, DailyCheckin, Team } from '@/types';
import { formatDate, getHealthStatusColor, getTodayString, isToday } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface TeamHealthOverview {
  athleteId: string;
  name: string;
  healthStatus: 'excellent' | 'good' | 'concern' | 'critical';
  lastCheckin: string;
  alertCount: number;
  currentStreak: number;
  todayCheckin: boolean;
}

export default function CoachDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [teamHealth, setTeamHealth] = useState<TeamHealthOverview[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [user, setUser] = useState<Coach | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Small delay to ensure store is hydrated
    const checkAuth = setTimeout(() => {
      const currentUser = useAuthStore.getState().currentUser;
      logger.info('CoachDashboard', 'Auth check', { currentUser });
      
      if (!currentUser) {
        logger.warn('CoachDashboard', 'No user found, redirecting to home');
        router.push('/');
        return;
      }
      
      if (currentUser.role !== 'coach') {
        logger.warn('CoachDashboard', 'User is not a coach', { role: currentUser.role });
        router.push('/');
        return;
      }

      setUser(currentUser as Coach);
      setAuthChecked(true);
      
      // Initialize demo data if needed (temporary fix)
      import('@/lib/demo-data').then(({ initializeDemoData }) => {
        initializeDemoData();
        setTimeout(() => {
          loadDashboardData();
        }, 500);
      });
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [router]);

  const loadDashboardData = () => {
    try {
      setLoading(true);
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser || currentUser.role !== 'coach') return;
      
      const coach = currentUser as Coach;
      
      // Load teams
      const allTeams = storage.getTeams();
      logger.info('CoachDashboard', 'Loading teams', { 
        coachTeamIds: coach.teamIds,
        allTeamsCount: allTeams.length,
        allTeamIds: allTeams.map(t => t.id)
      });
      const coachTeams = allTeams.filter(team => coach.teamIds.includes(team.id));
      setTeams(coachTeams);
      
      // Load athletes
      const allAthletes = storage.getUsers().filter(u => u.role === 'athlete') as Athlete[];
      const teamAthletes = allAthletes.filter(athlete => 
        coachTeams.some(team => team.athleteIds.includes(athlete.id))
      );
      setAthletes(teamAthletes);
      
      // Load health overview
      const healthOverview = teamAthletes.map(athlete => {
        const checkins = storage.getAthleteCheckins(athlete.id);
        const lastCheckin = checkins[0];
        const athleteAlerts = storage.getAlerts().filter(
          alert => alert.athleteId === athlete.id && !alert.isResolved
        );
        
        // Calculate health status based on last checkin
        let healthStatus: TeamHealthOverview['healthStatus'] = 'good';
        if (lastCheckin) {
          const avgScore = (
            lastCheckin.sleepQuality + 
            (10 - lastCheckin.fatigueLevel) + 
            (10 - lastCheckin.muscleSoreness) + 
            lastCheckin.moodRating + 
            (10 - lastCheckin.painLevel) + 
            (10 - lastCheckin.stressLevel)
          ) / 6;
          
          if (avgScore >= 8) healthStatus = 'excellent';
          else if (avgScore >= 6) healthStatus = 'good';
          else if (avgScore >= 4) healthStatus = 'concern';
          else healthStatus = 'critical';
        }
        
        return {
          athleteId: athlete.id,
          name: `${athlete.firstName} ${athlete.lastName}`,
          healthStatus,
          lastCheckin: lastCheckin ? lastCheckin.date : 'Kein Check-in',
          alertCount: athleteAlerts.length,
          currentStreak: athlete.currentStreak,
          todayCheckin: lastCheckin ? isToday(lastCheckin.date) : false
        };
      });
      
      setTeamHealth(healthOverview);
      
      // Load alerts
      const allAlerts = storage.getAlerts();
      const teamAlerts = allAlerts.filter(alert => 
        teamAthletes.some(athlete => athlete.id === alert.athleteId) && !alert.isResolved
      );
      setActiveAlerts(teamAlerts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      
      logger.info('CoachDashboard', 'Dashboard data loaded', {
        teams: coachTeams.length,
        athletes: teamAthletes.length,
        alerts: teamAlerts.length
      });
    } catch (error) {
      logger.error('CoachDashboard', 'Error loading dashboard data', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleAthleteClick = (athleteId: string) => {
    router.push(`/coach/athlete/${athleteId}`);
  };

  const handleAlertClick = (alert: Alert) => {
    router.push(`/coach/athlete/${alert.athleteId}?alert=${alert.id}`);
  };

  const filteredTeamHealth = selectedTeam === 'all' 
    ? teamHealth 
    : teamHealth.filter(health => {
        const athlete = athletes.find(a => a.id === health.athleteId);
        return athlete?.teamId === selectedTeam;
      });

  const getAlertIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'exclamation-circle';
      case 'high': return 'exclamation-triangle';
      case 'medium': return 'info-circle';
      default: return 'circle-info';
    }
  };

  const getAlertColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="spinner" className="animate-spin text-4xl text-primary mb-4" />
          <p className="text-muted-foreground">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  const todayCheckins = teamHealth.filter(h => h.todayCheckin).length;
  const checkInRate = athletes.length > 0 ? Math.round((todayCheckins / athletes.length) * 100) : 0;

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="text-center">
          <Icon name="loading" className="text-primary mb-4 animate-spin" size="2xl" />
          <p className="text-lg text-foreground">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Coach Dashboard
            </h1>
            <p className="text-muted-foreground">
              Willkommen zurück, {user?.firstName}!
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/coach/team')}
              className="btn-secondary"
            >
              <Icon name="users" className="mr-2" />
              Team verwalten
            </button>
            <button
              onClick={() => {
                useAuthStore.getState().logout();
                router.push('/');
              }}
              className="btn-secondary"
            >
              <Icon name="logout" className="mr-2" />
              Abmelden
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <HealthScoreCard
            title="Athleten"
            value={athletes.length}
            subtitle={`in ${teams.length} ${teams.length === 1 ? 'Team' : 'Teams'}`}
            icon="users"
            iconColor="text-primary"
            showRing={false}
          />
          
          <HealthScoreCard
            title="Check-ins heute"
            value={todayCheckins}
            subtitle={`${checkInRate}% Check-in Rate`}
            icon="check-circle"
            iconColor="text-green-600"
            showRing={false}
          />
          
          <HealthScoreCard
            title="Aktive Warnungen"
            value={activeAlerts.length}
            subtitle={`${activeAlerts.filter(a => a.severity === 'critical').length} kritisch`}
            icon="warning"
            iconColor="text-orange-600"
            showRing={false}
          />
          
          <HealthScoreCard
            title="Team Streak"
            value={Math.max(...teamHealth.map(h => h.currentStreak), 0)}
            subtitle="Tage in Folge"
            icon="fire"
            iconColor="text-primary"
            showRing={false}
          />
        </div>

        {/* Team Filter */}
        <div className="mb-6">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="input max-w-xs"
          >
            <option value="all">Alle Teams</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.athleteIds.length} Athleten)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Athletes Overview */}
          <div className="lg:col-span-2">
            <TeamHealthOverviewComponent
              teamName={selectedTeam === 'all' ? 'Alle Teams' : teams.find(t => t.id === selectedTeam)?.name || 'Team'}
              members={filteredTeamHealth.map(health => ({
                id: health.athleteId,
                name: health.name,
                healthScore: 
                  health.healthStatus === 'excellent' ? 90 :
                  health.healthStatus === 'good' ? 75 :
                  health.healthStatus === 'concern' ? 50 : 25,
                status: health.healthStatus,
                lastCheckin: health.todayCheckin ? 'Heute' : health.lastCheckin,
                hasAlert: health.alertCount > 0,
                streak: health.currentStreak
              }))}
              onMemberClick={(memberId) => handleAthleteClick(memberId)}
            />
          </div>

          {/* Alerts */}
          <div className="lg:col-span-1">
            <AlertSummary
              alerts={activeAlerts.map(alert => ({
                id: alert.id,
                athleteName: `${athletes.find(a => a.id === alert.athleteId)?.firstName} ${athletes.find(a => a.id === alert.athleteId)?.lastName}`,
                title: alert.title,
                message: alert.message,
                severity: alert.severity,
                createdAt: formatDate(alert.createdAt)
              }))}
              onAlertClick={(alert) => handleAlertClick({ 
                ...activeAlerts.find(a => a.id === alert.id)!,
                ...alert
              })}
              onViewAll={() => router.push('/coach/alerts')}
              maxItems={5}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <CoachNav alerts={activeAlerts.length} />
    </div>
  );
}