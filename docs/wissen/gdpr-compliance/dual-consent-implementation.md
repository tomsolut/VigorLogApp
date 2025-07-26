# GDPR Dual Consent Implementation Guide

## Übersicht

Die DSGVO/GDPR erfordert für die Verarbeitung von Kinderdaten eine doppelte Einwilligung: sowohl vom Kind als auch vom Erziehungsberechtigten.

## Rechtliche Grundlagen

### Artikel 8 DSGVO
> "Die Verarbeitung der personenbezogenen Daten eines Kindes ist rechtmäßig, wenn das Kind das 16. Lebensjahr vollendet hat."

### Altersgrenzen nach Land

| Land | Mindestalter | Bemerkung |
|------|--------------|-----------|
| Deutschland | 16 Jahre | DSGVO-Standard |
| Österreich | 14 Jahre | Nationale Anpassung |
| UK, Spanien | 13 Jahre | Minimum nach DSGVO |
| Frankreich | 15 Jahre | Nationale Regelung |
| Niederlande | 16 Jahre | DSGVO-Standard |

## Implementierungsschritte

### 1. Altersverifikation

```typescript
interface AgeVerificationData {
  birthDate: string;
  countryCode: string;
  verificationMethod: 'self-declared' | 'document' | 'parent-verified';
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

function getConsentAge(countryCode: string): number {
  const ageThresholds: Record<string, number> = {
    'DE': 16, // Deutschland
    'AT': 14, // Österreich
    'UK': 13, // Vereinigtes Königreich
    'ES': 13, // Spanien
    'FR': 15, // Frankreich
    // ... weitere Länder
  };
  
  return ageThresholds[countryCode] || 16; // Standard: 16
}
```

### 2. Dual Consent Flow

```typescript
interface ConsentFlow {
  // Schritt 1: Kind-Registrierung
  childRegistration: {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
  };
  
  // Schritt 2: Eltern-Einladung
  parentInvitation: {
    parentEmail: string;
    verificationToken: string;
    expiresAt: Date;
  };
  
  // Schritt 3: Eltern-Verifikation
  parentVerification: {
    parentId: string;
    verificationMethod: 'email' | 'sms' | 'id-document';
    verifiedAt: Date;
  };
  
  // Schritt 4: Finale Zustimmung
  finalConsent: {
    childConsent: boolean;
    parentConsent: boolean;
    consentedAt: Date;
    ipAddress: string;
  };
}
```

### 3. Implementierung in React

```tsx
// Komponente für Dual Consent
export function DualConsentForm() {
  const [step, setStep] = useState<'child' | 'parent' | 'verification' | 'complete'>('child');
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [parentData, setParentData] = useState<ParentData | null>(null);

  // Schritt 1: Kind-Formular
  const ChildConsentStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Deine Zustimmung</CardTitle>
        <CardDescription>
          Wir benötigen deine und die Zustimmung deiner Eltern
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleChildSubmit}>
          {/* Formularfelder */}
        </Form>
      </CardContent>
    </Card>
  );

  // Schritt 2: Eltern-Einladung
  const ParentInvitationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Eltern einladen</CardTitle>
        <CardDescription>
          Gib die E-Mail-Adresse deiner Eltern ein
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* E-Mail Eingabe */}
      </CardContent>
    </Card>
  );

  // ... weitere Schritte
}
```

### 4. Verifikationsmethoden

#### E-Mail-Verifikation
```typescript
async function sendParentVerification(parentEmail: string, childName: string) {
  const token = generateSecureToken();
  const verificationUrl = `${process.env.APP_URL}/consent/verify?token=${token}`;
  
  await sendEmail({
    to: parentEmail,
    subject: 'Einwilligung erforderlich für ' + childName,
    template: 'parent-consent',
    data: {
      childName,
      verificationUrl,
      expiresIn: '48 Stunden'
    }
  });
}
```

#### Alternative Methoden
- **Kreditkarte**: Altersverifikation durch Zahlungsmittel
- **Ausweisdokument**: Upload und manuelle Prüfung
- **Video-Verifikation**: Live-Verifikation per Videocall

### 5. Datenspeicherung

```typescript
interface ConsentRecord {
  id: string;
  childId: string;
  parentId: string;
  consentType: 'dual-consent';
  purposes: string[]; // Zwecke der Datenverarbeitung
  grantedAt: Date;
  expiresAt?: Date;
  withdrawnAt?: Date;
  metadata: {
    ipAddress: string;
    userAgent: string;
    verificationMethod: string;
  };
}
```

### 6. Widerruf ermöglichen

```tsx
export function ConsentManagement({ userId }: { userId: string }) {
  const handleWithdrawConsent = async () => {
    const confirmed = window.confirm(
      'Möchtest du deine Einwilligung wirklich widerrufen?'
    );
    
    if (confirmed) {
      await withdrawConsent(userId);
      // Nutzer ausloggen und Daten löschen/anonymisieren
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Einwilligungsverwaltung</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="destructive" 
          onClick={handleWithdrawConsent}
        >
          Einwilligung widerrufen
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Best Practices

### 1. Transparenz
- Klare, altersgerechte Sprache
- Visuelle Erklärungen für Kinder
- Separate Informationen für Eltern

### 2. Sicherheit
- Sichere Token-Generierung
- Zeitlich begrenzte Verifikationslinks
- Verschlüsselte Kommunikation

### 3. Dokumentation
- Alle Einwilligungen protokollieren
- Zeitstempel und Metadaten speichern
- Audit-Trail führen

### 4. Benutzerfreundlichkeit
- Einfacher, klarer Prozess
- Mobile Optimierung
- Mehrsprachige Unterstützung

## Checkliste

- [ ] Altersgrenzen pro Land implementiert
- [ ] Altersverifikation eingebaut
- [ ] Dual-Consent-Flow erstellt
- [ ] Eltern-Benachrichtigung funktioniert
- [ ] Verifikationsmethoden implementiert
- [ ] Consent-Records werden gespeichert
- [ ] Widerruf ist möglich
- [ ] Audit-Trail vorhanden
- [ ] Datenschutzerklärung angepasst
- [ ] Tests für alle Szenarien

## Rechtliche Hinweise

**Wichtig**: Diese Anleitung ersetzt keine rechtliche Beratung. Konsultieren Sie einen Datenschutzexperten für Ihre spezifische Situation.

## Weiterführende Ressourcen

- [Art. 8 DSGVO](https://dsgvo-gesetz.de/art-8-dsgvo/)
- [EDPB Guidelines](https://edpb.europa.eu/)
- [ICO Children's Code](https://ico.org.uk/for-organisations/childrens-code-hub/)