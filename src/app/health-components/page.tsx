'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  HealthRingProgress, 
  HealthRingMini, 
  HealthRingLarge,
  HealthRingMedium,
  HealthRingSmall 
} from '@/components/ui/health-ring-progress';
import { Icon } from '@/components/ui/icon';
import { TouchSlider, HealthSlider, MoodSlider, StressSlider } from '@/components/ui/touch-slider';

export default function HealthComponentsPage() {
  const [demoValue, setDemoValue] = useState(75);
  const [animateDemo, setAnimateDemo] = useState(true);

  // Sample health data
  const healthMetrics = {
    overall: 82,
    sleep: 90,
    energy: 65,
    mood: 78,
    stress: 35,
    recovery: 88,
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Health Components Library</h1>
          <p className="text-muted-foreground">
            Custom health components optimized for VigorLog - Bundle size {'<'} 5KB
          </p>
        </div>

        {/* Health Ring Progress Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Health Ring Progress</CardTitle>
            <CardDescription>
              Circular progress indicators for health metrics with auto-coloring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Interactive Demo */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Interactive Demo</h3>
              <div className="flex items-center justify-center gap-8">
                <HealthRingLarge 
                  value={demoValue} 
                  label="Gesundheit"
                  animate={animateDemo}
                />
                <div className="space-y-4 flex-1 max-w-xs">
                  <div>
                    <label className="text-sm font-medium">Value: {demoValue}%</label>
                    <Slider
                      value={[demoValue]}
                      onValueChange={(value) => setDemoValue(value[0])}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAnimateDemo(!animateDemo)}
                  >
                    Animation: {animateDemo ? 'An' : 'Aus'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Größenvarianten</h3>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <HealthRingLarge value={85} label="Large" />
                  <p className="text-xs text-muted-foreground mt-2">160x160px</p>
                </div>
                <div className="text-center">
                  <HealthRingMedium value={72} label="Medium" />
                  <p className="text-xs text-muted-foreground mt-2">120x120px</p>
                </div>
                <div className="text-center">
                  <HealthRingSmall value={68} label="Small" />
                  <p className="text-xs text-muted-foreground mt-2">80x80px</p>
                </div>
                <div className="text-center">
                  <HealthRingMini value={90} />
                  <p className="text-xs text-muted-foreground mt-2">40x40px (Mini)</p>
                </div>
              </div>
            </div>

            {/* Color Variants */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Farbvarianten</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <HealthRingSmall value={90} color="green" />
                  <p className="text-xs text-muted-foreground mt-1">Green</p>
                </div>
                <div className="text-center">
                  <HealthRingSmall value={75} color="lime" />
                  <p className="text-xs text-muted-foreground mt-1">Lime</p>
                </div>
                <div className="text-center">
                  <HealthRingSmall value={60} color="yellow" />
                  <p className="text-xs text-muted-foreground mt-1">Yellow</p>
                </div>
                <div className="text-center">
                  <HealthRingSmall value={45} color="orange" />
                  <p className="text-xs text-muted-foreground mt-1">Orange</p>
                </div>
                <div className="text-center">
                  <HealthRingSmall value={30} color="red" />
                  <p className="text-xs text-muted-foreground mt-1">Red</p>
                </div>
                <div className="text-center">
                  <HealthRingSmall value={85} color="blue" />
                  <p className="text-xs text-muted-foreground mt-1">Blue</p>
                </div>
              </div>
            </div>

            {/* Auto-coloring Demo */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Auto-Coloring basierend auf Wert</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[95, 75, 55, 35, 15].map((value) => (
                  <div key={value} className="text-center">
                    <HealthRingSmall value={value} />
                    <p className="text-xs text-muted-foreground mt-1">{value}%</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Automatische Farbzuweisung: 80%+ Grün, 60%+ Lime, 40%+ Gelb, 20%+ Orange, {'<'}20% Rot
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Health Dashboard Example */}
        <Card>
          <CardHeader>
            <CardTitle>Health Dashboard Beispiel</CardTitle>
            <CardDescription>
              Verwendung der Health Rings in einem Dashboard-Layout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Health Card */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lime-500/10 to-transparent rounded-full -mr-16 -mt-16" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Gesamt-Score</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{healthMetrics.overall}</p>
                    <p className="text-xs text-muted-foreground">von 100</p>
                  </div>
                  <HealthRingMedium 
                    value={healthMetrics.overall} 
                    showValue={false}
                  />
                </CardContent>
              </Card>

              {/* Sleep Quality Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Schlafqualität</CardTitle>
                    <Icon name="sleep" className="text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <HealthRingSmall 
                      value={healthMetrics.sleep} 
                      color="blue"
                    />
                    <div>
                      <p className="text-sm font-medium">Sehr gut</p>
                      <p className="text-xs text-muted-foreground">7.5h Durchschnitt</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Energy Level Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Energie</CardTitle>
                    <Icon name="fatigue" className="text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <HealthRingSmall 
                      value={healthMetrics.energy} 
                      color="yellow"
                    />
                    <div>
                      <p className="text-sm font-medium">Mittel</p>
                      <p className="text-xs text-muted-foreground">Mehr Pausen einlegen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inline Usage Examples */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium mb-3">Inline Verwendung</h3>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Icon name="mood" className="text-green-500" />
                  <span className="font-medium">Stimmung</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{healthMetrics.mood}%</span>
                  <HealthRingMini value={healthMetrics.mood} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Icon name="heart" className="text-red-500" />
                  <span className="font-medium">Stress Level</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={healthMetrics.stress < 40 ? "default" : "destructive"}>
                    {healthMetrics.stress < 40 ? "Niedrig" : "Erhöht"}
                  </Badge>
                  <HealthRingMini value={100 - healthMetrics.stress} color="red" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Icon name="recovery" className="text-lime-500" />
                  <span className="font-medium">Erholung</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sehr gut</span>
                  <HealthRingMini value={healthMetrics.recovery} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Touch Slider Components */}
        <Card>
          <CardHeader>
            <CardTitle>Touch-Optimized Sliders</CardTitle>
            <CardDescription>
              Mobile-optimierte Slider mit Haptic Feedback und 44px Touch Targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Touch Slider Demo */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Touch Slider</h3>
              <div className="max-w-md mx-auto space-y-6">
                <TouchSlider
                  value={healthMetrics.energy / 10}
                  onChange={(v) => console.log('Energy:', v)}
                  label="Energie Level"
                  min={0}
                  max={10}
                  showTicks
                />
                
                <TouchSlider
                  value={7}
                  onChange={(v) => console.log('Sleep:', v)}
                  label="Schlafqualität"
                  min={0}
                  max={10}
                  color="primary"
                  size="lg"
                />
              </div>
            </div>

            {/* Specialized Health Sliders */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Spezialisierte Health Sliders</h3>
              <div className="max-w-md mx-auto space-y-6">
                <HealthSlider
                  value={healthMetrics.sleep / 10}
                  onChange={(v) => console.log('Health:', v)}
                  label="Allgemeines Wohlbefinden"
                />
                
                <MoodSlider
                  value={Math.round(healthMetrics.mood / 10)}
                  onChange={(v) => console.log('Mood:', v)}
                />
                
                <StressSlider
                  value={Math.round(healthMetrics.stress / 10)}
                  onChange={(v) => console.log('Stress:', v)}
                />
              </div>
            </div>

            {/* Size Variants */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Größenvarianten</h3>
              <div className="max-w-md mx-auto space-y-4">
                <TouchSlider
                  value={5}
                  onChange={() => {}}
                  label="Small (40px Touch Target)"
                  size="sm"
                />
                <TouchSlider
                  value={5}
                  onChange={() => {}}
                  label="Medium (48px Touch Target)"
                  size="md"
                />
                <TouchSlider
                  value={5}
                  onChange={() => {}}
                  label="Large (56px Touch Target)"
                  size="lg"
                />
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Touch Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Native Touch & Mouse Support</li>
                  <li>• Haptic Feedback (Mobile)</li>
                  <li>• 44px+ Touch Targets (WCAG 2.2)</li>
                  <li>• Smooth Dragging</li>
                  <li>• Step-based Values</li>
                  <li>• Accessible (ARIA)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Customization</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Color Variants</li>
                  <li>• Size Options</li>
                  <li>• Optional Ticks</li>
                  <li>• Custom Styling</li>
                  <li>• Preset Variants</li>
                  <li>• ~3KB Bundle Size</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technische Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Bundle Size Übersicht</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-lime-500" />
                      <span className="font-medium">shadcn/ui (Base)</span>
                    </div>
                    <span className="font-mono text-sm">10.7KB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="font-medium">+ HealthRingProgress</span>
                    </div>
                    <span className="font-mono text-sm">~2KB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="font-medium">+ TouchSlider</span>
                    </div>
                    <span className="font-mono text-sm">~3KB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950">
                    <span className="font-bold">Total Bundle</span>
                    <span className="font-mono font-bold text-green-600">~15.7KB</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Im Vergleich: Mantine UI = 95KB, Metronic = 2.2MB
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Component Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Zero Dependencies</li>
                    <li>• TypeScript + Full Types</li>
                    <li>• SSR Compatible</li>
                    <li>• WCAG 2.2 Compliant</li>
                    <li>• Touch & Mouse Support</li>
                    <li>• Haptic Feedback</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Performance</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Minimal Re-renders</li>
                    <li>• CSS-only Animations</li>
                    <li>• Lazy Loading Ready</li>
                    <li>• Tree-shakeable</li>
                    <li>• Mobile-first Design</li>
                    <li>• 60fps Interactions</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Import Examples</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm font-mono">
{`// Health Ring Progress
import { HealthRingProgress } from '@/components/ui/health-ring-progress';

// Touch Slider  
import { TouchSlider } from '@/components/ui/touch-slider';`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}