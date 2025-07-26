'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@/components/ui/icon';
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
          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon name="users" className="text-2xl text-primary" />
              <span className="text-sm text-muted-foreground">Athleten</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{athletes.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              in {teams.length} {teams.length === 1 ? 'Team' : 'Teams'}
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon name="check-circle" className="text-2xl text-green-600" />
              <span className="text-sm text-muted-foreground">Check-ins heute</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{todayCheckins}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {checkInRate}% Check-in Rate
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon name="exclamation-triangle" className="text-2xl text-orange-600" />
              <span className="text-sm text-muted-foreground">Aktive Warnungen</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{activeAlerts.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeAlerts.filter(a => a.severity === 'critical').length} kritisch
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <Icon name="fire" className="text-2xl text-primary" />
              <span className="text-sm text-muted-foreground">Team Streak</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {Math.max(...teamHealth.map(h => h.currentStreak), 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tage in Folge
            </p>
          </div>
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
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Team Gesundheitsübersicht
              </h2>
              
              <div className="space-y-2">
                {filteredTeamHealth.map(health => (
                  <div
                    key={health.athleteId}
                    onClick={() => handleAthleteClick(health.athleteId)}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        health.healthStatus === 'excellent' ? 'bg-green-600' :
                        health.healthStatus === 'good' ? 'bg-blue-600' :
                        health.healthStatus === 'concern' ? 'bg-orange-600' :
                        'bg-red-600'
                      }`} />
                      <div>
                        <p className="font-semibold text-foreground">{health.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {health.todayCheckin ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Icon name="check" className="text-xs" />
                              Check-in heute
                            </span>
                          ) : (
                            `Letzter Check-in: ${health.lastCheckin === 'Kein Check-in' ? health.lastCheckin : formatDate(health.lastCheckin)}`
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {health.alertCount > 0 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Icon name="exclamation-triangle" className="text-sm" />
                          <span className="text-sm font-medium">{health.alertCount}</span>
                        </div>
                      )}
                      {health.currentStreak > 0 && (
                        <div className="flex items-center gap-1 text-primary">
                          <Icon name="fire" className="text-sm" />
                          <span className="text-sm font-medium">{health.currentStreak}</span>
                        </div>
                      )}
                      <Icon name="chevron-right" className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
                
                {filteredTeamHealth.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Keine Athleten im ausgewählten Team
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Aktuelle Warnungen
              </h2>
              
              <div className="space-y-3">
                {activeAlerts.slice(0, 5).map(alert => {
                  const athlete = athletes.find(a => a.id === alert.athleteId);
                  return (
                    <div
                      key={alert.id}
                      onClick={() => handleAlertClick(alert)}
                      className="p-3 rounded-lg border border-border hover:bg-accent/10 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Icon 
                          name={getAlertIcon(alert.severity)} 
                          className={`text-lg mt-0.5 ${getAlertColor(alert.severity)}`} 
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">
                            {athlete?.firstName} {athlete?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDate(alert.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {activeAlerts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Keine aktiven Warnungen
                  </p>
                )}
                
                {activeAlerts.length > 5 && (
                  <button
                    onClick={() => router.push('/coach/alerts')}
                    className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium pt-2"
                  >
                    Alle {activeAlerts.length} Warnungen anzeigen →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}