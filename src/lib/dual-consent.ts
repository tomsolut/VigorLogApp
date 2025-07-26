// VigorLog - Dual-Consent System für GDPR Compliance
// Artikel 8 DSGVO: Schutz von Kindern unter 16 Jahren

import type { 
  Athlete, 
  Parent, 
  ConsentRecord, 
  DualConsentRequest,
  MinorRegistrationData,
  User 
} from '@/types';
import { generateId } from '@/lib/utils';

/**
 * Berechnet das aktuelle Alter basierend auf Geburtsdatum
 */
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Prüft ob ein Athlet parental consent benötigt (unter 16 Jahre)
 */
export function needsParentalConsent(birthDate: string): boolean {
  const age = calculateAge(birthDate);
  return age < 16;
}

/**
 * GDPR Art. 8 Compliance Check für deutsche Rechtslage
 */
export function isGdprCompliantForMinor(athlete: Athlete, parent?: Parent): {
  compliant: boolean;
  reason?: string;
  requiredActions: string[];
} {
  const age = calculateAge(athlete.birthDate);
  
  // Über 16: Kein parental consent nötig
  if (age >= 16) {
    return {
      compliant: true,
      requiredActions: []
    };
  }

  // Unter 16: Dual-Consent erforderlich
  const requiredActions: string[] = [];
  
  if (!athlete.needsParentalConsent) {
    requiredActions.push('Flag needsParentalConsent setzen');
  }
  
  if (!athlete.hasParentalConsent) {
    requiredActions.push('Parental consent einholen');
  }
  
  if (!parent) {
    requiredActions.push('Parent-Account verknüpfen');
  }
  
  if (parent && !parent.hasDataConsent) {
    requiredActions.push('Parent data consent einholen');
  }
  
  if (parent && !parent.hasMedicalConsent) {
    requiredActions.push('Parent medical consent einholen');
  }

  const compliant = requiredActions.length === 0;
  
  return {
    compliant,
    reason: compliant ? undefined : `GDPR Art. 8: Nutzer unter 16 Jahre benötigt Dual-Consent`,
    requiredActions
  };
}

/**
 * Erstellt Consent Record für Dual-Consent Flow
 */
export function createDualConsentRecord(
  athleteId: string,
  parentId: string,
  consentType: ConsentRecord['consentType'],
  granted: boolean = true
): ConsentRecord {
  const athlete = getAthleteFromStorage(athleteId);
  const age = athlete ? calculateAge(athlete.birthDate) : 16;
  
  return {
    id: generateId(),
    userId: athleteId,
    parentId,
    consentType,
    granted,
    grantedAt: new Date().toISOString(),
    version: '1.0.0',
    isForMinor: true,
    minorAge: age,
    legalBasisGermany: age < 16 ? 'art8_gdpr_parental_consent' : 'art6_1a_gdpr',
    documentationUrl: `/legal/gdpr-consent-${consentType}-v1.0.0.pdf`
  };
}

/**
 * Validiert Registrierungsdaten für Minderjährige
 */
export function validateMinorRegistration(data: MinorRegistrationData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Athlet validieren
  if (!data.athlete.firstName?.trim()) {
    errors.push('Vorname des Athleten ist erforderlich');
  }
  
  if (!data.athlete.lastName?.trim()) {
    errors.push('Nachname des Athleten ist erforderlich');
  }
  
  if (!data.athlete.email?.includes('@')) {
    errors.push('Gültige E-Mail des Athleten ist erforderlich');
  }
  
  if (!data.athlete.birthDate) {
    errors.push('Geburtsdatum ist erforderlich');
  } else {
    const age = calculateAge(data.athlete.birthDate);
    if (age < 12) {
      errors.push('Athleten müssen mindestens 12 Jahre alt sein');
    }
    if (age >= 18) {
      errors.push('Für Erwachsene ist kein parental consent erforderlich');
    }
  }
  
  // Parent validieren (nur für <16 Jahre)
  if (data.athlete.birthDate && calculateAge(data.athlete.birthDate) < 16) {
    if (!data.parent.firstName?.trim()) {
      errors.push('Vorname des Erziehungsberechtigten ist erforderlich');
    }
    
    if (!data.parent.lastName?.trim()) {
      errors.push('Nachname des Erziehungsberechtigten ist erforderlich');
    }
    
    if (!data.parent.email?.includes('@')) {
      errors.push('Gültige E-Mail des Erziehungsberechtigten ist erforderlich');
    }
    
    // Consent validieren
    if (!data.consents.dataProcessing) {
      errors.push('Einverständnis zur Datenverarbeitung ist erforderlich');
    }
    
    if (!data.consents.medicalData) {
      errors.push('Einverständnis zur Verarbeitung von Gesundheitsdaten ist erforderlich');
    }
    
    if (!data.consents.parentAccess) {
      errors.push('Einverständnis zum Elternzugang ist erforderlich');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Erstellt Dual-Consent Request für ausstehende Genehmigungen
 */
export function createDualConsentRequest(
  athleteId: string,
  parentId: string,
  consentTypes: string[]
): DualConsentRequest {
  return {
    id: generateId(),
    athleteId,
    parentId,
    requestedAt: new Date().toISOString(),
    status: 'pending',
    consentTypes,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 Tage
    notificationsSent: 0
  };
}

/**
 * Prüft ob Dual-Consent Request abgelaufen ist
 */
export function isDualConsentRequestExpired(request: DualConsentRequest): boolean {
  return new Date(request.expiresAt) < new Date();
}

/**
 * Generiert benutzerfreundliche Altersgruppen-Labels
 */
export function getAgeGroupLabel(birthDate: string): string {
  const age = calculateAge(birthDate);
  
  if (age < 12) return 'Kinder (unter 12)';
  if (age < 14) return 'D-Jugend (12-13)';
  if (age < 16) return 'C-Jugend (14-15)';
  if (age < 18) return 'B-Jugend (16-17)';
  if (age < 20) return 'A-Jugend (18-19)';
  return 'Erwachsene (20+)';
}

/**
 * Hilfsfunktion: Athlet aus Storage laden (Mock)
 */
function getAthleteFromStorage(athleteId: string): Athlete | null {
  // In echter Implementation würde hier der Storage aufgerufen
  // Für jetzt return null - wird in der Integration ersetzt
  return null;
}

/**
 * GDPR-konforme Consent-Text Generation
 */
export function generateConsentText(
  consentType: ConsentRecord['consentType'],
  athleteName: string,
  age: number
): string {
  const texts = {
    data_processing: `
Ich erkläre mich hiermit im Namen von ${athleteName} (${age} Jahre) damit einverstanden, 
dass personenbezogene Daten im Rahmen des VigorLog-Systems zur Gesundheitsüberwachung 
verarbeitet werden. Dies umfasst die täglichen Check-in-Daten, Gesundheitsmetriken und 
zugehörige Notizen. Die Verarbeitung erfolgt auf Grundlage von Art. 8 DSGVO 
(Schutz von Kindern).
    `,
    medical_data: `
Ich erkläre mich hiermit im Namen von ${athleteName} (${age} Jahre) damit einverstanden, 
dass besondere Kategorien personenbezogener Daten (Gesundheitsdaten) gemäß Art. 9 DSGVO 
verarbeitet werden. Dies umfasst Schmerzlevel, Müdigkeitswerte, Stimmungsangaben und 
weitere gesundheitsrelevante Metriken zur Optimierung der sportlichen Betreuung.
    `,
    parent_access: `
Ich erkläre mich hiermit damit einverstanden, dass ich als Erziehungsberechtigte(r) 
von ${athleteName} (${age} Jahre) Zugang zu den im VigorLog-System gespeicherten 
Gesundheitsdaten erhalte. Dies dient der Sicherstellung des Kindeswohls und der 
Erfüllung meiner Aufsichtspflicht.
    `,
    dual_consent_minor: `
Hiermit erkläre ich als Erziehungsberechtigte(r) im Namen von ${athleteName} (${age} Jahre) 
die Einwilligung zur Nutzung des VigorLog-Systems. Diese Einwilligung umfasst die 
Verarbeitung personenbezogener Daten und Gesundheitsdaten entsprechend Art. 8 DSGVO. 
Die Einwilligung kann jederzeit widerrufen werden.
    `
  };
  
  return texts[consentType] || 'Allgemeine Einverständniserklärung';
}

/**
 * Prüft ob alle erforderlichen Consents für einen Minderjährigen vorliegen
 */
export function hasAllRequiredConsents(
  athlete: Athlete,
  consentRecords: ConsentRecord[]
): boolean {
  if (!needsParentalConsent(athlete.birthDate)) {
    return true; // Keine Consents nötig für 16+
  }
  
  const requiredConsents = ['data_processing', 'medical_data', 'parent_access'];
  const athleteConsents = consentRecords.filter(c => 
    c.userId === athlete.id && c.granted && !c.revokedAt
  );
  
  return requiredConsents.every(required =>
    athleteConsents.some(consent => consent.consentType === required)
  );
}