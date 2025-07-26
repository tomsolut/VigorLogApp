# Capacitor Preparation Checklist für VigorLog

## Übersicht

Diese Checkliste stellt sicher, dass die VigorLog Web-App optimal für die Capacitor-Integration vorbereitet ist. Alle Punkte sollten vor der eigentlichen Mobile App-Erstellung abgearbeitet werden.

## 1. Web App Voraussetzungen

### Build & Deployment
- [ ] **Static Export kompatibel**
  ```javascript
  // next.config.js
  module.exports = {
    output: 'export', // Für Capacitor
    images: {
      unoptimized: true, // Capacitor kann Next.js Image Optimization nicht nutzen
    },
  };
  ```

- [ ] **Environment Variables**
  ```typescript
  // src/lib/config.ts
  export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
    (Capacitor.isNativePlatform() ? 'https://api.vigorlog.com' : 'http://localhost:3001');
  ```

### PWA Features
- [ ] **Manifest.json erstellt**
  ```json
  {
    "name": "VigorLog",
    "short_name": "VigorLog",
    "description": "Athleten-Monitoring für Jugendliche",
    "theme_color": "#39FF14",
    "background_color": "#000000",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "start_url": "/",
    "icons": [
      {
        "src": "/icons/icon-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
  ```

- [ ] **Service Worker (optional)**
  ```javascript
  // public/sw.js
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('vigorlog-v1').then((cache) => {
        return cache.addAll([
          '/',
          '/offline',
          '/icons/icon-192.png',
        ]);
      })
    );
  });
  ```

## 2. UI/UX Anpassungen

### Touch Optimization
- [ ] **Minimum Touch Target Size (44x44px)**
  ```css
  /* globals.css */
  button, a, input, select, textarea {
    min-height: 44px;
    min-width: 44px;
  }
  ```

- [ ] **Touch-freundliche Abstände**
  ```typescript
  // Mantine theme
  spacing: {
    xs: '0.5rem',  // 8px
    sm: '0.75rem', // 12px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
  }
  ```

### Mobile Navigation
- [ ] **Bottom Navigation vorbereitet**
- [ ] **Swipe Gesten geplant**
- [ ] **Pull-to-Refresh Bereiche definiert**

### Safe Areas
- [ ] **CSS Environment Variables**
  ```css
  /* For iPhone notch and home indicator */
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  ```

## 3. Performance Optimierungen

### Bundle Size
- [ ] **Code Splitting implementiert**
  ```typescript
  const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
    ssr: false,
    loading: () => <Skeleton />
  });
  ```

- [ ] **Unused Dependencies entfernt**
  ```bash
  npx depcheck
  npm prune
  ```

- [ ] **Images optimiert**
  - WebP Format mit Fallback
  - Responsive Images
  - Lazy Loading

### Loading Performance
- [ ] **Skeleton Screens**
- [ ] **Progressive Enhancement**
- [ ] **Offline Fallbacks**

## 4. Data Management

### Offline Storage
- [ ] **LocalStorage Strategie**
  ```typescript
  // src/lib/storage.ts
  export const storage = {
    async set(key: string, value: any) {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Storage
        await Storage.set({ key, value: JSON.stringify(value) });
      } else {
        // Use localStorage
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    
    async get(key: string) {
      if (Capacitor.isNativePlatform()) {
        const { value } = await Storage.get({ key });
        return value ? JSON.parse(value) : null;
      } else {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    }
  };
  ```

### API Communication
- [ ] **CORS Configuration**
  ```typescript
  // Backend CORS setup
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'capacitor://localhost',
      'https://localhost',
    ],
    credentials: true,
  }));
  ```

- [ ] **Error Handling**
  ```typescript
  // Network error handling
  const fetchWithRetry = async (url: string, options: RequestInit) => {
    if (!navigator.onLine) {
      throw new Error('Keine Internetverbindung');
    }
    
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Request failed');
      return response;
    } catch (error) {
      // Queue for later if offline
      if (Capacitor.isNativePlatform()) {
        await queueRequest(url, options);
      }
      throw error;
    }
  };
  ```

## 5. Native Feature Preparation

### Camera Ready
- [ ] **File Input Fallback**
  ```typescript
  const ImageUpload = () => {
    const handleCapture = async () => {
      if (Capacitor.isNativePlatform()) {
        // Will use Capacitor Camera
        console.log('Camera will be available after Capacitor integration');
      } else {
        // Web fallback
        inputRef.current?.click();
      }
    };
    
    return (
      <>
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          capture="environment"
          hidden 
        />
        <Button onClick={handleCapture}>
          Foto aufnehmen
        </Button>
      </>
    );
  };
  ```

### Notification Preparation
- [ ] **Permission Request UI**
- [ ] **Notification Preferences**
- [ ] **Fallback für Web Notifications**

### Geolocation Ready
- [ ] **Permission Handling**
- [ ] **Fallback for denied permissions**

## 6. Platform Detection

### Capacitor Detection Helper
```typescript
// src/lib/platform.ts
import { Capacitor } from '@capacitor/core';

export const platform = {
  isNative: Capacitor.isNativePlatform(),
  isIOS: Capacitor.getPlatform() === 'ios',
  isAndroid: Capacitor.getPlatform() === 'android',
  isWeb: Capacitor.getPlatform() === 'web',
};

// Usage
if (platform.isNative) {
  // Native specific code
} else {
  // Web specific code
}
```

### Conditional Features
```typescript
// src/hooks/use-platform-features.ts
export const usePlatformFeatures = () => {
  const canUseCamera = platform.isNative || 'mediaDevices' in navigator;
  const canUsePush = platform.isNative || 'Notification' in window;
  const canUseBiometric = platform.isNative;
  
  return {
    canUseCamera,
    canUsePush,
    canUseBiometric,
  };
};
```

## 7. Testing Preparation

### Mobile Browser Testing
- [ ] **iOS Safari tested**
- [ ] **Chrome Android tested**
- [ ] **Responsive design verified**
- [ ] **Touch interactions tested**

### Performance Testing
- [ ] **Lighthouse Mobile Score > 90**
- [ ] **Bundle size < 500KB**
- [ ] **First Paint < 2s on 3G**

## 8. Build Configuration

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
  trailingSlash: true,
  experimental: {
    // Optimize for mobile
    optimizeCss: true,
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};
```

### Package.json Scripts
```json
{
  "scripts": {
    "build:mobile": "next build && next export -o dist",
    "cap:init": "cap init vigorlog com.vigorlog.app --web-dir dist",
    "cap:add": "cap add ios && cap add android",
    "cap:sync": "cap sync",
    "cap:run:ios": "cap run ios",
    "cap:run:android": "cap run android"
  }
}
```

## 9. Security Considerations

### Content Security Policy
```typescript
// src/app/layout.tsx
export const metadata = {
  other: {
    'Content-Security-Policy': 
      "default-src 'self' capacitor://localhost https://localhost; " +
      "img-src 'self' data: https:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline';"
  }
};
```

### Secure Storage
- [ ] **Sensitive data encryption planned**
- [ ] **Biometric auth preparation**
- [ ] **Secure API communication**

## 10. Documentation

### Developer Documentation
- [ ] **Platform-specific code documented**
- [ ] **Build process documented**
- [ ] **Deployment process documented**

### User Documentation
- [ ] **Mobile app features listed**
- [ ] **Permission explanations prepared**
- [ ] **Offline functionality explained**

## Pre-Flight Checklist

Bevor Sie mit der Capacitor-Integration beginnen:

1. **Web App vollständig funktionsfähig**
   - [ ] Alle Features implementiert
   - [ ] Responsive Design fertig
   - [ ] Performance optimiert

2. **Mobile-spezifische Anpassungen**
   - [ ] Touch-optimierte UI
   - [ ] Mobile Navigation
   - [ ] Offline-Funktionalität

3. **Build & Deployment**
   - [ ] Static Export funktioniert
   - [ ] Environment Variables konfiguriert
   - [ ] API CORS vorbereitet

4. **Testing**
   - [ ] Mobile Browser getestet
   - [ ] Performance verifiziert
   - [ ] Offline-Szenarien getestet

5. **Documentation**
   - [ ] Setup-Anleitung
   - [ ] Deployment-Guide
   - [ ] Troubleshooting-Guide

## Nächste Schritte

Nach Abschluss dieser Checkliste:

1. Capacitor installieren: `npm install @capacitor/core @capacitor/cli`
2. Capacitor initialisieren: `npx cap init`
3. Platforms hinzufügen: `npx cap add ios && npx cap add android`
4. Native Features implementieren
5. Testing auf echten Geräten
6. App Store Vorbereitung

Die vollständige Capacitor-Integration sollte nach dieser Vorbereitung nur noch 3-5 Tage dauern!