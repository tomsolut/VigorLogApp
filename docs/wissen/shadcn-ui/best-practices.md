# shadcn/ui Best Practices

## 1. Datei-Organisation

### Empfohlene Struktur
```
src/
├── components/
│   ├── ui/              # shadcn/ui Basis-Komponenten
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── shared/          # Wiederverwendbare zusammengesetzte Komponenten
│   │   └── user-card.tsx
│   └── features/        # Feature-spezifische Komponenten
│       └── dashboard-stats.tsx
```

### Wichtig
- `components/ui/` sollte als "Base UI Kit" betrachtet werden
- Komplexere Komponenten in separate Ordner
- Klare Trennung zwischen Basis-UI und Anwendungslogik

## 2. Komponenten-Updates

### Update-Prozess
```bash
# Komponente erneut hinzufügen
npx shadcn-ui@latest add button

# CLI zeigt Diff-Vergleich
# Optionen: Überschreiben oder manuelle Änderungen
```

### Best Practice
- Regelmäßig nach Updates prüfen
- Eigene Anpassungen dokumentieren
- Git für Versionskontrolle nutzen

## 3. TypeScript Integration

### Typsicherheit
```typescript
// Immer Interfaces definieren
interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

// Komponente mit korrekten Types
export function CustomButton({ 
  loading, 
  icon, 
  children, 
  ...props 
}: CustomButtonProps) {
  // Implementation
}
```

## 4. Styling-Strategien

### Tailwind-Klassen erweitern
```tsx
// Basis-Komponente erweitern
<Button className="bg-brand-500 hover:bg-brand-600">
  Custom Brand Button
</Button>

// Mit cn() für bedingte Klassen
<Button 
  className={cn(
    "transition-all duration-200",
    isActive && "ring-2 ring-offset-2"
  )}
>
  Interactive Button
</Button>
```

## 5. Accessibility

### Wichtige Punkte
- ARIA-Labels beibehalten
- Keyboard-Navigation testen
- Focus-States nicht entfernen
- Kontrast-Verhältnisse prüfen

### Beispiel
```tsx
<Button
  aria-label="Speichern und fortfahren"
  aria-busy={isLoading}
  disabled={isLoading}
>
  {isLoading ? <Spinner /> : "Speichern"}
</Button>
```

## 6. Performance-Optimierung

### Bundle-Größe minimieren
- Nur benötigte Komponenten importieren
- Tree-shaking nutzen
- Tailwind purge aktivieren

### Lazy Loading
```tsx
// Für große Komponenten
const Dialog = lazy(() => import('@/components/ui/dialog'));

// Mit Suspense
<Suspense fallback={<Loading />}>
  <Dialog />
</Suspense>
```

## 7. Komposition über Vererbung

### Empfohlenes Pattern
```tsx
// Schlecht: Vererbung
class CustomButton extends Button { }

// Gut: Komposition
export function ActionButton({ 
  variant = "default",
  size = "default",
  ...props 
}) {
  return (
    <Button 
      variant={variant} 
      size={size}
      className="gap-2"
      {...props}
    />
  );
}
```

## 8. Form-Handling

### Mit React Hook Form
```tsx
// shadcn/ui Form-Komponenten nutzen
<Form {...form}>
  <FormField
    control={form.control}
    name="username"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

## 9. Dark Mode Support

### Theme-Toggle implementieren
```tsx
// CSS-Variablen nutzen
// In globals.css definiert
// Automatisch von shadcn/ui Komponenten verwendet

// Theme-Provider verwenden
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  <App />
</ThemeProvider>
```

## 10. Testing

### Komponenten testen
```tsx
// Mit Testing Library
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Anti-Patterns zu vermeiden

1. **Keine direkten Änderungen** in `components/ui/`
2. **Keine Business-Logik** in UI-Komponenten
3. **Keine hartcodierten Werte** - nutze CSS-Variablen
4. **Vermeide !important** - nutze Tailwind-Utilities
5. **Keine inline Styles** - bleibe bei Tailwind-Klassen

## Weiterführende Ressourcen

- [shadcn/ui Examples](https://github.com/shadcn-ui/ui/tree/main/examples)
- [Community Showcases](https://github.com/birobirobiro/awesome-shadcn-ui)
- [Official Discord](https://discord.gg/shadcn)