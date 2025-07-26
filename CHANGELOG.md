# 📝 Changelog

All notable changes to VigorLog will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🎯 Current Sprint
- Design-System-Evaluation (Figma vs. Metronic)
- Backend-API Development
- Team Management Feature

## [0.3.0] - 2025-01-26

### ✨ Added
- Check-in-Auswahl-Modal für Athleten-Dashboard
  - Quick Check-in (30 Sekunden)
  - Detail Check-in (ausführlich)
  - Mobile-optimierte Touch-Targets
- Admin Dashboard Features
  - System-Statistiken Dashboard
  - User-Management mit erweiterten Filtern
  - Responsive Tabellen-Layout
- Wissensdatenbank unter `/docs/Wissen/`
  - shadcn/ui Dokumentation
  - Next.js 15 App Router Guide
  - GDPR Compliance Guide
- Design-System-Branches
  - `feature/figma-design-integration`
  - `feature/metronic-integration`

### 🔧 Fixed
- Icon-Überlagerung im Eltern-Dashboard Alerts
- Fehlende Icons in Team-Verwaltung
- Button-Styling-Inkonsistenz im Check-in-Modal
- Fehlender Cancel-Button im Detail-Check-in-Form

### 📚 Documentation
- Roadmap erstellt
- Changelog initialisiert
- Design-Ansätze dokumentiert
- README mit neuen Features aktualisiert

## [0.2.0] - 2025-01-20

### ✨ Added
- Trainer-Dashboard mit Team-Übersicht
- Admin-Dashboard Grundstruktur
- Font Awesome Icon-Integration
- Custom Icon-Component System
- Debug-Console für Entwicklung

### 🎨 Changed
- UI-Verbesserungen für mobile Geräte
- Optimierte Touch-Targets (44pt minimum)
- Verbesserte Farbkontraste

### 🔧 Fixed
- Responsive Design Issues
- Form-Validation Fehler
- LocalStorage Persistenz

## [0.1.0] - 2025-01-15

### ✨ Initial Release
- Basis-Architektur mit Next.js 15
- Athleten-Dashboard mit Check-in
- Eltern-Dashboard mit Übersicht
- GDPR Dual-Consent Demo
- shadcn/ui Component Integration
- Zustand State Management
- TypeScript Setup

### 🎯 Core Features
- 6 Gesundheitsmetriken Tracking
- Streak-System für Motivation
- Alert-System für kritische Werte
- Responsive Design
- Cyber-Lime Theme (#39FF14)

---

## Version Naming Convention

- **Major (X.0.0)**: Breaking changes, major feature releases
- **Minor (0.X.0)**: New features, backwards compatible
- **Patch (0.0.X)**: Bug fixes, minor improvements

## Emoji Legend

- ✨ New Feature
- 🔧 Bug Fix
- 🎨 UI/UX Change
- 📚 Documentation
- 🚀 Performance
- 🔒 Security
- ♻️ Refactoring
- 🗑️ Deprecation
- 🎯 Current Focus