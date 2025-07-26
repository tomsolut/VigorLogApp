# Component Migration Guide

## Migration von shadcn/ui zu Hybrid-Ansatz

### Schritt 1: Analyse bestehender Komponenten

#### Aktuelle shadcn/ui Komponenten in Verwendung:
- Alert
- Avatar  
- Badge
- Button
- Card
- Checkbox
- Dialog
- Dropdown Menu
- Form
- Input
- Label
- Select
- Separator
- Sheet
- Slider
- Switch
- Textarea
- Toast

### Schritt 2: Komponenten-Kategorisierung

#### Behalten (shadcn/ui):
- **Basis-Komponenten**: Button, Input, Label, Form
- **Layout**: Card (Basis), Separator
- **Feedback**: Toast, Alert (Basis)
- **Forms**: Checkbox, Switch, Select

#### Ergänzen/Ersetzen (Metronic oder andere):
- **Health-spezifisch**: 
  - HealthScoreCard (Metronic)
  - HealthMetricProgress (Metronic)
  - VitalSignsDisplay (Custom)
  
- **Workflows**:
  - CheckInStepper (Metronic - Mobile optimiert)
  - OnboardingFlow (Custom)
  
- **Gamification**:
  - AchievementBadge (Metronic)
  - StreakCounter (Metronic)
  - LeaderboardCard (Custom)

- **Datenvisualisierung**:
  - ProgressCharts (Chart.js/Recharts)
  - HealthTrends (Custom)
  - TeamAnalytics (Custom)

### Schritt 3: Implementierungs-Strategie

#### Phase 1: Vorbereitung (1 Woche)
```typescript
// 1. Erstelle Komponenten-Verzeichnis
src/
  components/
    ui/              // shadcn/ui Basis
    metronic/        // Metronic Komponenten
    custom/          // Eigene Komponenten
    health/          // Health-spezifisch
```

#### Phase 2: Schrittweise Migration (2-3 Wochen)
```typescript
// Beispiel: Migration von Badge zu Hybrid
// Alt (nur shadcn/ui)
import { Badge } from '@/components/ui/badge'

// Neu (Hybrid)
import { Badge } from '@/components/ui/badge' // Basis
import { AchievementBadge, StreakBadge } from '@/components/ui/metronic'
```

#### Phase 3: Testing & Optimierung (1 Woche)
- Performance-Tests nach jeder Migration
- Mobile-Testing auf echten Geräten
- A/B Tests für UX-Verbesserungen

### Schritt 4: Code-Beispiele

#### Health Score Card Migration
```typescript
// Vorher: shadcn/ui Card
<Card>
  <CardHeader>
    <CardTitle>Gesundheitsscore</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl">{score}%</div>
  </CardContent>
</Card>

// Nachher: Metronic HealthScoreCard
<HealthScoreCard 
  score={score} 
  trend={trend} 
  status={healthStatus}
  showDetails
/>
```

#### Stepper Migration
```typescript
// Vorher: Custom Implementation
<div className="steps">
  {steps.map((step, i) => (
    <div key={i} className={i === current ? 'active' : ''}>
      {step.title}
    </div>
  ))}
</div>

// Nachher: Metronic CheckInStepper
<CheckInStepper 
  onComplete={handleComplete}
  mobileOptimized
  showProgress
/>
```

### Schritt 5: Performance-Monitoring

#### Bundle Size Tracking
```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "bundle-report": "next-bundle-analyzer"
  }
}
```

#### Komponenten-Lazy-Loading
```typescript
// Für große Komponenten
const HealthDashboard = dynamic(
  () => import('@/components/health/dashboard'),
  { 
    loading: () => <DashboardSkeleton />,
    ssr: false 
  }
)
```

### Schritt 6: Dokumentation

#### Component Storybook
```typescript
// Button.stories.tsx
export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'destructive']
    }
  }
}
```

### Schritt 7: Team-Guidelines

#### Entscheidungsmatrix
| Kriterium | shadcn/ui | Metronic | Custom |
|-----------|-----------|----------|---------|
| Einfache UI | ✅ | ❌ | ❌ |
| Health-Features | ❌ | ✅ | ✅ |
| Performance-kritisch | ✅ | ⚠️ | ⚠️ |
| Komplexe Workflows | ❌ | ✅ | ✅ |

### Migration Checklist

- [ ] Komponenten-Inventar erstellen
- [ ] Performance-Baseline messen
- [ ] Test-Branch erstellen
- [ ] Komponente für Komponente migrieren
- [ ] Performance nach jeder Migration testen
- [ ] Mobile-Tests durchführen
- [ ] Dokumentation aktualisieren
- [ ] Team-Review durchführen
- [ ] Rollout-Plan erstellen