# Font Awesome Quick Reference - VigorLog

## 🚀 Schnellreferenz für häufig genutzte Icons

### Sport-Icons (korrekte Namen!)
```tsx
<Icon name="football" />      // ⚽ Fußball (fa-futbol)
<Icon name="basketball" />    // 🏀 Basketball
<Icon name="baseball" />      // ⚾ Baseball  
<Icon name="americanFootball" /> // 🏈 American Football
<Icon name="tennis" />        // 🎾 Tennis
<Icon name="squash" />        // 🏸 Squash
<Icon name="swimming" />      // 🏊 Schwimmen
<Icon name="volleyball" />    // 🏐 Volleyball
```

### Gesundheitsmetriken
```tsx
<HealthIcon metric="sleep" />    // 🛏️ Schlaf
<HealthIcon metric="fatigue" />  // 🔋 Müdigkeit
<HealthIcon metric="mood" />     // 😊 Stimmung
<HealthIcon metric="pain" />     // ⚠️ Schmerzen
<HealthIcon metric="heart" />    // 💓 Herzfrequenz
```

### Benutzerrollen
```tsx
<RoleIcon role="athlete" />  // 🏃 Athlet
<RoleIcon role="coach" />    // 🎯 Coach
<RoleIcon role="parent" />   // 👥 Eltern
<RoleIcon role="admin" />    // 🛡️ Admin
```

### Status-Icons
```tsx
<StatusIcon status="success" /> // ✅ Erfolg
<StatusIcon status="warning" /> // ⚠️ Warnung
<StatusIcon status="error" />   // ❌ Fehler
<StatusIcon status="info" />    // ℹ️ Info
```

## 📝 Verwendungsbeispiele

### In Komponenten
```tsx
import { Icon, HealthIcon, SportIcon } from '@/components/ui/icon';

// Einfache Verwendung
<Icon name="heart" className="text-red-500" size="xl" />

// Mit Animation
<Icon name="loading" spin className="text-blue-600" />

// Sport-Icon automatisch
<SportIcon sport="fußball" className="text-green-600" size="2xl" />

// In Buttons
<button className="flex items-center gap-2">
  <Icon name="add" />
  <span>Neuer Check-in</span>
</button>

// Alert mit Icon
<div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
  <Icon name="warning" className="text-red-600" size="lg" />
  <span>Hohe Schmerzwerte erkannt!</span>
</div>
```

### Größen-System
- `xs` - Extra klein (text-xs)
- `sm` - Klein (text-sm)
- `md` - Standard (text-base)
- `lg` - Groß (text-lg)
- `xl` - Extra groß (text-xl)
- `2xl` - Doppelt groß (text-2xl)

### Animationen
- `spin` - Kontinuierliche Rotation
- `pulse` - Pulsieren (für Aufmerksamkeit)
- `fixedWidth` - Feste Breite (für Listen)

## ⚡ Häufige Patterns

### Dashboard-Karten
```tsx
<Card>
  <CardHeader className="flex items-center gap-2">
    <HealthIcon metric="sleep" className="text-blue-600" />
    <h3>Schlafqualität</h3>
  </CardHeader>
  <CardContent>
    {/* Slider hier */}
  </CardContent>
</Card>
```

### Navigation
```tsx
<nav className="flex gap-4">
  <Link href="/athlete" className="flex items-center gap-2">
    <Icon name="home" />
    <span>Dashboard</span>
  </Link>
  <Link href="/athlete/checkin" className="flex items-center gap-2">
    <Icon name="add" />
    <span>Check-in</span>
  </Link>
</nav>
```

### Gamification
```tsx
<div className="flex items-center gap-2">
  <Icon name="fire" className="text-orange-500" />
  <span className="font-bold">5 Tage Streak!</span>
  <Icon name="trophy" className="text-yellow-500" />
</div>
```

## 🔧 Debugging

Falls Icons nicht angezeigt werden:
1. Prüfe ob Font Awesome Kit geladen ist (DevTools → Network)
2. Verwende korrekte Klassen: `fa-solid fa-{icon}`
3. Prüfe Icon-Name in der Map (icon.tsx)
4. Cache leeren und neu laden

## 🎯 Best Practices

1. **Konsistenz**: Gleiche Icons für gleiche Aktionen
2. **Farben**: Verwende Tailwind-Farbklassen
3. **Größen**: Mobile-first (mindestens 44px Touch-Target)
4. **Semantik**: aria-label für Accessibility
5. **Performance**: Keine inline styles verwenden

---
**Kit ID**: ee524abbd1  
**Version**: Font Awesome 6