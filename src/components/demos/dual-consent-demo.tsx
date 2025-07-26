'use client';

// VigorLog - Dual-Consent Demo
// Demonstriert das GDPR-konforme Registrierungssystem für Minderjährige

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { DualConsentForm } from '@/components/forms/dual-consent-form';
import { useAuth } from '@/stores/auth';
import { calculateAge, getAgeGroupLabel } from '@/lib/dual-consent';
import type { MinorRegistrationData } from '@/types';

export function DualConsentDemo() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [lastRegistration, setLastRegistration] = useState<MinorRegistrationData | null>(null);
  const { registerMinor, isLoading, error } = useAuth();

  const handleRegistrationSuccess = async (data: MinorRegistrationData) => {
    const success = await registerMinor(data);
    
    if (success) {
      setRegistrationSuccess(true);
      setLastRegistration(data);
      setShowRegistration(false);
    }
  };

  const demoScenarios = [
    {
      title: 'U16-Athlet (14 Jahre)',
      description: 'Benötigt Dual-Consent gemäß GDPR Art. 8',
      age: 14,
      needsConsent: true,
      birthDate: '2010-06-15',
      sport: 'Fußball',
      compliance: 'GDPR Art. 8 - Parental Consent erforderlich'
    },
    {
      title: 'Ü16-Athlet (17 Jahre)', 
      description: 'Standard-Registrierung ohne Parental Consent',
      age: 17,
      needsConsent: false,
      birthDate: '2007-03-20',
      sport: 'Basketball',
      compliance: 'GDPR Art. 6 - Standard-Einverständnis'
    },
    {
      title: 'Grenzfall (16 Jahre)',
      description: 'Genau 16 Jahre alt - keine Parental Consent nötig',
      age: 16,
      needsConsent: false,
      birthDate: '2008-01-01',
      sport: 'Tennis',
      compliance: 'GDPR Art. 6 - Standard-Einverständnis (ab 16)'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Icon name="shield" className="text-blue-500" size="2xl" />
            <CardTitle className="text-2xl">Dual-Consent System</CardTitle>
          </div>
          <CardDescription>
            GDPR-konforme Registrierung für Jugendathleten unter 16 Jahren
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Legal Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Icon name="info" className="text-blue-600" />
            Rechtliche Grundlagen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">GDPR Art. 8 - Schutz von Kindern</h4>
              <p className="text-sm">
                Kinder unter 16 Jahren benötigen die Einverständniserklärung 
                ihrer Erziehungsberechtigten für die Verarbeitung personenbezogener Daten.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Deutsche Umsetzung</h4>
              <p className="text-sm">
                Das deutsche Bundesdatenschutzgesetz (BDSG) setzt die 
                Altersgrenze bei 16 Jahren fest (§ 8 BDSG).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demoScenarios.map((scenario, index) => (
          <Card 
            key={index} 
            className={`${scenario.needsConsent ? 'border-orange-200' : 'border-green-200'}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{scenario.title}</CardTitle>
                <Badge variant={scenario.needsConsent ? 'destructive' : 'default'}>
                  {scenario.needsConsent ? 'Dual-Consent' : 'Standard'}
                </Badge>
              </div>
              <CardDescription>{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Alter:</span>
                  <span className="font-medium">{scenario.age} Jahre</span>
                </div>
                <div className="flex justify-between">
                  <span>Altersgruppe:</span>
                  <span className="font-medium">{getAgeGroupLabel(scenario.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sport:</span>
                  <span className="font-medium">{scenario.sport}</span>
                </div>
              </div>
              
              <Alert className={`${scenario.needsConsent ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}>
                <AlertDescription className={`text-xs ${scenario.needsConsent ? 'text-orange-800' : 'text-green-800'}`}>
                  <strong>Compliance:</strong> {scenario.compliance}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registration Success */}
      {registrationSuccess && lastRegistration && (
        <Alert className="border-green-500 bg-green-50">
          <Icon name="check" className="h-4 w-4" />
          <AlertDescription className="text-green-800">
            <strong>Registrierung erfolgreich!</strong> 
            <br />
            Athlet: {lastRegistration.athlete.firstName} {lastRegistration.athlete.lastName} 
            ({calculateAge(lastRegistration.athlete.birthDate)} Jahre)
            <br />
            Erziehungsberechtigte(r): {lastRegistration.parent.firstName} {lastRegistration.parent.lastName}
            <br />
            Alle erforderlichen GDPR-Einverständniserklärungen wurden erteilt.
          </AlertDescription>
        </Alert>
      )}

      {/* Registration Form */}
      {showRegistration ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">GDPR-konforme Registrierung</h3>
            <Button
              variant="outline"
              onClick={() => setShowRegistration(false)}
            >
              <Icon name="cancel" className="mr-2" />
              Abbrechen
            </Button>
          </div>
          
          <DualConsentForm
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegistration(false)}
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Demo starten</CardTitle>
            <CardDescription>
              Testen Sie das Dual-Consent-System für verschiedene Altersgruppen
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => {
                setShowRegistration(true);
                setRegistrationSuccess(false);
              }}
              disabled={isLoading}
              className="h-12 px-8"
            >
              <Icon name="shield" className="mr-2" />
              Dual-Consent Registrierung starten
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <Icon name="error" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Implementation Notes */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="code" className="text-gray-600" />
            Implementation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Features implementiert:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✅ Altersberechnung basierend auf Geburtsdatum</li>
                <li>✅ Automatische Dual-Consent-Erkennung für &lt;16 Jahre</li>
                <li>✅ Parent-Child Account-Verknüpfung</li>
                <li>✅ GDPR-konforme Consent-Texte</li>
                <li>✅ Multi-Step Registrierungsformular</li>
                <li>✅ Validation mit Zod Schema</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Nächste Schritte:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>🔄 E-Mail-Benachrichtigungen für Parents</li>
                <li>🔄 Consent-Widerruf Mechanismus</li>
                <li>🔄 Dokumentation der Consent-Historie</li>
                <li>🔄 Admin-Dashboard für Compliance-Monitoring</li>
                <li>🔄 Export von Consent-Records für Audits</li>
                <li>🔄 Integration mit E-Mail-Service (SendGrid/Resend)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DualConsentDemo;