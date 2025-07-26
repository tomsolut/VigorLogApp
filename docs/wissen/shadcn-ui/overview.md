# shadcn/ui Übersicht

## Was ist shadcn/ui?

shadcn/ui ist **keine traditionelle Komponentenbibliothek**. Stattdessen ist es eine Sammlung von wiederverwendbaren Komponenten, die man direkt in sein Projekt kopiert. Dies bietet vollständige Kontrolle über den Code.

## Kernphilosophie

### 1. Open Code Philosophy
- **Volle Transparenz**: Du siehst genau, wie jede Komponente gebaut ist
- **Einfache Anpassung**: Modifiziere jeden Teil einer Komponente nach deinen Bedürfnissen
- **AI-Integration**: Der offene Code macht es für LLMs einfach, deine Komponenten zu verstehen und zu verbessern

### 2. Composable Interface
Jede Komponente teilt eine gemeinsame, komponierbare Schnittstelle:
- **Vorhersagbar**: Für dein Team und AI-Tools
- **Konsistent**: Keine unterschiedlichen APIs für verschiedene Komponenten
- **Erweiterbar**: Einfache Erweiterung und Kombination

### 3. Code Distribution System
shadcn/ui definiert:
- **Schema**: Eine flache Dateistruktur für Komponenten und deren Abhängigkeiten
- **CLI**: Ein Kommandozeilen-Tool zur Verteilung über verschiedene Frameworks

## Technologie-Stack

- **Tailwind CSS**: Für Styling
- **Radix UI**: Für zugängliche, ungestylte Komponenten
- **TypeScript**: Erste-Klasse TypeScript-Unterstützung
- **React**: Als primäres Framework

## Unterstützte Frameworks

- Next.js (empfohlen)
- Gatsby
- Remix
- Astro
- Laravel
- Vite
- Manuelle Integration für andere Technologien möglich

## Vorteile

### Beautiful Defaults
- Sorgfältig ausgewählte Standard-Styles
- Konsistentes Design-System
- Sofort einsatzbereit

### AI-Ready Design
- Einfach für AI-Tools zu verstehen
- Konsistente API für automatisierte Generierung
- Optimiert für Code-Completion

### Minimale Bundle-Größe
- Nur die benötigten Komponenten
- Kein unnötiger Code
- CSS-in-JS frei

## Installation

```bash
# Projekt initialisieren
npx shadcn-ui@latest init

# Komponente hinzufügen
npx shadcn-ui@latest add button
```

## Verfügbare Ressourcen

- **48+ Komponenten**: Von Accordion bis Table
- **Blocks**: Vorgefertigte Seitenlayouts
- **Lift Mode**: Einzelne Komponenten aus Blocks extrahieren
- **Themes**: Anpassbare Design-Systeme

## Vertraut von

OpenAI, Sonos, Adobe und vielen anderen führenden Unternehmen.

## Weiterführende Links

- [Offizielle Dokumentation](https://ui.shadcn.com/docs)
- [Komponenten-Übersicht](https://ui.shadcn.com/docs/components)
- [GitHub Repository](https://github.com/shadcn-ui/ui)