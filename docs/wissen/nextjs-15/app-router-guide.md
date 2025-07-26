# Next.js 15 App Router Guide

## Übersicht

Der App Router ist ein dateibasiertes Routing-System, das die neuesten React-Features wie Server Components, Suspense und Server Functions nutzt.

## Projektstruktur

### Basis-Struktur
```
app/
├── layout.tsx          # Root-Layout
├── page.tsx           # Homepage
├── loading.tsx        # Loading-State
├── error.tsx          # Error-Boundary
├── not-found.tsx      # 404-Seite
├── global-error.tsx   # Globaler Error-Handler
└── globals.css        # Globale Styles
```

### Routing-Konventionen

#### Ordner = Route
```
app/
├── athlete/
│   └── page.tsx       # /athlete
├── coach/
│   ├── page.tsx       # /coach
│   └── [id]/
│       └── page.tsx   # /coach/[id]
└── admin/
    └── page.tsx       # /admin
```

#### Spezielle Dateien
- `page.tsx` - Definiert die UI der Route
- `layout.tsx` - Gemeinsames Layout für Segment
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `template.tsx` - Ähnlich wie Layout, aber neu gemountet
- `default.tsx` - Fallback für Parallel Routes

## Server Components vs Client Components

### Server Components (Standard)
```tsx
// Kein "use client" - läuft auf dem Server
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  
  return <div>{/* UI */}</div>;
}
```

### Client Components
```tsx
'use client'; // Erforderlich für Client-Komponenten

import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Data Fetching

### Server-seitiges Fetching
```tsx
// Direkt in der Komponente
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // Dynamisch
    // oder
    next: { revalidate: 3600 } // ISR
  });
  
  if (!res.ok) throw new Error('Failed to fetch');
  
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* Render data */}</main>;
}
```

## Layouts

### Root Layout (Pflicht)
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
```

### Verschachtelte Layouts
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <nav>{/* Navigation */}</nav>
      <main>{children}</main>
    </div>
  );
}
```

## Route Groups

### Organisation ohne URL-Auswirkung
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx    # /login
│   └── register/
│       └── page.tsx    # /register
├── (dashboard)/
│   ├── athlete/
│   │   └── page.tsx    # /athlete
│   └── coach/
│       └── page.tsx    # /coach
```

## Dynamische Routes

### Single Dynamic Segment
```tsx
// app/blog/[slug]/page.tsx
export default function Page({ 
  params 
}: { 
  params: { slug: string } 
}) {
  return <div>Blog Post: {params.slug}</div>;
}
```

### Catch-all Segments
```tsx
// app/shop/[...categories]/page.tsx
// Matches: /shop/clothes, /shop/clothes/tops, etc.
export default function Page({ 
  params 
}: { 
  params: { categories: string[] } 
}) {
  return <div>Categories: {params.categories.join('/')}</div>;
}
```

## Metadata

### Statische Metadata
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VigorLog - Athlete Dashboard',
  description: 'Gesundheitsmonitoring für junge Athleten',
};

export default function Page() {
  return <div>Content</div>;
}
```

### Dynamische Metadata
```tsx
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  return {
    title: product.title,
    description: product.description,
  };
}
```

## Loading States

### Instant Loading States
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="spinner">Loading...</div>;
}
```

### Mit Suspense
```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

## Error Handling

### Error Boundary
```tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Parallel Routes

### Gleichzeitige Routen
```
app/
├── @team/
│   └── page.tsx
├── @analytics/
│   └── page.tsx
└── layout.tsx
```

```tsx
// layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  );
}
```

## API Routes

### Route Handlers
```tsx
// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ hello: 'world' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

## Best Practices

1. **Server Components zuerst** - Nutze Server Components wo möglich
2. **Client Components minimal** - Nur für Interaktivität
3. **Daten-Kollokation** - Fetch-Daten wo sie gebraucht werden
4. **Loading States** - Immer Loading UI bereitstellen
5. **Error Boundaries** - Fehler graceful handhaben
6. **TypeScript** - Volle TypeScript-Unterstützung nutzen

## Migration von Pages Router

```bash
# Automatisches Migrations-Tool
npx @next/codemod@latest app-dir-migration .
```

## Weiterführende Links

- [Next.js 15 Docs](https://nextjs.org/docs/app)
- [App Router Playground](https://app-router.vercel.app/)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)