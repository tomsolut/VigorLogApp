'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Icon, HealthIcon, RoleIcon, SportIcon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/stores/auth';

export default function Home() {
  const { user, createDemoUsers, loginAsDemo, logout } = useAuth();

  useEffect(() => {
    // Erstelle Demo-User beim ersten Laden
    createDemoUsers();
  }, [createDemoUsers]);

  const handleDemoLogin = (role: 'athlete' | 'coach' | 'parent' | 'admin') => {
    loginAsDemo(role);
  };
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Icon name="heart" className="text-red-500" size="2xl" />
            <h1 className="text-4xl font-bold text-gray-800">VigorLog</h1>
          </div>
          <p className="text-lg text-gray-600">
            Athleten-Monitoring für Jugendliche
          </p>
        </div>

        {/* Demo Login Buttons */}
        {!user && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">
                Demo-Zugang testen
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Wähle eine Rolle, um die App zu testen
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => handleDemoLogin('athlete')}
                  className="h-16 flex-col gap-2"
                  variant="outline"
                >
                  <RoleIcon role="athlete" className="text-blue-600" size="lg" />
                  <span>Als Athlet</span>
                </Button>
                <Button 
                  onClick={() => handleDemoLogin('coach')}
                  className="h-16 flex-col gap-2"
                  variant="outline"
                >
                  <RoleIcon role="coach" className="text-green-600" size="lg" />
                  <span>Als Coach</span>
                </Button>
                <Button 
                  onClick={() => handleDemoLogin('parent')}
                  className="h-16 flex-col gap-2"
                  variant="outline"
                >
                  <RoleIcon role="parent" className="text-purple-600" size="lg" />
                  <span>Als Elternteil</span>
                </Button>
                <Button 
                  onClick={() => handleDemoLogin('admin')}
                  className="h-16 flex-col gap-2"
                  variant="outline"
                >
                  <RoleIcon role="admin" className="text-orange-600" size="lg" />
                  <span>Als Admin</span>
                </Button>
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
                  <Link href={`/${user.role}`}>
                    <Button>
                      <Icon name="dashboard" className="mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={logout}>
                    <Icon name="logout" className="mr-2" />
                    Abmelden
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* GDPR Dual-Consent Demo */}
        <Card className="mb-12 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Icon name="shield" className="text-blue-600" />
              GDPR Dual-Consent System
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Registrierung für Jugendathleten unter 16 Jahren gemäß DSGVO Art. 8
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dual-consent-demo">
              <Button className="h-12 px-8">
                <Icon name="shield" className="mr-2" />
                Dual-Consent Demo starten
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* User Roles Demo */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RoleIcon role="athlete" className="text-blue-600 mb-3" size="2xl" />
            <h3 className="font-semibold text-gray-800">Athlet</h3>
            <p className="text-sm text-gray-600">Daily Check-in</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RoleIcon role="coach" className="text-green-600 mb-3" size="2xl" />
            <h3 className="font-semibold text-gray-800">Coach</h3>
            <p className="text-sm text-gray-600">Team Dashboard</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RoleIcon role="parent" className="text-purple-600 mb-3" size="2xl" />
            <h3 className="font-semibold text-gray-800">Eltern</h3>
            <p className="text-sm text-gray-600">Kind-Übersicht</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RoleIcon role="admin" className="text-orange-600 mb-3" size="2xl" />
            <h3 className="font-semibold text-gray-800">Admin</h3>
            <p className="text-sm text-gray-600">Vereinsverwaltung</p>
          </div>
        </div>

        {/* Health Metrics Demo */}
        <div className="bg-white rounded-lg p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Icon name="chart" className="text-blue-600" />
            Gesundheitsmetriken
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <HealthIcon metric="sleep" className="text-blue-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Schlaf</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <HealthIcon metric="fatigue" className="text-orange-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Müdigkeit</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <HealthIcon metric="mood" className="text-yellow-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Stimmung</p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <HealthIcon metric="pain" className="text-red-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Schmerzen</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <HealthIcon metric="heart" className="text-green-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Herz-Rate</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Icon name="chart" className="text-purple-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Trends</p>
            </div>
          </div>
        </div>

        {/* Sports Demo */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Icon name="running" className="text-green-600" />
            Unterstützte Sportarten
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="fußball" className="text-green-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Fußball</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="basketball" className="text-orange-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Basketball</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="tennis" className="text-yellow-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Tennis</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="baseball" className="text-red-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Baseball</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="football" className="text-amber-700 mb-2" size="xl" />
              <p className="text-sm font-medium">Football</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="squash" className="text-purple-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Squash</p>
            </div>
            
            <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <SportIcon sport="schwimmen" className="text-blue-600 mb-2" size="xl" />
              <p className="text-sm font-medium">Schwimmen</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}