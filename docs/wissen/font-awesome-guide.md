# Font Awesome 6 - Wissensdatenbank für VigorLog

## 📚 Übersicht

Font Awesome ist eine Icon-Bibliothek mit über 2.000 kostenlosen Icons und über 16.000 Pro-Icons. Für VigorLog nutzen wir Font Awesome Kit (ID: `ee524abbd1`).

**Offizielle Dokumentation:** https://docs.fontawesome.com/

## 🎯 Wichtige Sport-Icons für VigorLog

### Korrekte Sport-Icons (Font Awesome 6)

```javascript
// Ballsportarten
'fa-solid fa-futbol'          // Fußball (nicht fa-football-ball!)
'fa-solid fa-basketball'      // Basketball  
'fa-solid fa-baseball'        // Baseball
'fa-solid fa-football'        // American Football
'fa-solid fa-volleyball'      // Volleyball
'fa-solid fa-bowling-ball'    // Bowling
'fa-solid fa-golf-ball-tee'   // Golf
'fa-solid fa-tennis-ball'     // Tennis
'fa-solid fa-racquet'         // Squash/Racquet Sports
'fa-solid fa-table-tennis-paddle-ball' // Tischtennis

// Einzelsportarten
'fa-solid fa-person-running'  // Laufen (nicht fa-running!)
'fa-solid fa-person-swimming' // Schwimmen (nicht fa-swimmer!)
'fa-solid fa-person-biking'   // Radfahren
'fa-solid fa-person-skiing'   // Ski
'fa-solid fa-person-snowboarding' // Snowboard
'fa-solid fa-person-skating'  // Eislaufen

// Weitere Sportarten
'fa-solid fa-dumbbell'        // Krafttraining
'fa-solid fa-weight-hanging'  // Gewichtheben
'fa-solid fa-stopwatch-20'    // Zeitmessung/Sprint
```

## 🏥 Gesundheits- und Medizin-Icons

```javascript
// Gesundheitsmetriken
'fa-solid fa-heart-pulse'     // Herzfrequenz (besser als fa-heartbeat)
'fa-solid fa-bed'             // Schlaf
'fa-solid fa-battery-quarter' // Energie/Müdigkeit
'fa-solid fa-face-smile'      // Stimmung gut
'fa-solid fa-face-frown'      // Stimmung schlecht
'fa-solid fa-brain'           // Mental/Stress
'fa-solid fa-lungs'           // Atmung

// Medizinische Icons
'fa-solid fa-stethoscope'     // Stethoskop
'fa-solid fa-user-doctor'     // Arzt
'fa-solid fa-syringe'         // Spritze/Impfung
'fa-solid fa-pills'           // Medikamente
'fa-solid fa-thermometer'     // Temperatur
'fa-solid fa-band-aid'        // Pflaster/Verletzung

// Warnung & Schmerz
'fa-solid fa-triangle-exclamation' // Warnung (nicht fa-exclamation-triangle!)
'fa-solid fa-bolt'            // Schmerz (Blitz)
'fa-solid fa-fire-flame-curved' // Entzündung
```

## 👥 Benutzerrollen-Icons

```javascript
// VigorLog Rollen
'fa-solid fa-person-running'  // Athlet
'fa-solid fa-whistle'         // Trainer
'fa-solid fa-people-group'    // Eltern (besser als fa-users)
'fa-solid fa-user-shield'     // Admin
'fa-solid fa-user-nurse'      // Medizinisches Personal

// Zusätzliche Rollen
'fa-solid fa-chalkboard-user' // Lehrer/Ausbilder
'fa-solid fa-clipboard-user'  // Betreuer
```

## 📊 Daten & Analytics Icons

```javascript
// Charts & Graphen
'fa-solid fa-chart-line'      // Liniendiagramm
'fa-solid fa-chart-column'    // Säulendiagramm (nicht fa-chart-bar!)
'fa-solid fa-chart-pie'       // Tortendiagramm
'fa-solid fa-arrow-trend-up'  // Trend aufwärts
'fa-solid fa-arrow-trend-down' // Trend abwärts

// Kalender & Zeit
'fa-solid fa-calendar-days'   // Kalender
'fa-solid fa-calendar-check'  // Erledigte Tage
'fa-solid fa-clock'           // Uhrzeit
'fa-solid fa-hourglass-half'  // Zeit läuft
```

## 🏆 Gamification & Achievements

```javascript
// Erfolge & Belohnungen
'fa-solid fa-trophy'          // Trophäe
'fa-solid fa-medal'           // Medaille
'fa-solid fa-award'           // Auszeichnung
'fa-solid fa-star'            // Stern
'fa-solid fa-fire-flame-curved' // Streak/Serie
'fa-solid fa-ranking-star'    // Ranking

// Level & Fortschritt
'fa-solid fa-certificate'     // Zertifikat
'fa-solid fa-graduation-cap'  // Abschluss
'fa-solid fa-bullseye'        // Ziel erreicht
```

## ⚙️ Icon-Modifikatoren

### Größen
```html
<i class="fa-solid fa-futbol fa-xs"></i>  <!-- Extra klein -->
<i class="fa-solid fa-futbol fa-sm"></i>  <!-- Klein -->
<i class="fa-solid fa-futbol fa-lg"></i>  <!-- Groß -->
<i class="fa-solid fa-futbol fa-xl"></i>  <!-- Extra groß -->
<i class="fa-solid fa-futbol fa-2xl"></i> <!-- 2x groß -->
```

### Animationen
```html
<i class="fa-solid fa-spinner fa-spin"></i>      <!-- Rotation -->
<i class="fa-solid fa-heart fa-beat"></i>        <!-- Herzschlag -->
<i class="fa-solid fa-bell fa-shake"></i>        <!-- Schütteln -->
<i class="fa-solid fa-star fa-spin-pulse"></i>   <!-- Pulsieren -->
<i class="fa-solid fa-fire fa-fade"></i>         <!-- Ein/Ausblenden -->
```

### Transformationen
```html
<i class="fa-solid fa-futbol fa-rotate-90"></i>   <!-- 90° drehen -->
<i class="fa-solid fa-futbol fa-rotate-180"></i>  <!-- 180° drehen -->
<i class="fa-solid fa-futbol fa-rotate-270"></i>  <!-- 270° drehen -->
<i class="fa-solid fa-futbol fa-flip-horizontal"></i> <!-- Horizontal spiegeln -->
<i class="fa-solid fa-futbol fa-flip-vertical"></i>   <!-- Vertikal spiegeln -->
```

## 🎨 Styling mit CSS/Tailwind

### Farben (Tailwind)
```html
<i class="fa-solid fa-heart text-red-500"></i>
<i class="fa-solid fa-futbol text-green-600"></i>
<i class="fa-solid fa-trophy text-yellow-500"></i>
```

### Kombinationen
```html
<!-- Gefülltes Icon mit Rand -->
<span class="relative">
  <i class="fa-solid fa-circle text-blue-500"></i>
  <i class="fa-solid fa-trophy text-white absolute inset-0"></i>
</span>

<!-- Icon in Button -->
<button class="flex items-center gap-2">
  <i class="fa-solid fa-plus"></i>
  <span>Hinzufügen</span>
</button>
```

## 🔧 Best Practices für VigorLog

### 1. Konsistente Icon-Verwendung
```javascript
// RICHTIG: Font Awesome 6 Syntax
const icons = {
  football: 'fa-solid fa-futbol',      // nicht fa-football-ball
  running: 'fa-solid fa-person-running', // nicht fa-running
  chart: 'fa-solid fa-chart-line',     // konsistent für Liniendiagramme
}

// FALSCH: Alte/inkonsistente Syntax
const badIcons = {
  football: 'fas fa-football-ball',    // Font Awesome 5 Syntax
  running: 'fa fa-running',            // Veraltete Klasse
  chart: 'fa-solid fa-chart-bar',      // Inkonsistent wenn Linien gemeint
}
```

### 2. Semantische Icon-Auswahl
- **Schlaf**: `fa-bed` (nicht fa-moon)
- **Energie**: `fa-battery-*` Serie für verschiedene Level
- **Warnung**: `fa-triangle-exclamation` für Gesundheitswarnungen
- **Erfolg**: `fa-circle-check` (nicht fa-check)

### 3. Accessibility
```html
<!-- Mit aria-label für Screenreader -->
<i class="fa-solid fa-futbol" aria-label="Fußball"></i>

<!-- Als dekoratives Element -->
<i class="fa-solid fa-star" aria-hidden="true"></i>
<span class="sr-only">5 Sterne Bewertung</span>
```

### 4. Performance-Optimierung
- Kit verwendet SVG-Core für bessere Performance
- Icons werden on-demand geladen
- Subset nur benötigte Icons in Produktion

## 📱 Mobile Optimierung

### Touch-Targets (44px minimum)
```html
<button class="p-3 min-w-[44px] min-h-[44px]">
  <i class="fa-solid fa-plus text-xl"></i>
</button>
```

### Responsive Icons
```html
<i class="fa-solid fa-trophy text-lg md:text-xl lg:text-2xl"></i>
```

## 🚨 Häufige Fehler vermeiden

1. **Veraltete Icon-Namen**: Viele Icons wurden in v6 umbenannt
2. **Falsche Prefix**: `fa-solid`, `fa-regular`, `fa-brands` verwenden
3. **Fehlende Klassen**: Immer beide Klassen: `fa-solid fa-{iconname}`
4. **Größen-Probleme**: Mobile Touch-Targets beachten

## 📚 Weiterführende Ressourcen

- **Icon-Suche**: https://fontawesome.com/search
- **Cheatsheet**: https://fontawesome.com/cheatsheet
- **Accessibility**: https://fontawesome.com/docs/web/dig-deeper/accessibility
- **React Integration**: https://fontawesome.com/docs/web/use-with/react

## 🔄 Migration von Lucide zu Font Awesome

| Lucide React | Font Awesome 6 |
|--------------|----------------|
| `<Running />` | `<i class="fa-solid fa-person-running"></i>` |
| `<Heart />` | `<i class="fa-solid fa-heart"></i>` |
| `<Users />` | `<i class="fa-solid fa-people-group"></i>` |
| `<Settings />` | `<i class="fa-solid fa-gear"></i>` |
| `<ChartLine />` | `<i class="fa-solid fa-chart-line"></i>` |

---

**Letzte Aktualisierung**: 25.07.2025  
**Font Awesome Version**: 6.x  
**Kit ID**: ee524abbd1