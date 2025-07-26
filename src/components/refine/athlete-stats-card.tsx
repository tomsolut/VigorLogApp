'use client';

import { Card, Group, Text, Badge, RingProgress, Stack, SimpleGrid } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';

interface AthleteStatsCardProps {
  name: string;
  healthScore: number;
  trend: number;
  lastCheckIn: string;
  status: 'active' | 'inactive' | 'injured';
}

export function AthleteStatsCard({ name, healthScore, trend, lastCheckIn, status }: AthleteStatsCardProps) {
  const getTrendIcon = () => {
    if (trend > 0) return <IconTrendingUp size={16} />;
    if (trend < 0) return <IconTrendingDown size={16} />;
    return <IconMinus size={16} />;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'green';
    if (trend < 0) return 'red';
    return 'gray';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'yellow';
      case 'injured': return 'red';
      default: return 'gray';
    }
  };

  const getHealthColor = () => {
    if (healthScore >= 80) return 'green';
    if (healthScore >= 60) return 'yellow';
    return 'red';
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="lg">{name}</Text>
        <Badge color={getStatusColor()} variant="light" size="sm">
          {status}
        </Badge>
      </Group>

      <SimpleGrid cols={2} spacing="md" mt="md">
        <Stack gap="xs" align="center">
          <Text size="xs" c="dimmed">Health Score</Text>
          <RingProgress
            size={80}
            thickness={8}
            sections={[{ value: healthScore, color: getHealthColor() }]}
            label={
              <Text size="xs" ta="center" fw={700}>
                {healthScore}%
              </Text>
            }
          />
        </Stack>

        <Stack gap="xs" justify="center">
          <Group gap="xs">
            <Text size="sm" c="dimmed">Trend:</Text>
            <Group gap={4}>
              {getTrendIcon()}
              <Text size="sm" c={getTrendColor()} fw={500}>
                {trend > 0 ? '+' : ''}{trend}%
              </Text>
            </Group>
          </Group>
          
          <Stack gap={4}>
            <Text size="xs" c="dimmed">Letzter Check-in:</Text>
            <Text size="sm">{lastCheckIn}</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Card>
  );
}