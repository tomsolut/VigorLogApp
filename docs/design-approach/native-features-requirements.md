# Native Features Requirements für VigorLog Mobile App

## Executive Summary

Dieses Dokument definiert die nativen Features, die in der VigorLog Mobile App über Capacitor implementiert werden sollen. Die Priorisierung basiert auf User Research mit jugendlichen Athleten und deren spezifischen Bedürfnissen im Trainingsalltag.

## 1. Feature-Priorisierung

### Kritische Features (Must-Have)

#### 1.1 Kamera & Bildverarbeitung
**Zweck:** Verletzungsdokumentation und Fortschrittstracking

```typescript
interface CameraRequirements {
  // Basis-Funktionen
  capturePhoto: boolean;           // Foto aufnehmen
  selectFromGallery: boolean;      // Aus Galerie wählen
  
  // Erweiterte Funktionen
  imageCompression: {
    maxWidth: 1920;              // Max Breite in Pixel
    maxHeight: 1080;             // Max Höhe in Pixel
    quality: 0.8;                // JPEG Qualität (0-1)
  };
  
  // Annotationen
  drawOnImage: boolean;          // Markierungen für Verletzungen
  addTextOverlay: boolean;       // Beschriftungen
  
  // Speicherung
  saveToGallery: boolean;        // Optional in Galerie speichern
  encryptedStorage: boolean;     // Verschlüsselte Speicherung
}
```

**Use Cases:**
- Verletzungen dokumentieren mit Markierungen
- Muskelentwicklung verfolgen (Vorher/Nachher)
- Haltungsanalyse für Trainer

#### 1.2 Push Notifications
**Zweck:** Engagement und Compliance erhöhen

```typescript
interface NotificationRequirements {
  // Check-in Erinnerungen
  dailyReminders: {
    enabled: boolean;
    customTimes: string[];       // z.B. ["07:00", "19:00"]
    skipWeekends: boolean;
    adaptToTrainingSchedule: boolean;
  };
  
  // Gesundheitswarnungen
  healthAlerts: {
    highPainLevel: number;       // Ab Schmerzlevel X
    missedCheckins: number;      // Nach X Tagen ohne Check-in
    abnormalPatterns: boolean;   // KI-basierte Erkennung
  };
  
  // Team-Benachrichtigungen
  teamUpdates: {
    newTeamMessage: boolean;
    coachFeedback: boolean;
    teamAchievements: boolean;
  };
  
  // Motivational
  achievements: {
    streaks: boolean;            // X Tage in Folge
    improvements: boolean;       // Verbesserungen erkannt
    milestones: boolean;         // Ziele erreicht
  };
}
```

#### 1.3 Biometrische Authentifizierung
**Zweck:** Datenschutz für sensible Gesundheitsdaten

```typescript
interface BiometricRequirements {
  // Authentifizierungsmethoden
  methods: {
    faceId: boolean;             // iOS Face ID
    touchId: boolean;            // iOS Touch ID
    fingerprint: boolean;        // Android Fingerprint
    faceUnlock: boolean;         // Android Face Unlock
  };
  
  // Sicherheitseinstellungen
  security: {
    fallbackToPin: boolean;      // PIN als Fallback
    autoLockTimeout: number;     // Minuten bis Auto-Lock
    requireOnAppStart: boolean;  // Bei jedem App-Start
    requireForSensitiveData: boolean; // Für Gesundheitsdaten
  };
  
  // Datenschutz
  privacy: {
    blurScreenOnBackground: boolean;  // Screenshot-Schutz
    encryptLocalData: boolean;        // Lokale Verschlüsselung
  };
}
```

#### 1.4 Offline-Funktionalität
**Zweck:** Zuverlässigkeit auch ohne Internetverbindung

```typescript
interface OfflineRequirements {
  // Datenspeicherung
  storage: {
    checkinsQueue: number;       // Max. Anzahl offline Check-ins
    photoCache: number;          // MB für Foto-Cache
    syncOnWifi: boolean;         // Nur über WLAN synchronisieren
  };
  
  // Synchronisation
  sync: {
    autoSync: boolean;           // Automatisch bei Verbindung
    conflictResolution: 'latest' | 'merge' | 'prompt';
    retryAttempts: number;
    backgroundSync: boolean;     // iOS/Android Background Sync
  };
  
  // Offline-Features
  features: {
    viewHistoricData: boolean;   // Alte Daten anzeigen
    createCheckins: boolean;     // Neue Check-ins erstellen
    editProfile: boolean;        // Profil bearbeiten
    viewTeamData: boolean;       // Team-Daten (gecacht)
  };
}
```

### Wichtige Features (Should-Have)

#### 2.1 GPS/Location Services
**Zweck:** Trainingsort-Tracking und Wetterkontext

```typescript
interface LocationRequirements {
  // Basis-Tracking
  tracking: {
    trainingLocation: boolean;   // Trainingsort erfassen
    autoDetectVenue: boolean;    // Sportstätte erkennen
    weatherContext: boolean;     // Wetter am Trainingsort
  };
  
  // Datenschutz
  privacy: {
    fuzzyLocation: boolean;      // Ungenaue Position (Stadt-Level)
    optIn: boolean;              // Explizite Zustimmung
    deleteHistory: boolean;      // Standortverlauf löschen
  };
}
```

#### 2.2 Wearable Integration
**Zweck:** Automatisches Tracking von Vitaldaten

```typescript
interface WearableRequirements {
  // Apple Health / Google Fit
  healthKit: {
    heartRate: boolean;          // Herzfrequenz
    sleepAnalysis: boolean;      // Schlafanalyse
    steps: boolean;              // Schritte
    activeCalories: boolean;     // Verbrannte Kalorien
    hrvData: boolean;            // Heart Rate Variability
  };
  
  // Direkte Geräte-Integration
  devices: {
    appleWatch: boolean;
    fitbit: boolean;
    garmin: boolean;
    polarDevices: boolean;
  };
}
```

#### 2.3 Audio-Notizen
**Zweck:** Schnelle Eingabe nach dem Training

```typescript
interface AudioRequirements {
  recording: {
    maxDuration: number;         // Sekunden
    compression: boolean;        // Audio komprimieren
    transcription: boolean;      // Speech-to-Text
  };
  
  usage: {
    checkInNotes: boolean;       // Für Check-in Notizen
    injuryDescription: boolean;  // Verletzungsbeschreibung
    coachFeedback: boolean;      // Trainer-Feedback
  };
}
```

### Nice-to-Have Features

#### 3.1 AR-Funktionen
**Zweck:** Haltungsanalyse und Übungsanleitung

```typescript
interface ARRequirements {
  posture: {
    analysis: boolean;           // Haltungsanalyse
    realTimeFeedback: boolean;  // Live-Korrektur
    comparisonOverlay: boolean; // Soll/Ist-Vergleich
  };
}
```

#### 3.2 Video-Analyse
**Zweck:** Bewegungsanalyse für Technikverbesserung

```typescript
interface VideoRequirements {
  capture: {
    slowMotion: boolean;         // Zeitlupe
    maxDuration: number;         // Sekunden
    compression: boolean;        // Video komprimieren
  };
  
  analysis: {
    frameByFrame: boolean;       // Einzelbildanalyse
    drawingTools: boolean;       // Annotationen
    comparison: boolean;         // Side-by-Side Vergleich
  };
}
```

## 2. Platform-spezifische Anforderungen

### iOS-spezifisch

```typescript
interface iOSSpecific {
  // Health Kit Integration
  healthKit: {
    writePermissions: string[];  // Welche Daten schreiben
    readPermissions: string[];   // Welche Daten lesen
  };
  
  // iOS Features
  features: {
    siriShortcuts: boolean;      // "Hey Siri, Check-in starten"
    widgets: boolean;            // Home Screen Widgets
    liveActivities: boolean;     // Dynamic Island Support
  };
  
  // Minimum Version
  minVersion: '14.0';           // iOS 14+
}
```

### Android-spezifisch

```typescript
interface AndroidSpecific {
  // Google Fit Integration
  googleFit: {
    scopes: string[];            // API Scopes
    dataTypes: string[];         // Fitness Data Types
  };
  
  // Android Features
  features: {
    materialYou: boolean;        // Dynamic Color Theme
    widgets: boolean;            // Home Screen Widgets
    quickSettings: boolean;      // Quick Settings Tile
  };
  
  // Minimum Version
  minSdk: 24;                   // Android 7.0+
}
```

## 3. Technische Implementierung

### Capacitor Plugins

```json
{
  "dependencies": {
    // Kritische Features
    "@capacitor/camera": "^6.0.0",
    "@capacitor/push-notifications": "^6.0.0",
    "@capacitor-community/biometric-auth": "^6.0.0",
    "@capacitor/filesystem": "^6.0.0",
    "@capacitor/network": "^6.0.0",
    
    // Wichtige Features
    "@capacitor/geolocation": "^6.0.0",
    "@capacitor-community/health": "^3.0.0",
    "@capacitor-community/voice-recorder": "^5.0.0",
    
    // Nice-to-Have
    "@capacitor-community/ar": "^2.0.0",
    "@capacitor-community/video-editor": "^1.0.0"
  }
}
```

### Feature Detection & Fallbacks

```typescript
// src/hooks/use-native-features.ts
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { BiometricAuth } from '@capacitor-community/biometric-auth';

export const useNativeFeatures = () => {
  const platform = Capacitor.getPlatform();
  const isNative = Capacitor.isNativePlatform();
  
  // Feature Detection
  const features = {
    camera: {
      available: isNative,
      permissions: async () => {
        if (!isNative) return { granted: false };
        const status = await Camera.checkPermissions();
        return { granted: status.camera === 'granted' };
      },
      fallback: () => {
        // Web Fallback: File Input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        return input;
      }
    },
    
    biometric: {
      available: async () => {
        if (!isNative) return false;
        try {
          const result = await BiometricAuth.isAvailable();
          return result.isAvailable;
        } catch {
          return false;
        }
      },
      fallback: () => {
        // PIN/Password Fallback
        return 'pin';
      }
    },
    
    // Weitere Features...
  };
  
  return { platform, isNative, features };
};
```

## 4. User Experience Guidelines

### Permission Handling

```typescript
// src/utils/permissions.ts
export const requestPermission = async (
  feature: 'camera' | 'notifications' | 'location',
  options: {
    title: string;
    message: string;
    icon?: string;
  }
) => {
  // Show custom explanation modal first
  const userConsent = await showPermissionModal(options);
  
  if (!userConsent) return false;
  
  // Then request system permission
  switch (feature) {
    case 'camera':
      return await Camera.requestPermissions();
    case 'notifications':
      return await PushNotifications.requestPermissions();
    case 'location':
      return await Geolocation.requestPermissions();
  }
};
```

### Progressive Enhancement

```typescript
// Beispiel: Check-in mit Foto
const CheckInWithPhoto = () => {
  const { features } = useNativeFeatures();
  const [photo, setPhoto] = useState<string | null>(null);
  
  const handlePhotoCapture = async () => {
    if (features.camera.available) {
      // Native Camera
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl
      });
      setPhoto(image.dataUrl);
    } else {
      // Web Fallback
      const input = features.camera.fallback();
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => setPhoto(e.target?.result as string);
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };
  
  return (
    <div>
      <Button onClick={handlePhotoCapture}>
        <Icon name="camera" />
        Foto hinzufügen
      </Button>
      {photo && <img src={photo} alt="Check-in Foto" />}
    </div>
  );
};
```

## 5. Testing-Strategie für Native Features

### Unit Tests

```typescript
// __tests__/native-features.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useNativeFeatures } from '@/hooks/use-native-features';

// Mock Capacitor
jest.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: jest.fn(() => 'ios'),
    isNativePlatform: jest.fn(() => true)
  }
}));

describe('Native Features', () => {
  it('should detect iOS platform', () => {
    const { result } = renderHook(() => useNativeFeatures());
    expect(result.current.platform).toBe('ios');
    expect(result.current.isNative).toBe(true);
  });
  
  it('should provide web fallbacks', () => {
    // Mock as web platform
    (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
    
    const { result } = renderHook(() => useNativeFeatures());
    expect(result.current.features.camera.available).toBe(false);
    expect(result.current.features.camera.fallback()).toBeDefined();
  });
});
```

### E2E Tests

```typescript
// e2e/camera-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Camera Feature', () => {
  test('should show camera button on mobile', async ({ page, isMobile }) => {
    await page.goto('/checkin');
    
    if (isMobile) {
      const cameraButton = page.locator('button:has-text("Foto hinzufügen")');
      await expect(cameraButton).toBeVisible();
    }
  });
  
  test('should fallback to file input on desktop', async ({ page }) => {
    await page.goto('/checkin');
    
    // Trigger file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });
});
```

## 6. Performance-Überlegungen

### Lazy Loading von Native Features

```typescript
// Nur laden wenn benötigt
const CameraModule = lazy(() => 
  import('@capacitor/camera').then(module => ({ 
    default: module.Camera 
  }))
);

const BiometricModule = lazy(() => 
  import('@capacitor-community/biometric-auth').then(module => ({ 
    default: module.BiometricAuth 
  }))
);
```

### Caching-Strategie

```typescript
interface CacheStrategy {
  photos: {
    maxSize: 50;                 // MB
    maxAge: 30;                  // Tage
    compression: 0.8;            // Qualität
  };
  
  offlineData: {
    checkIns: 100;               // Anzahl
    teamData: 7;                 // Tage
    userProfile: 'permanent';    // Immer verfügbar
  };
}
```

## 7. Sicherheitsanforderungen

### Datenverschlüsselung

```typescript
interface SecurityRequirements {
  encryption: {
    atRest: 'AES-256';           // Lokale Verschlüsselung
    inTransit: 'TLS 1.3';        // Übertragung
    photos: boolean;             // Fotos verschlüsseln
    healthData: boolean;         // Gesundheitsdaten verschlüsseln
  };
  
  authentication: {
    biometric: boolean;          // Biometrisch
    pin: boolean;                // PIN als Fallback
    sessionTimeout: 15;          // Minuten
  };
  
  privacy: {
    anonymization: boolean;      // Daten anonymisieren
    dataRetention: 90;           // Tage
    exportData: boolean;         // DSGVO Export
    deleteAccount: boolean;      // Recht auf Löschung
  };
}
```

## 8. Rollout-Strategie

### Phase 1 (Woche 1-2)
- Camera für Verletzungsdokumentation
- Push Notifications für Check-in Erinnerungen
- Basis Offline-Support

### Phase 2 (Woche 3-4)
- Biometrische Authentifizierung
- Erweiterte Offline-Funktionen
- GPS/Location Services

### Phase 3 (Woche 5-6)
- Wearable Integration
- Audio-Notizen
- Performance-Optimierungen

### Phase 4 (Optional)
- AR-Features
- Video-Analyse
- Erweiterte Integrationen

## 9. Erfolgsmetriken

```typescript
interface SuccessMetrics {
  adoption: {
    cameraUsage: 0.6;            // 60% nutzen Kamera-Feature
    biometricAuth: 0.8;          // 80% aktivieren Biometrie
    notificationOptIn: 0.7;      // 70% erlauben Notifications
  };
  
  performance: {
    cameraLoadTime: 500;         // ms
    photoUploadTime: 2000;       // ms
    offlineSyncTime: 5000;       // ms
  };
  
  reliability: {
    crashFreeRate: 0.999;        // 99.9%
    syncSuccessRate: 0.98;       // 98%
    featureAvailability: 0.995;  // 99.5%
  };
}
```

## Zusammenfassung

Die Native Features sind sorgfältig priorisiert, um den größtmöglichen Nutzen für jugendliche Athleten zu bieten. Der Fokus liegt auf:

1. **Einfachheit**: Intuitive Bedienung ohne Lernkurve
2. **Datenschutz**: Höchste Sicherheit für sensible Gesundheitsdaten
3. **Zuverlässigkeit**: Funktioniert auch offline
4. **Performance**: Schnelle Reaktionszeiten
5. **Mehrwert**: Echte Verbesserung gegenüber Web-Version

Durch die schrittweise Implementierung können wir früh Feedback sammeln und die Features optimal an die Bedürfnisse der Nutzer anpassen.