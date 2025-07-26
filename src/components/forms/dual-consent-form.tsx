'use client';

// VigorLog - Dual-Consent Form für GDPR Art. 8 Compliance
// Registrierung von Athleten unter 16 Jahren mit Parental Consent

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@/components/ui/icon';
import { 
  calculateAge, 
  needsParentalConsent, 
  validateMinorRegistration,
  generateConsentText,
  getAgeGroupLabel
} from '@/lib/dual-consent';
import type { MinorRegistrationData } from '@/types';

// Validation Schema für Minderjährigen-Registrierung
const DualConsentSchema = z.object({
  // Athlet Daten
  athleteFirstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen haben'),
  athleteLastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  athleteEmail: z.string().email('Gültige E-Mail-Adresse erforderlich'),
  athleteBirthDate: z.string().min(1, 'Geburtsdatum ist erforderlich'),
  athleteSport: z.string().min(2, 'Sportart ist erforderlich'),
  
  // Parent Daten (conditional)
  parentFirstName: z.string().min(2, 'Vorname des Erziehungsberechtigten erforderlich'),
  parentLastName: z.string().min(2, 'Nachname des Erziehungsberechtigten erforderlich'),
  parentEmail: z.string().email('Gültige E-Mail des Erziehungsberechtigten erforderlich'),
  parentPhone: z.string().optional(),
  
  // GDPR Consents
  consentDataProcessing: z.boolean().refine(val => val === true, {
    message: 'Einverständnis zur Datenverarbeitung ist erforderlich'
  }),
  consentMedicalData: z.boolean().refine(val => val === true, {
    message: 'Einverständnis zur Verarbeitung von Gesundheitsdaten ist erforderlich'
  }),
  consentParentAccess: z.boolean().refine(val => val === true, {
    message: 'Einverständnis zum Elternzugang ist erforderlich'
  }),
  
  // Bestätigungen
  acknowledgeMinorRights: z.boolean().refine(val => val === true, {
    message: 'Bestätigung der Rechte Minderjähriger erforderlich'
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'Zustimmung zu AGB und Datenschutz erforderlich'
  })
});

type DualConsentFormData = z.infer<typeof DualConsentSchema>;

interface DualConsentFormProps {
  onSuccess?: (data: MinorRegistrationData) => void;
  onCancel?: () => void;
}

export function DualConsentForm({ onSuccess, onCancel }: DualConsentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConsentTexts, setShowConsentTexts] = useState(false);

  const form = useForm<DualConsentFormData>({
    resolver: zodResolver(DualConsentSchema),
    defaultValues: {
      athleteFirstName: '',
      athleteLastName: '',
      athleteEmail: '',
      athleteBirthDate: '',
      athleteSport: 'Fußball',
      parentFirstName: '',
      parentLastName: '',
      parentEmail: '',
      parentPhone: '',
      consentDataProcessing: false,
      consentMedicalData: false,
      consentParentAccess: false,
      acknowledgeMinorRights: false,
      agreeToTerms: false
    }
  });

  const watchedBirthDate = form.watch('athleteBirthDate');
  const watchedAthleteName = `${form.watch('athleteFirstName')} ${form.watch('athleteLastName')}`.trim();
  
  const age = watchedBirthDate ? calculateAge(watchedBirthDate) : null;
  const needsConsent = age !== null && needsParentalConsent(watchedBirthDate);

  const onSubmit = async (data: DualConsentFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Transformiere Form-Daten zu MinorRegistrationData
      const registrationData: MinorRegistrationData = {
        athlete: {
          firstName: data.athleteFirstName,
          lastName: data.athleteLastName,
          email: data.athleteEmail,
          birthDate: data.athleteBirthDate,
          sport: data.athleteSport
        },
        parent: {
          firstName: data.parentFirstName,
          lastName: data.parentLastName,
          email: data.parentEmail,
          phoneNumber: data.parentPhone
        },
        consents: {
          dataProcessing: data.consentDataProcessing,
          medicalData: data.consentMedicalData,
          parentAccess: data.consentParentAccess
        }
      };

      // Validiere Registrierungsdaten
      const validation = validateMinorRegistration(registrationData);
      if (!validation.valid) {
        setSubmitError(`Validierungsfehler: ${validation.errors.join(', ')}`);
        return;
      }

      // Erfolgreiche Registrierung
      onSuccess?.(registrationData);

    } catch (error) {
      console.error('Dual-Consent registration error:', error);
      setSubmitError('Fehler bei der Registrierung. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: 'Athleten-Daten', description: 'Grunddaten des Athleten' },
    { title: 'Erziehungsberechtigte', description: 'Daten der Eltern/Erziehungsberechtigten' },
    { title: 'GDPR Einverständnis', description: 'Erforderliche Einverständniserklärungen' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Icon name="shield" className="text-blue-500" size="2xl" />
            <CardTitle className="text-2xl">GDPR-konforme Registrierung</CardTitle>
          </div>
          <CardDescription>
            Registrierung für Athleten unter 16 Jahren mit Parental Consent
          </CardDescription>
          {age !== null && (
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant={needsConsent ? 'destructive' : 'default'}>
                {needsConsent ? 'Dual-Consent erforderlich' : 'Standard-Registrierung'}
              </Badge>
              {age !== null && (
                <Badge variant="outline">
                  {getAgeGroupLabel(watchedBirthDate)}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <div className="flex justify-between items-center px-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-muted-foreground">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Athleten-Daten */}
        {currentStep >= 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="user" className="text-blue-600" />
                Athleten-Daten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="athleteFirstName">Vorname *</Label>
                  <Input
                    id="athleteFirstName"
                    {...form.register('athleteFirstName')}
                    placeholder="Max"
                  />
                  {form.formState.errors.athleteFirstName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.athleteFirstName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="athleteLastName">Nachname *</Label>
                  <Input
                    id="athleteLastName"
                    {...form.register('athleteLastName')}
                    placeholder="Mustermann"
                  />
                  {form.formState.errors.athleteLastName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.athleteLastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="athleteEmail">E-Mail-Adresse *</Label>
                <Input
                  id="athleteEmail"
                  type="email"
                  {...form.register('athleteEmail')}
                  placeholder="max.mustermann@email.com"
                />
                {form.formState.errors.athleteEmail && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.athleteEmail.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="athleteBirthDate">Geburtsdatum *</Label>
                  <Input
                    id="athleteBirthDate"
                    type="date"
                    {...form.register('athleteBirthDate')}
                  />
                  {form.formState.errors.athleteBirthDate && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.athleteBirthDate.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="athleteSport">Sportart *</Label>
                  <Input
                    id="athleteSport"
                    {...form.register('athleteSport')}
                    placeholder="Fußball"
                  />
                  {form.formState.errors.athleteSport && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.athleteSport.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Alters-Info */}
              {age !== null && (
                <Alert className={needsConsent ? 'border-orange-500 bg-orange-50' : 'border-green-500 bg-green-50'}>
                  <Icon name={needsConsent ? 'warning' : 'check'} className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Alter: {age} Jahre</strong> - {getAgeGroupLabel(watchedBirthDate)}
                    {needsConsent ? (
                      <span className="block mt-1 text-orange-700">
                        Gemäß DSGVO Art. 8 ist für Nutzer unter 16 Jahren eine Einverständniserklärung 
                        der Erziehungsberechtigten erforderlich.
                      </span>
                    ) : (
                      <span className="block mt-1 text-green-700">
                        Standard-Registrierung möglich. Kein Parental Consent erforderlich.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Parent Daten (nur bei needsConsent) */}
        {currentStep >= 1 && needsConsent && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="parent" className="text-purple-600" />
                Erziehungsberechtigte
              </CardTitle>
              <CardDescription>
                Angaben zu den Erziehungsberechtigten für das Dual-Consent-Verfahren
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentFirstName">Vorname *</Label>
                  <Input
                    id="parentFirstName"
                    {...form.register('parentFirstName')}
                    placeholder="Maria"
                  />
                  {form.formState.errors.parentFirstName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.parentFirstName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="parentLastName">Nachname *</Label>
                  <Input
                    id="parentLastName"
                    {...form.register('parentLastName')}
                    placeholder="Mustermann"
                  />
                  {form.formState.errors.parentLastName && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.parentLastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="parentEmail">E-Mail-Adresse *</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  {...form.register('parentEmail')}
                  placeholder="maria.mustermann@email.com"
                />
                {form.formState.errors.parentEmail && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.parentEmail.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="parentPhone">Telefon (optional)</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  {...form.register('parentPhone')}
                  placeholder="+49 123 456789"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: GDPR Consents */}
        {currentStep >= 2 && needsConsent && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="shield" className="text-green-600" />
                GDPR Einverständniserklärungen
              </CardTitle>
              <CardDescription>
                Erforderliche Einverständniserklärungen gemäß DSGVO Art. 8
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Consent Toggle */}
              <div className="flex items-center justify-between">
                <Label>Vollständige Einverständnistexte anzeigen</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConsentTexts(!showConsentTexts)}
                >
                  <Icon name={showConsentTexts ? 'eye-off' : 'eye'} className="w-4 h-4 mr-2" />
                  {showConsentTexts ? 'Verbergen' : 'Anzeigen'}
                </Button>
              </div>

              {/* Data Processing Consent */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentDataProcessing"
                    checked={form.watch('consentDataProcessing')}
                    onCheckedChange={(checked) => 
                      form.setValue('consentDataProcessing', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="consentDataProcessing" className="font-medium">
                      Einverständnis zur Datenverarbeitung *
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verarbeitung personenbezogener Daten für {watchedAthleteName || 'den Athleten'} 
                      ({age} Jahre) im VigorLog-System.
                    </p>
                  </div>
                </div>
                {showConsentTexts && (
                  <div className="ml-6 p-3 bg-gray-50 rounded-md text-xs">
                    {generateConsentText('data_processing', watchedAthleteName, age || 0)}
                  </div>
                )}
                {form.formState.errors.consentDataProcessing && (
                  <p className="text-sm text-red-600 ml-6">
                    {form.formState.errors.consentDataProcessing.message}
                  </p>
                )}
              </div>

              {/* Medical Data Consent */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentMedicalData"
                    checked={form.watch('consentMedicalData')}
                    onCheckedChange={(checked) => 
                      form.setValue('consentMedicalData', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="consentMedicalData" className="font-medium">
                      Einverständnis zur Verarbeitung von Gesundheitsdaten *
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verarbeitung besonderer Kategorien personenbezogener Daten (Art. 9 DSGVO) 
                      für medizinische Überwachung.
                    </p>
                  </div>
                </div>
                {showConsentTexts && (
                  <div className="ml-6 p-3 bg-gray-50 rounded-md text-xs">
                    {generateConsentText('medical_data', watchedAthleteName, age || 0)}
                  </div>
                )}
                {form.formState.errors.consentMedicalData && (
                  <p className="text-sm text-red-600 ml-6">
                    {form.formState.errors.consentMedicalData.message}
                  </p>
                )}
              </div>

              {/* Parent Access Consent */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consentParentAccess"
                    checked={form.watch('consentParentAccess')}
                    onCheckedChange={(checked) => 
                      form.setValue('consentParentAccess', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="consentParentAccess" className="font-medium">
                      Einverständnis zum Elternzugang *
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Zugang der Erziehungsberechtigten zu den Gesundheitsdaten zur 
                      Erfüllung der Aufsichtspflicht.
                    </p>
                  </div>
                </div>
                {showConsentTexts && (
                  <div className="ml-6 p-3 bg-gray-50 rounded-md text-xs">
                    {generateConsentText('parent_access', watchedAthleteName, age || 0)}
                  </div>
                )}
                {form.formState.errors.consentParentAccess && (
                  <p className="text-sm text-red-600 ml-6">
                    {form.formState.errors.consentParentAccess.message}
                  </p>
                )}
              </div>

              {/* Additional Confirmations */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acknowledgeMinorRights"
                    checked={form.watch('acknowledgeMinorRights')}
                    onCheckedChange={(checked) => 
                      form.setValue('acknowledgeMinorRights', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="acknowledgeMinorRights" className="font-medium">
                      Bestätigung der Rechte Minderjähriger *
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ich bestätige, dass ich über die besonderen Rechte von Minderjährigen 
                      gemäß DSGVO informiert bin und diese Einverständniserklärung im Namen 
                      des Kindes abgebe.
                    </p>
                  </div>
                </div>
                {form.formState.errors.acknowledgeMinorRights && (
                  <p className="text-sm text-red-600 ml-6">
                    {form.formState.errors.acknowledgeMinorRights.message}
                  </p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={form.watch('agreeToTerms')}
                    onCheckedChange={(checked) => 
                      form.setValue('agreeToTerms', checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="agreeToTerms" className="font-medium">
                      AGB und Datenschutzerklärung *
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ich stimme den Allgemeinen Geschäftsbedingungen und der 
                      Datenschutzerklärung zu.
                    </p>
                  </div>
                </div>
                {form.formState.errors.agreeToTerms && (
                  <p className="text-sm text-red-600 ml-6">
                    {form.formState.errors.agreeToTerms.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {submitError && (
          <Alert variant="destructive">
            <Icon name="error" className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={isSubmitting}
            >
              <Icon name="arrow-left" className="mr-2" />
              Zurück
            </Button>
          )}
          
          {currentStep < 2 && (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={isSubmitting || !watchedBirthDate}
              className="flex-1"
            >
              Weiter
              <Icon name="arrow-right" className="ml-2" />
            </Button>
          )}
          
          {currentStep === 2 && needsConsent && (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 text-base"
            >
              {isSubmitting ? (
                <>
                  <Icon name="loading" className="mr-2 animate-spin" />
                  Registriere...
                </>
              ) : (
                <>
                  <Icon name="shield" className="mr-2" />
                  GDPR-konforme Registrierung abschließen
                </>
              )}
            </Button>
          )}
          
          {!needsConsent && age !== null && (
            <Alert className="border-green-500 bg-green-50">
              <Icon name="check" className="h-4 w-4" />
              <AlertDescription>
                <strong>Standard-Registrierung:</strong> Da der Athlet 16 Jahre oder älter ist, 
                ist kein Parental Consent erforderlich. Sie können die normale Registrierung verwenden.
              </AlertDescription>
            </Alert>
          )}
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <Icon name="cancel" className="mr-2" />
              Abbrechen
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default DualConsentForm;