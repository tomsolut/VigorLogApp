# Color Coding Standards - VigorLog Health Metrics

## 🎨 Einheitliche Farbkodierung für Gesundheitsmetriken

### 📊 Grundprinzip:
- **Grün** = Gute/gesunde Werte
- **Orange** = Mittlere/zu beachtende Werte  
- **Rot** = Schlechte/kritische Werte

## 🔢 Metrik-Kategorien

### ✅ Positive Metriken (Hoch = Gut)
Metriken, bei denen **hohe Werte gut** sind:
- `sleepQuality` - Schlafqualität
- `moodRating` - Stimmung
- `mood` - Stimmung (Legacy)
- `sleep` - Schlaf (Legacy)

**Farbregeln für positive Metriken:**
```typescript
if (value >= 7) return 'text-green-600';  // Sehr gut (7-10)
if (value >= 4) return 'text-orange-600'; // OK (4-6)
return 'text-red-600';                    // Schlecht (1-3)
```

### ⚠️ Negative Metriken (Niedrig = Gut)
Metriken, bei denen **niedrige Werte gut** sind:
- `painLevel` - Schmerzniveau
- `pain` - Schmerzen (Legacy)
- `fatigueLevel` - Müdigkeitslevel
- `fatigue` - Müdigkeit (Legacy)
- `stressLevel` - Stresslevel
- `stress` - Stress (Legacy)
- `muscleSoreness` - Muskelkater

**Farbregeln für negative Metriken:**
```typescript
if (value <= 3) return 'text-green-600';  // Sehr gut (1-3)
if (value <= 6) return 'text-orange-600'; // OK (4-6)
return 'text-red-600';                    // Schlecht (7-10)
```

## 💻 Standard Implementation

### Funktion für alle Dashboards:
```typescript
// Etablierte Farblogik - in jedem Dashboard identisch verwenden
function getMetricValueColor(metric: string, value: number): string {
  // Metriken wo niedrige Werte gut sind
  const negativeMetrics = ['painLevel', 'pain', 'fatigueLevel', 'fatigue', 'stressLevel', 'stress', 'muscleSoreness'];
  
  if (negativeMetrics.includes(metric)) {
    // Niedrig = gut (grün), Hoch = schlecht (rot)
    if (value <= 3) return 'text-green-600';
    if (value <= 6) return 'text-orange-600';
    return 'text-red-600';
  } else {
    // Hoch = gut (grün), Niedrig = schlecht (rot) - für Schlaf und Stimmung
    if (value >= 7) return 'text-green-600';
    if (value >= 4) return 'text-orange-600';
    return 'text-red-600';
  }
}
```

### Verwendung in Components:
```typescript
<div className={`text-2xl font-bold ${getMetricValueColor('painLevel', painValue)}`}>
  {painValue}/10
</div>
```

## 🎯 Gesundheitsstatus-Bewertung

### Overall Health Status Colors:
```typescript
const getOverallHealthStatus = (checkIn: DailyCheckin | undefined) => {
  if (!checkIn) {
    return { status: 'Kein Check-in', color: 'text-muted-foreground', icon: 'circle-question' };
  }

  // Score-Berechnung basierend auf allen Metriken
  let score = calculateHealthScore(checkIn);

  if (score >= 10) {
    return { status: 'Sehr gut', color: 'text-green-600', icon: 'circle-check' };
  } else if (score >= 6) {
    return { status: 'Gut', color: 'text-orange-600', icon: 'circle-exclamation' };
  } else {
    return { status: 'Aufmerksamkeit nötig', color: 'text-red-600', icon: 'triangle-exclamation' };
  }
};
```

## 🚦 Alert-Farben

### Alert-Level Farbkodierung:
```typescript
const getAlertColor = (severity: Alert['severity']) => {
  switch (severity) {
    case 'critical': return 'text-red-600';
    case 'high': return 'text-orange-600';
    case 'medium': return 'text-yellow-600';
    default: return 'text-blue-600';
  }
};
```

## 📋 Dashboard-spezifische Anwendungen

### 🏃‍♂️ Athlete Dashboard:
- ✅ Implementiert in `/src/app/athlete/page.tsx`
- Verwendet `getMetricValueColor()` für alle Metriken
- Zeigt heute's Check-in Werte mit korrekten Farben

### 👨‍🏫 Coach Dashboard:
- ✅ Implementiert in `/src/app/coach/page.tsx`
- Verwendet Farben für Team Health Overview
- Health Status Dots mit konsistenten Farben

### 👨‍👩‍👧‍👦 Parent Dashboard:
- ✅ **Korrigiert** in `/src/app/parent/page.tsx`
- Jetzt konsistent mit etabliertem Farbschema
- Zeigt Kinder-Gesundheitsstatus korrekt an

### 🔧 Admin Dashboard:
- ⚠️ **Noch zu implementieren**
- MUSS diese Farbregeln von Anfang an verwenden
- Verwende Template unten

## 📝 Admin Dashboard Template

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { storage } from '@/lib/storage';
import { logger } from '@/lib/logger';
import type { Admin, DailyCheckin } from '@/types';

// WICHTIG: Etablierte Farblogik verwenden
function getMetricValueColor(metric: string, value: number): string {
  const negativeMetrics = ['painLevel', 'pain', 'fatigueLevel', 'fatigue', 'stressLevel', 'stress', 'muscleSoreness'];
  
  if (negativeMetrics.includes(metric)) {
    if (value <= 3) return 'text-green-600';
    if (value <= 6) return 'text-orange-600';
    return 'text-red-600';
  } else {
    if (value >= 7) return 'text-green-600';
    if (value >= 4) return 'text-orange-600';
    return 'text-red-600';
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Admin | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const currentUser = useAuthStore.getState().currentUser;
      logger.info('AdminDashboard', 'Auth check', { currentUser });
      
      if (!currentUser) {
        logger.warn('AdminDashboard', 'No user found, redirecting to home');
        router.push('/');
        return;
      }
      
      if (currentUser.role !== 'admin') {
        logger.warn('AdminDashboard', 'User is not admin', { role: currentUser.role });
        router.push('/');
        return;
      }

      setUser(currentUser as Admin);
      setAuthChecked(true);
      loadDashboardData();
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [router]);

  const loadDashboardData = () => {
    try {
      setLoading(true);
      // Admin-spezifische Datenladung
      // Verwende getMetricValueColor() für alle Gesundheitsmetriken
    } catch (error) {
      logger.error('AdminDashboard', 'Error loading data', { error });
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Icon name="spinner" className="text-4xl text-primary animate-spin mb-4" />
          <p className="text-foreground">
            {!authChecked ? 'Authentifizierung wird überprüft...' : 'Lade Admin Dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Willkommen zurück, {user?.firstName}!
            </p>
          </div>
          <Button
            onClick={() => {
              useAuthStore.getState().logout();
              router.push('/');
            }}
            variant="outline"
          >
            <Icon name="logout" className="mr-2" />
            Abmelden
          </Button>
        </div>

        {/* Admin Content - VERWENDE getMetricValueColor() für alle Metriken */}
        <div className="grid gap-6">
          {/* Beispiel für Metrik-Anzeige */}
          <div className={`text-2xl font-bold ${getMetricValueColor('painLevel', someValue)}`}>
            {someValue}/10
          </div>
        </div>
      </div>
    </div>
  );
}
```

## ✅ Checklist für neue Dashboards:

### Farbkodierung:
- [ ] `getMetricValueColor()` Funktion implementiert
- [ ] Negative vs. Positive Metriken korrekt kategorisiert
- [ ] Konsistente Farben: `text-green-600`, `text-orange-600`, `text-red-600`
- [ ] Overall Health Status mit korrekten Farben
- [ ] Alert-Farben entsprechend Severity

### Testing:
- [ ] Verschiedene Werte testen (1-3, 4-6, 7-10)
- [ ] Sowohl positive als auch negative Metriken prüfen
- [ ] Visual consistency mit anderen Dashboards

### Dokumentation:
- [ ] Diese Standards in Code-Kommentaren referenzieren
- [ ] Neue Metriken in entsprechende Kategorie einordnen

---

**🎯 Ziel:** Alle Dashboards verwenden identische Farbkodierung für maximale Benutzererfahrung und Konsistenz.

**📅 Status:** 
- ✅ Athlete Dashboard
- ✅ Coach Dashboard  
- ✅ Parent Dashboard (korrigiert)
- ⚠️ Admin Dashboard (noch zu implementieren)