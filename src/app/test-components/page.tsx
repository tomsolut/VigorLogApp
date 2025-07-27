'use client';

import { HealthRingMini, HealthRingSmall } from '@/components/ui/health-ring-progress';
import { StreakBadge } from '@/components/ui/streak-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestComponentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Test Components</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Health Rings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <HealthRingMini value={75} />
              <HealthRingSmall value={85} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Streak Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <StreakBadge count={7} />
              <StreakBadge count={30} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}