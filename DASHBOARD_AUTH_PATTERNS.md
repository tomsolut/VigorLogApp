# Dashboard Authentication Patterns - VigorLog

## 📋 Problemanalyse: Parent Dashboard Auth-Fehler

### ❌ Was nicht funktionierte:
- **Navigation mit `window.location.href`** verursachte vollständigen Page-Reload
- **Auth-State verlust** durch fehlende Zustand-Hydration vor Navigation
- **Inkonsistente Hook-Verwendung** zwischen verschiedenen Dashboards
- **Race Conditions** zwischen Auth-Check und Zustand-Rehydration

### ✅ Funktionierende Lösung:

## 🎯 Auth-Pattern für alle Dashboards

### 1. Navigation (Homepage)
```typescript
// ❌ FALSCH - verursacht State-Verlust
window.location.href = `/${user.role}`;

// ✅ RICHTIG - Client-Side Navigation
router.push(`/${user.role}`);
```

### 2. Dashboard Auth-Check Pattern
```typescript
// ✅ BEWÄHRTES MUSTER (wie Coach Dashboard)
export default function RoleDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<RoleType | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direkter Zugriff auf Store-State (keine React Hooks)
    const checkAuth = setTimeout(() => {
      const currentUser = useAuthStore.getState().currentUser;
      logger.info('RoleDashboard', 'Auth check', { currentUser });
      
      if (!currentUser) {
        logger.warn('RoleDashboard', 'No user found, redirecting to home');
        router.push('/');
        return;
      }
      
      if (currentUser.role !== 'expectedRole') {
        logger.warn('RoleDashboard', 'Wrong role', { role: currentUser.role });
        router.push('/');
        return;
      }

      setUser(currentUser as RoleType);
      setAuthChecked(true);
      loadDashboardData();
    }, 100); // Kurze Verzögerung für Hydration

    return () => clearTimeout(checkAuth);
  }, [router]);

  // Loading während Auth-Check UND Datenladung
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Icon name="spinner" className="text-4xl text-primary animate-spin mb-4" />
          <p className="text-foreground">
            {!authChecked ? 'Authentifizierung wird überprüft...' : 'Lade Dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
      {/* Dashboard Content */}
    </div>
  );
}
```

### 3. Datenladung Pattern
```typescript
const loadDashboardData = () => {
  try {
    setLoading(true);
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser || currentUser.role !== 'expectedRole') return;
    
    const roleUser = currentUser as RoleType;
    logger.info('Dashboard', 'Loading data', { userId: roleUser.id });
    
    // Lade rollenspezifische Daten aus Storage
    const data = storage.getRoleSpecificData(roleUser);
    
    // Setze State
    setData(data);
    
    logger.info('Dashboard', 'Data loaded successfully', { 
      dataCount: data.length 
    });
  } catch (error) {
    logger.error('Dashboard', 'Error loading data', { error });
  } finally {
    setLoading(false);
  }
};
```

## 🔄 Konsistente Implementation-Checklist

### ✅ Für jedes neue Dashboard:

1. **Navigation (Homepage)**
   - [ ] `router.push()` statt `window.location.href`
   - [ ] Debugging-Logs für Auth-State hinzufügen

2. **Dashboard Auth-Check**
   - [ ] `useAuthStore.getState().currentUser` direkt verwenden
   - [ ] Keine `useAuth()` Hook für initialen Auth-Check
   - [ ] 100ms Timeout für Hydration
   - [ ] Explizite Rollenprüfung
   - [ ] Logger für alle Auth-Steps

3. **Loading States**
   - [ ] `authChecked` State für Auth-Prüfung
   - [ ] `loading` State für Datenladung  
   - [ ] Kombinierte Loading-Anzeige
   - [ ] Unterschiedliche Nachrichten je Phase

4. **Datenladung**
   - [ ] Erneute Auth-Check in `loadData()`
   - [ ] Try-catch mit Logger
   - [ ] Storage-Zugriff über rollenspezifische IDs
   - [ ] Finally-Block für Loading-State

5. **UI Konsistenz**
   - [ ] Gradient Background: `bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10`
   - [ ] Header mit Benutzername und Logout-Button
   - [ ] Konsistente Icon-Verwendung
   - [ ] Loading-Spinner zentriert

## 🚨 Anti-Patterns vermeiden:

### ❌ Diese Muster NICHT verwenden:
1. `window.location.href` für interne Navigation
2. `useAuth()` Hook für initialen Auth-Check in useEffect
3. Lange Hydration-Delays (>500ms)
4. Auth-Check ohne Logging
5. Fehlende Loading-States
6. Direkter localStorage-Zugriff statt Storage-API

### ⚠️ Häufige Fallstricke:
1. **Race Condition**: useAuth() ist bei erstem Render noch nicht hydratisiert
2. **State-Verlust**: window.location.href löscht Zustand-Store
3. **Inkonsistente Typen**: CheckIn vs DailyCheckin verwechseln
4. **Fehlende Error-Behandlung**: Storage-Fehler nicht abgefangen

## 📋 Template für neues Dashboard:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { storage } from '@/lib/storage';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import type { RoleType } from '@/types';

export default function NewRoleDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<RoleType | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const currentUser = useAuthStore.getState().currentUser;
      logger.info('NewRoleDashboard', 'Auth check', { currentUser });
      
      if (!currentUser) {
        logger.warn('NewRoleDashboard', 'No user found, redirecting to home');
        router.push('/');
        return;
      }
      
      if (currentUser.role !== 'newrole') {
        logger.warn('NewRoleDashboard', 'User is not newrole', { role: currentUser.role });
        router.push('/');
        return;
      }

      setUser(currentUser as RoleType);
      setAuthChecked(true);
      loadDashboardData();
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [router]);

  const loadDashboardData = () => {
    try {
      setLoading(true);
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser || currentUser.role !== 'newrole') return;
      
      const roleUser = currentUser as RoleType;
      
      // Lade rollenspezifische Daten
      const roleData = storage.getRoleData(roleUser.id);
      setData(roleData);
      
      logger.info('NewRoleDashboard', 'Data loaded', { count: roleData.length });
    } catch (error) {
      logger.error('NewRoleDashboard', 'Error loading data', { error });
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
            {!authChecked ? 'Authentifizierung wird überprüft...' : 'Lade Dashboard...'}
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
              Role Dashboard
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

        {/* Dashboard Content */}
        <div className="grid gap-6">
          {/* Content here */}
        </div>
      </div>
    </div>
  );
}
```

---

**Diese Dokumentation stellt sicher, dass alle zukünftigen Dashboard-Implementierungen (Admin, etc.) von Anfang an korrekt funktionieren.**