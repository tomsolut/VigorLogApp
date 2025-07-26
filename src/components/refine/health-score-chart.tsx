'use client';

import { LineChart } from '@mantine/charts';
import { Card, Title, Text } from '@mantine/core';

const data = [
  { date: 'Mo', score: 85, sleep: 8, mood: 4 },
  { date: 'Di', score: 88, sleep: 7.5, mood: 4.5 },
  { date: 'Mi', score: 82, sleep: 6.5, mood: 3.5 },
  { date: 'Do', score: 90, sleep: 8.5, mood: 5 },
  { date: 'Fr', score: 87, sleep: 7, mood: 4 },
  { date: 'Sa', score: 92, sleep: 9, mood: 5 },
  { date: 'So', score: 89, sleep: 8, mood: 4.5 },
];

export function HealthScoreChart() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} mb="md">Health Score Trend</Title>
      <Text size="sm" c="dimmed" mb="lg">
        Wöchentliche Entwicklung der Gesundheitsmetriken
      </Text>
      
      <LineChart
        h={300}
        data={data}
        dataKey="date"
        series={[
          { name: 'score', color: 'green', label: 'Health Score' },
          { name: 'mood', color: 'blue', label: 'Stimmung (x10)' },
        ]}
        withLegend
        legendProps={{ verticalAlign: 'bottom' }}
        curveType="bump"
        gridProps={{ strokeDasharray: '3 3' }}
        withDots
        dotProps={{ r: 4 }}
        activeDotProps={{ r: 6 }}
        valueFormatter={(value) => `${value}`}
      />
    </Card>
  );
}