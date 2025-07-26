'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, HealthIcon, RoleIcon, SportIcon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useAuthStore } from '@/stores/auth';
import { logger } from '@/lib/logger';
import { initializeDemoData } from '@/lib/demo-data';
import { storage } from '@/lib/storage';

export default function Home() {
  const { user, createDemoUsers, loginAsDemo, logout } = useAuth();
  const router = useRouter();
  const [showAthleteChoice, setShowAthleteChoice] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Erstelle Demo-User beim ersten Laden
    createDemoUsers();
    // Initialize additional demo data after a short delay
    setTimeout(() => {
      initializeDemoData();
    }, 100);
    // Set mounted flag for portal
    setMounted(true);
  }, [createDemoUsers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.athlete-dropdown')) {
        setShowAthleteChoice(false);
      }
    };

    if (showAthleteChoice) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showAthleteChoice]);

  const handleDemoLogin = (role: 'athlete' | 'coach' | 'parent' | 'admin', specificUserId?: string) => {
    logger.info('HomePage', 'Demo login initiated', { role, specificUserId });
    
    if (specificUserId) {
      // For specific user login, don't clear localStorage
      const users = storage.getUsers();
      logger.debug('HomePage', 'Available users', { 
        count: users.length,
        userIds: users.map(u => u.id)
      });
      
      const specificUser = users.find(u => u.id === specificUserId);
      logger.debug('HomePage', 'Found specific user', { specificUser });
      
      if (specificUser) {
        logout(); // Clear current session
        useAuthStore.setState({ 
          currentUser: specificUser, 
          isAuthenticated: true,
          error: null 
        });
        logger.info('HomePage', 'User logged in, redirecting', { 
          userId: specificUser.id,
          role: specificUser.role 
        });
        router.push(`/${specificUser.role}`);
      } else {
        logger.error('HomePage', 'Specific user not found', { specificUserId });
        // Fallback to regular demo login
        loginAsDemo(role);
      }
    } else {
      // Check if demo users exist
      const users = storage.getUsers();
      if (users.length === 0) {
        // Create demo users if they don't exist
        createDemoUsers();
        setTimeout(() => {
          initializeDemoData();
          setTimeout(() => {
            loginAsDemo(role);
          }, 500);
        }, 200);
      } else {
        // Users exist, just login
        loginAsDemo(role);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/15">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Icon name="heart" className="text-primary glow-lime" size="2xl" />
            <h1 className="text-4xl font-bold text-foreground drop-shadow-lg">VigorLog</h1>
          </div>
          <p className="text-lg text-foreground font-medium">
            Athleten-Monitoring für Gen Z
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/95 backdrop-blur-sm border border-primary/30">
            <span className="text-sm text-foreground/80">Powered by GDPR-konforme Technologie</span>
          </div>
        </div>

        {/* Demo Login Buttons */}
        {!user && (
          <Card className="mb-12 bg-background/95 backdrop-blur-sm border-primary/20 overflow-visible">
            <CardHeader>
              <CardTitle className="text-center text-foreground">
                Demo-Zugang testen
              </CardTitle>
              <p className="text-center text-foreground/80">
                Wähle eine Rolle, um die App zu testen
              </p>
            </CardHeader>
            <CardContent className="overflow-visible">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative athlete-dropdown">
                  <button 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setButtonRect(rect);
                      setShowAthleteChoice(!showAthleteChoice);
                    }}
                    className="h-16 w-full flex flex-col items-center justify-center gap-2 rounded-lg bg-background/50 border border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 glow-lime group focus-visible:ring-2 focus-visible:ring-primary touch-target"
                    aria-label="Als Athlet anmelden - Demo-Zugang"
                  >
                    <RoleIcon role="athlete" className="text-primary group-hover:scale-110 transition-transform" size="lg" />
                    <span className="text-foreground font-medium text-sm">Als Athlet</span>
                  </button>
                  {mounted && showAthleteChoice && buttonRect && createPortal(
                    <div 
                      className="fixed bg-background border-2 border-primary rounded-lg shadow-2xl z-[9999] min-w-[250px]"
                      style={{
                        top: `${buttonRect.bottom + 8}px`,
                        left: `${buttonRect.left}px`,
                        width: `${buttonRect.width}px`
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowAthleteChoice(false);
                          handleDemoLogin('athlete', 'demo-athlete-1');
                        }}
                        className="w-full p-3 text-left hover:bg-primary/10 transition-colors"
                      >
                        <p className="font-medium text-foreground">Max Mustermann</p>
                        <p className="text-xs text-muted-foreground"><Icon name="check" className="inline mr-1" size="xs" />Check-in bereits durchgeführt</p>
                      </button>
                      <button
                        onClick={() => {
                          setShowAthleteChoice(false);
                          handleDemoLogin('athlete', 'demo-athlete-2');
                        }}
                        className="w-full p-3 text-left hover:bg-primary/10 transition-colors border-t border-border"
                      >
                        <p className="font-medium text-foreground">Sophie Müller</p>
                        <p className="text-xs text-muted-foreground"><Icon name="triangle-exclamation" className="inline mr-1 text-orange-500" size="xs" />Check-in noch ausstehend</p>
                      </button>
                    </div>,
                    document.body
                  )}
                </div>
                <button 
                  onClick={() => handleDemoLogin('coach')}
                  className="h-16 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/50 border border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 glow-blue group focus-visible:ring-2 focus-visible:ring-accent touch-target"
                  aria-label="Als Coach anmelden - Demo-Zugang"
                >
                  <RoleIcon role="coach" className="text-accent group-hover:scale-110 transition-transform" size="lg" />
                  <span className="text-foreground font-medium text-sm">Als Coach</span>
                </button>
                <button 
                  onClick={() => handleDemoLogin('parent')}
                  className="h-16 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/50 border border-purple-300/30 hover:bg-purple-300/10 hover:border-purple-300/50 transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-purple-300 touch-target"
                  aria-label="Als Elternteil anmelden - Demo-Zugang"
                >
                  <RoleIcon role="parent" className="text-purple-300 group-hover:scale-110 transition-transform" size="lg" />
                  <span className="text-foreground font-medium text-sm">Als Elternteil</span>
                </button>
                <button 
                  onClick={() => handleDemoLogin('admin')}
                  className="h-16 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/50 border border-orange-300/30 hover:bg-orange-300/10 hover:border-orange-300/50 transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-orange-300 touch-target"
                  aria-label="Als Administrator anmelden - Demo-Zugang"
                >
                  <RoleIcon role="admin" className="text-orange-300 group-hover:scale-110 transition-transform" size="lg" />
                  <span className="text-foreground font-medium text-sm">Als Admin</span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current User Info */}
        {user && (
          <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RoleIcon role={user.role} className="text-green-600" size="lg" />
                  <div>
                    <h3 className="font-semibold">
                      Angemeldet als {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.role === 'athlete' ? 'Athlet' : 
                       user.role === 'coach' ? 'Coach' :
                       user.role === 'parent' ? 'Elternteil' : 'Administrator'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Dashboard button clicked, navigating to:', `/${user.role}`);
                      console.log('Current auth state:', { 
                        isAuthenticated: useAuthStore.getState().isAuthenticated,
                        user: useAuthStore.getState().currentUser 
                      });
                      router.push(`/${user.role}`);
                    }}
                  >
                    <Icon name="dashboard" className="mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      logout();
                    }}
                  >
                    <Icon name="logout" className="mr-2" />
                    Abmelden
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Roles Demo */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="rounded-lg p-6 text-center border border-primary/20 hover:border-primary/40 transition-all group">
            <RoleIcon role="athlete" className="text-primary mb-3 group-hover:scale-110 transition-transform glow-lime" size="2xl" />
            <h3 className="font-semibold text-foreground mb-1">Athlet</h3>
            <p className="text-sm text-foreground/70"><Icon name="bolt" className="inline mr-1" size="xs" />Daily Check-in</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
              Gen Z Focus
            </div>
          </div>
          
          <div className="rounded-lg p-6 text-center border border-accent/20 hover:border-accent/40 transition-all group">
            <RoleIcon role="coach" className="text-accent mb-3 group-hover:scale-110 transition-transform glow-blue" size="2xl" />
            <h3 className="font-semibold text-foreground mb-1">Coach</h3>
            <p className="text-sm text-foreground/70"><Icon name="chart" className="inline mr-1" size="xs" />Team Dashboard</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
              AI-Powered
            </div>
          </div>
          
          <div className="rounded-lg p-6 text-center border border-purple-300/20 hover:border-purple-300/40 transition-all group">
            <RoleIcon role="parent" className="text-purple-300 mb-3 group-hover:scale-110 transition-transform" size="2xl" />
            <h3 className="font-semibold text-foreground mb-1">Eltern</h3>
            <p className="text-sm text-foreground/70"><Icon name="users" className="inline mr-1" size="xs" />Kind-Übersicht</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-purple-300/20 text-purple-300 text-xs font-medium">
              GDPR-Safe
            </div>
          </div>
          
          <div className="rounded-lg p-6 text-center border border-orange-300/20 hover:border-orange-300/40 transition-all group">
            <RoleIcon role="admin" className="text-orange-300 mb-3 group-hover:scale-110 transition-transform" size="2xl" />
            <h3 className="font-semibold text-foreground mb-1">Admin</h3>
            <p className="text-sm text-foreground/70"><Icon name="cog" className="inline mr-1" size="xs" />Vereinsverwaltung</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-orange-300/20 text-orange-300 text-xs font-medium">
              Analytics
            </div>
          </div>
        </div>

        {/* Health Metrics Demo */}
        <Card className="mb-12 bg-background/95 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Icon name="chart" className="text-primary glow-lime" />
              Gesundheitsmetriken
            </CardTitle>
            <p className="text-foreground/80">Alle wichtigen Gesundheitsdaten auf einen Blick</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 border rounded-lg border-chart-1/30 group hover:border-chart-1/50 transition-all">
                <HealthIcon metric="sleep" className="text-chart-1 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Schlaf</p>
                <div className="mt-2 h-1 bg-chart-1/30 rounded-full">
                  <div className="h-full w-4/5 bg-chart-1 rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-chart-2/30 group hover:border-chart-2/50 transition-all">
                <HealthIcon metric="fatigue" className="text-chart-2 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Müdigkeit</p>
                <div className="mt-2 h-1 bg-chart-2/30 rounded-full">
                  <div className="h-full w-2/5 bg-chart-2 rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-chart-4/30 group hover:border-chart-4/50 transition-all">
                <HealthIcon metric="mood" className="text-chart-4 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Stimmung</p>
                <div className="mt-2 h-1 bg-chart-4/30 rounded-full">
                  <div className="h-full w-full bg-chart-4 rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-chart-5/30 group hover:border-chart-5/50 transition-all">
                <HealthIcon metric="pain" className="text-chart-5 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Schmerzen</p>
                <div className="mt-2 h-1 bg-chart-5/30 rounded-full">
                  <div className="h-full w-1/5 bg-chart-5 rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-primary/30 group hover:border-primary/50 transition-all">
                <HealthIcon metric="heart" className="text-primary mb-2 group-hover:scale-110 transition-transform glow-lime" size="xl" />
                <p className="text-sm font-medium text-foreground">Herz-Rate</p>
                <div className="mt-2 h-1 bg-primary/30 rounded-full">
                  <div className="h-full w-3/5 bg-primary rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-chart-3/30 group hover:border-chart-3/50 transition-all">
                <Icon name="chart" className="text-chart-3 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Trends</p>
                <div className="mt-2 h-1 bg-chart-3/30 rounded-full">
                  <div className="h-full w-4/5 bg-chart-3 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-foreground/60">Real-time Monitoring • AI-gestützte Insights • Gen Z optimiert</p>
            </div>
          </CardContent>
        </Card>

        {/* Sports Demo */}
        <Card className="mb-12 bg-background/95 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Icon name="running" className="text-primary glow-lime" />
              Unterstützte Sportarten
            </CardTitle>
            <p className="text-foreground/80">Speziell optimiert für Jugendathleten verschiedener Disziplinen</p>
          </CardHeader>
          <CardContent>
          
            <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-4">
              <div className="text-center p-4 border rounded-lg border-primary/20 hover:border-primary/40 transition-all group">
                <SportIcon sport="fußball" className="text-primary mb-2 group-hover:scale-110 transition-transform glow-lime" size="xl" />
                <p className="text-sm font-medium text-foreground">Fußball</p>
                <div className="mt-2 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                  #1 Sport
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-chart-2/20 hover:border-chart-2/40 transition-all group">
                <SportIcon sport="basketball" className="text-chart-2 mb-2 group-hover:scale-110 transition-transform glow-blue" size="xl" />
                <p className="text-sm font-medium text-foreground">Basketball</p>
                <div className="mt-2 px-2 py-1 rounded-full bg-chart-2/20 text-chart-2 text-xs">
                  Gen Z
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-chart-4/20 hover:border-chart-4/40 transition-all group">
                <SportIcon sport="tennis" className="text-chart-4 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Tennis</p>
                <div className="mt-2 px-2 py-1 rounded-full bg-chart-4/20 text-chart-4 text-xs">
                  Präzision
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-chart-5/20 hover:border-chart-5/40 transition-all group">
                <SportIcon sport="baseball" className="text-chart-5 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Baseball</p>
                <div className="mt-2 px-2 py-1 rounded-full bg-chart-5/20 text-chart-5 text-xs">
                  USA Style
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-orange-300/20 hover:border-orange-300/40 transition-all group">
                <SportIcon sport="football" className="text-orange-300 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Football</p>
                <div className="mt-2 px-2 py-1 rounded-full bg-orange-300/20 text-orange-300 text-xs">
                  Power
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-chart-3/20 hover:border-chart-3/40 transition-all group">
                <SportIcon sport="squash" className="text-chart-3 mb-2 group-hover:scale-110 transition-transform" size="xl" />
                <p className="text-sm font-medium text-foreground">Squash</p>
                <div className="mt-2 px-2 py-1 rounded-full bg-chart-3/20 text-chart-3 text-xs">
                  Speed
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg border-accent/20 hover:border-accent/40 transition-all group">
                <SportIcon sport="schwimmen" className="text-accent mb-2 group-hover:scale-110 transition-transform glow-blue" size="xl" />
                <p className="text-sm font-medium text-foreground">Schwimmen</p>
                <div className="mt-2 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs">
                  Ausdauer
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-foreground/80 mb-4">Über 50+ Sportarten unterstützt • Speziell für Gen Z entwickelt</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  <Icon name="fire" className="inline mr-1" size="xs" />Trending
                </span>
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                  <Icon name="bolt" className="inline mr-1" size="xs" />Fast Setup
                </span>
                <span className="px-3 py-1 rounded-full bg-chart-3/20 text-chart-3 text-sm font-medium">
                  <Icon name="target" className="inline mr-1" size="xs" />Performance Focus
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GDPR Dual-Consent Demo */}
        <Card className="bg-background/95 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2 text-foreground">
              <Icon name="shield" className="text-primary glow-lime" />
              GDPR Dual-Consent System
            </CardTitle>
            <p className="text-center text-foreground/80">
              Registrierung für Jugendathleten unter 16 Jahren gemäß DSGVO Art. 8
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dual-consent-demo">
              <button className="btn-cyber">
                <Icon name="shield" className="mr-2" />
                Dual-Consent Demo starten
              </button>
            </Link>
            <p className="text-xs text-foreground/60 mt-2">Vollständig GDPR-konform • Keine Cookies erforderlich</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}