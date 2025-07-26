'use client';

import { BarChart, PieChart } from '@mantine/charts';
import { Card, Grid, Title, Text, SimpleGrid, Paper, Group, Badge } from '@mantine/core';
import { IconUsers, IconTrendingUp, IconActivity, IconAlertCircle } from '@tabler/icons-react';

const teamHealthData = [
  { team: 'FC VigorLog', avgScore: 85, athletes: 12 },
  { team: 'SC Fitness', avgScore: 78, athletes: 8 },
  { team: 'TV Health', avgScore: 82, athletes: 10 },
  { team: 'Run Club', avgScore: 90, athletes: 15 },
];

const statusDistribution = [
  { name: 'Aktiv', value: 35, color: 'green' },
  { name: 'Inaktiv', value: 8, color: 'yellow' },
  { name: 'Verletzt', value: 3, color: 'red' },
];

const weeklyCheckIns = [
  { day: 'Mo', checkIns: 42 },
  { day: 'Di', checkIns: 38 },
  { day: 'Mi', checkIns: 45 },
  { day: 'Do', checkIns: 41 },
  { day: 'Fr', checkIns: 36 },
  { day: 'Sa', checkIns: 28 },
  { day: 'So', checkIns: 25 },
];

export function TeamAnalytics() {
  return (
    <div>
      <Title order={4} mb="lg">Team Analytics Dashboard</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        <Paper shadow="xs" p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                Gesamte Athleten
              </Text>
              <Text fw={700} size="xl">
                46
              </Text>
            </div>
            <IconUsers size={24} color="var(--mantine-color-blue-6)" />
          </Group>
        </Paper>

        <Paper shadow="xs" p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                Avg. Health Score
              </Text>
              <Text fw={700} size="xl">
                83.8%
              </Text>
            </div>
            <IconActivity size={24} color="var(--mantine-color-green-6)" />
          </Group>
        </Paper>

        <Paper shadow="xs" p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                Wachstum (Monat)
              </Text>
              <Text fw={700} size="xl" c="green">
                +12%
              </Text>
            </div>
            <IconTrendingUp size={24} color="var(--mantine-color-green-6)" />
          </Group>
        </Paper>

        <Paper shadow="xs" p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                Kritische Fälle
              </Text>
              <Text fw={700} size="xl" c="red">
                3
              </Text>
            </div>
            <IconAlertCircle size={24} color="var(--mantine-color-red-6)" />
          </Group>
        </Paper>
      </SimpleGrid>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={5} mb="md">Team Health Scores</Title>
            <BarChart
              h={250}
              data={teamHealthData}
              dataKey="team"
              series={[
                { name: 'avgScore', color: 'blue', label: 'Durchschnitt' }
              ]}
              tickLine="y"
              gridAxis="y"
              withLegend={false}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={5} mb="md">Athleten Status</Title>
            <PieChart
              h={250}
              data={statusDistribution}
              withLabels
              withLabelsLine
              labelsType="percent"
              withTooltip
              tooltipDataSource="segment"
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={5} mb="md">Wöchentliche Check-ins</Title>
            <BarChart
              h={200}
              data={weeklyCheckIns}
              dataKey="day"
              series={[
                { name: 'checkIns', color: 'green', label: 'Check-ins' }
              ]}
              tickLine="y"
              gridAxis="y"
              withLegend={false}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}