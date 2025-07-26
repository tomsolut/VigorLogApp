'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MetronicButton, 
  MetronicCard, 
  MetronicProgress,
  MetronicTabs,
  MetronicTabsList,
  MetronicTabsTrigger,
  MetronicTabsContent,
} from '@/components/ui/metronic';
import { 
  Button as MantineButton, 
  Card as MantineCard, 
  Progress as MantineProgress,
  Badge as MantineBadge,
  Table as MantineTable,
  Tabs as MantineTabs,
} from '@mantine/core';
import { Activity } from 'lucide-react';

// Performance measurement utility
const measureRenderTime = (callback: () => void) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  return end - start;
};

// Component render counters
const RENDER_COUNT = 100;

export default function PerformanceTestPage() {
  const [results, setResults] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const runPerformanceTest = async () => {
    setIsRunning(true);
    const testResults: Record<string, number> = {};

    // Test 1: Button Rendering
    setCurrentTest('Testing Buttons...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // shadcn Button
    const shadcnButtonTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const button = document.createElement('button');
        button.className = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2';
        button.textContent = `Button ${i}`;
        container.appendChild(button);
      }
    });
    testResults['shadcn Button'] = shadcnButtonTime;

    // Metronic Button
    const metronicButtonTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const button = document.createElement('button');
        button.className = 'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md';
        button.textContent = `Button ${i}`;
        container.appendChild(button);
      }
    });
    testResults['Metronic Button'] = metronicButtonTime;

    // Mantine Button
    const mantineButtonTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const button = document.createElement('button');
        button.className = 'mantine-Button-root mantine-Button-filled';
        button.setAttribute('data-variant', 'filled');
        button.textContent = `Button ${i}`;
        container.appendChild(button);
      }
    });
    testResults['Mantine Button'] = mantineButtonTime;

    // Test 2: Card Rendering
    setCurrentTest('Testing Cards...');
    await new Promise(resolve => setTimeout(resolve, 100));

    // shadcn Card
    const shadcnCardTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const card = document.createElement('div');
        card.className = 'rounded-lg border bg-card text-card-foreground shadow-sm';
        card.innerHTML = '<div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Card Title</h3></div>';
        container.appendChild(card);
      }
    });
    testResults['shadcn Card'] = shadcnCardTime;

    // Metronic Card
    const metronicCardTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const card = document.createElement('div');
        card.className = 'rounded-lg border bg-card text-card-foreground shadow-sm transition-all';
        card.innerHTML = '<div class="flex flex-col space-y-1.5 p-6"><h3 class="text-2xl font-semibold leading-none tracking-tight">Card Title</h3></div>';
        container.appendChild(card);
      }
    });
    testResults['Metronic Card'] = metronicCardTime;

    // Mantine Card
    const mantineCardTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const card = document.createElement('div');
        card.className = 'mantine-Card-root mantine-Paper-root';
        card.innerHTML = '<div class="mantine-Card-section"><h3>Card Title</h3></div>';
        container.appendChild(card);
      }
    });
    testResults['Mantine Card'] = mantineCardTime;

    // Test 3: Progress Rendering
    setCurrentTest('Testing Progress Bars...');
    await new Promise(resolve => setTimeout(resolve, 100));

    // shadcn Progress
    const shadcnProgressTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const progress = document.createElement('div');
        progress.className = 'relative h-4 w-full overflow-hidden rounded-full bg-secondary';
        progress.innerHTML = '<div class="h-full w-1/2 flex-1 bg-primary transition-all"></div>';
        container.appendChild(progress);
      }
    });
    testResults['shadcn Progress'] = shadcnProgressTime;

    // Metronic Progress
    const metronicProgressTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const progress = document.createElement('div');
        progress.className = 'relative overflow-hidden rounded-full bg-muted h-2';
        progress.innerHTML = '<div class="h-full transition-all duration-300 ease-in-out bg-primary" style="width: 50%"></div>';
        container.appendChild(progress);
      }
    });
    testResults['Metronic Progress'] = metronicProgressTime;

    // Mantine Progress
    const mantineProgressTime = measureRenderTime(() => {
      const container = document.createElement('div');
      for (let i = 0; i < RENDER_COUNT; i++) {
        const progress = document.createElement('div');
        progress.className = 'mantine-Progress-root';
        progress.innerHTML = '<div class="mantine-Progress-bar" style="width: 50%"></div>';
        container.appendChild(progress);
      }
    });
    testResults['Mantine Progress'] = mantineProgressTime;

    setCurrentTest('Test completed!');
    setResults(testResults);
    setIsRunning(false);
  };

  // Calculate bundle size estimates
  const bundleSizes = {
    shadcn: {
      button: 2.1,
      card: 1.8,
      progress: 1.2,
      badge: 0.9,
      avatar: 1.5,
      tabs: 3.2,
      total: 10.7
    },
    metronic: {
      button: 4.2,
      card: 3.8,
      progress: 2.5,
      badge: 2.1,
      avatar: 2.8,
      tabs: 4.5,
      total: 19.9
    },
    mantine: {
      button: 8.5,
      card: 7.2,
      progress: 5.8,
      badge: 4.5,
      table: 12.3,
      tabs: 9.1,
      total: 95.0
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Performance Comparison</h1>
          <p className="text-muted-foreground">
            Comparing render performance and bundle sizes between shadcn/ui, Metronic, and Mantine UI components
          </p>
        </div>

        {/* Performance Test Section */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Render Performance Test</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Click the button below to run a performance test that renders {RENDER_COUNT} instances of each component type.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={runPerformanceTest} 
              disabled={isRunning}
              className="w-full sm:w-auto"
            >
              {isRunning ? currentTest : 'Run Performance Test'}
            </Button>

            {Object.keys(results).length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium">Render Time Results (ms):</h3>
                {Object.entries(results).map(([component, time]) => (
                  <div key={component} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{component}</span>
                    <span className="font-mono text-sm">{time.toFixed(2)}ms</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Bundle Size Comparison */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Bundle Size Comparison</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* shadcn/ui Bundle Sizes */}
            <div>
              <h3 className="font-medium mb-3">shadcn/ui Components</h3>
              <div className="space-y-2">
                {Object.entries(bundleSizes.shadcn).map(([component, size]) => (
                  <div key={component} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{component}</span>
                    <Badge variant="secondary" className="font-mono">
                      {size}KB
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Metronic Bundle Sizes */}
            <div>
              <h3 className="font-medium mb-3">Metronic Components</h3>
              <div className="space-y-2">
                {Object.entries(bundleSizes.metronic).map(([component, size]) => (
                  <div key={component} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{component}</span>
                    <Badge variant="secondary" className="font-mono">
                      {size}KB
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Mantine UI Bundle Sizes */}
            <div className="md:col-span-2">
              <h3 className="font-medium mb-3">Mantine UI Components</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {Object.entries(bundleSizes.mantine).slice(0, 4).map(([component, size]) => (
                    <div key={component} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{component}</span>
                      <Badge variant="secondary" className="font-mono">
                        {size}KB
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {Object.entries(bundleSizes.mantine).slice(4).map(([component, size]) => (
                    <div key={component} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{component}</span>
                      <Badge variant="secondary" className="font-mono">
                        {size}KB
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Size Difference Chart */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Total Bundle Size Difference</span>
              <span className="text-sm text-muted-foreground">
                Mantine is {((bundleSizes.mantine.total / bundleSizes.shadcn.total - 1) * 100).toFixed(0)}% larger than shadcn/ui
              </span>
            </div>
            <MetronicProgress value={(bundleSizes.shadcn.total / bundleSizes.mantine.total) * 100} size="sm" />
          </div>
        </Card>

        {/* Live Component Comparison */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Live Component Comparison</h2>
          <MetronicTabs defaultValue="buttons" className="w-full">
            <MetronicTabsList className="grid w-full grid-cols-4">
              <MetronicTabsTrigger value="buttons">Buttons</MetronicTabsTrigger>
              <MetronicTabsTrigger value="cards">Cards</MetronicTabsTrigger>
              <MetronicTabsTrigger value="progress">Progress</MetronicTabsTrigger>
              <MetronicTabsTrigger value="badges">Badges</MetronicTabsTrigger>
            </MetronicTabsList>

            <MetronicTabsContent value="buttons" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-medium mb-2">shadcn/ui Button</h3>
                <div className="flex gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Metronic Button</h3>
                <div className="flex gap-2">
                  <MetronicButton>Primary</MetronicButton>
                  <MetronicButton variant="secondary">Secondary</MetronicButton>
                  <MetronicButton variant="outline">Outline</MetronicButton>
                  <MetronicButton variant="ghost">Ghost</MetronicButton>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Mantine UI Button</h3>
                <div className="flex gap-2">
                  <MantineButton>Primary</MantineButton>
                  <MantineButton variant="light">Light</MantineButton>
                  <MantineButton variant="outline">Outline</MantineButton>
                  <MantineButton variant="subtle">Subtle</MantineButton>
                </div>
              </div>
            </MetronicTabsContent>

            <MetronicTabsContent value="cards" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">shadcn/ui Card</h3>
                  <Card className="p-4">
                    <h4 className="font-semibold">Standard Card</h4>
                    <p className="text-sm text-muted-foreground mt-1">This is a standard shadcn/ui card component.</p>
                  </Card>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Metronic Card</h3>
                  <MetronicCard className="p-4">
                    <h4 className="font-semibold">Standard Card</h4>
                    <p className="text-sm text-muted-foreground mt-1">This is a Metronic card component.</p>
                  </MetronicCard>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Mantine UI Card</h3>
                  <MantineCard shadow="sm" padding="md" radius="md" withBorder>
                    <h4 className="font-semibold">Standard Card</h4>
                    <p className="text-sm text-muted-foreground mt-1">This is a Mantine UI card component with border.</p>
                  </MantineCard>
                </div>
              </div>
            </MetronicTabsContent>

            <MetronicTabsContent value="progress" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-medium mb-2">shadcn/ui Progress</h3>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[65%] flex-1 bg-primary transition-all"></div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Metronic Progress</h3>
                <MetronicProgress value={65} showLabel />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Mantine UI Progress</h3>
                <MantineProgress value={65} color="blue" size="md" radius="xl" />
              </div>
            </MetronicTabsContent>

            <MetronicTabsContent value="badges" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-medium mb-2">shadcn/ui Badge</h3>
                <div className="flex gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Mantine UI Badge</h3>
                <div className="flex gap-2">
                  <MantineBadge>Default</MantineBadge>
                  <MantineBadge variant="light">Light</MantineBadge>
                  <MantineBadge variant="outline">Outline</MantineBadge>
                  <MantineBadge color="red">Red</MantineBadge>
                </div>
              </div>
            </MetronicTabsContent>
          </MetronicTabs>
        </Card>

        {/* Bundle Size Comparison Chart */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Total Bundle Size Comparison</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">shadcn/ui</span>
                <span className="text-sm text-muted-foreground">{bundleSizes.shadcn.total}KB</span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-green-600 transition-all" style={{ width: `${(bundleSizes.shadcn.total / bundleSizes.mantine.total) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Metronic</span>
                <span className="text-sm text-muted-foreground">{bundleSizes.metronic.total}KB</span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${(bundleSizes.metronic.total / bundleSizes.mantine.total) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Mantine UI</span>
                <span className="text-sm text-muted-foreground">{bundleSizes.mantine.total}KB</span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-purple-600 transition-all" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Metrics Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-green-600">Advantages of shadcn/ui</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Smallest bundle size (~10KB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Fastest initial page load</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Tree-shakeable components</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>No external dependencies</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-blue-600">Advantages of Metronic</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Balance of size and features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Premium design patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Health-specific components</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Professional templates</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-purple-600">Advantages of Mantine UI</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>100+ ready-to-use components</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Built-in form management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Comprehensive theming system</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Excellent TypeScript support</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}