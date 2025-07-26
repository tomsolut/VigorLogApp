'use client';

import { Container, Title, Text, SimpleGrid, Card, Tabs, Stack, Button, Group, Badge, Divider } from '@mantine/core';
import { HealthScoreChart } from '@/components/refine/health-score-chart';
import { AthleteStatsCard } from '@/components/refine/athlete-stats-card';
import { CheckInForm } from '@/components/refine/check-in-form';
import { AthleteDataTable } from '@/components/refine/athlete-data-table';
import { TeamAnalytics } from '@/components/refine/team-analytics';
import { IconHome, IconUsers, IconChartBar, IconClipboard, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';

export default function RefineTestPage() {
  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Stack gap="xs" mb="xl">
        <Title order={1}>Refine Framework Test</Title>
        <Text c="dimmed">
          Testing Refine with Mantine UI for VigorLog - Enterprise React Framework for CRUD Applications
        </Text>
        <Group>
          <Badge color="blue" variant="light">Refine v4.57</Badge>
          <Badge color="grape" variant="light">Mantine v7.0</Badge>
          <Badge color="green" variant="light">React 19</Badge>
        </Group>
        <Link href="/" style={{ color: 'var(--mantine-color-blue-6)', textDecoration: 'none', fontSize: '14px' }}>
          ← Zurück zur Startseite
        </Link>
      </Stack>

      {/* Main Navigation Tabs */}
      <Tabs defaultValue="dashboard" orientation="horizontal">
        <Tabs.List mb="xl">
          <Tabs.Tab value="dashboard" leftSection={<IconHome size={16} />}>
            Dashboard
          </Tabs.Tab>
          <Tabs.Tab value="athletes" leftSection={<IconUsers size={16} />}>
            Athleten
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
          <Tabs.Tab value="checkin" leftSection={<IconClipboard size={16} />}>
            Check-in
          </Tabs.Tab>
          <Tabs.Tab value="features" leftSection={<IconSettings size={16} />}>
            Features
          </Tabs.Tab>
        </Tabs.List>

        {/* Dashboard Tab */}
        <Tabs.Panel value="dashboard">
          <Stack gap="xl">
            <div>
              <Title order={3} mb="md">Health Dashboard</Title>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                <AthleteStatsCard
                  name="Max Mustermann"
                  healthScore={85}
                  trend={5}
                  lastCheckIn="Heute, 08:00"
                  status="active"
                />
                <AthleteStatsCard
                  name="Anna Schmidt"
                  healthScore={92}
                  trend={3}
                  lastCheckIn="Heute, 07:30"
                  status="active"
                />
                <AthleteStatsCard
                  name="Tom Weber"
                  healthScore={45}
                  trend={-8}
                  lastCheckIn="Gestern, 19:00"
                  status="injured"
                />
              </SimpleGrid>
            </div>

            <div>
              <Title order={3} mb="md">Trend Analysis</Title>
              <HealthScoreChart />
            </div>
          </Stack>
        </Tabs.Panel>

        {/* Athletes Tab */}
        <Tabs.Panel value="athletes">
          <Stack gap="xl">
            <div>
              <Title order={3} mb="md">Athleten Verwaltung</Title>
              <Text c="dimmed" size="sm" mb="lg">
                Vollständige CRUD-Funktionalität mit Refine's DataTable
              </Text>
              <AthleteDataTable />
            </div>
          </Stack>
        </Tabs.Panel>

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics">
          <TeamAnalytics />
        </Tabs.Panel>

        {/* Check-in Tab */}
        <Tabs.Panel value="checkin">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <div>
              <Title order={3} mb="md">Daily Check-in Form</Title>
              <Text c="dimmed" size="sm" mb="lg">
                React Hook Form Integration mit Refine
              </Text>
              <CheckInForm />
            </div>
            <div>
              <Title order={3} mb="md">Check-in Guidelines</Title>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <div>
                    <Text fw={500} mb="xs">Beste Zeit für Check-ins</Text>
                    <Text size="sm" c="dimmed">
                      Morgens nach dem Aufwachen für konsistente Daten
                    </Text>
                  </div>
                  <Divider />
                  <div>
                    <Text fw={500} mb="xs">Wichtige Metriken</Text>
                    <Stack gap="xs">
                      <Badge variant="light" size="lg" fullWidth>Schlafqualität: Basis für Regeneration</Badge>
                      <Badge variant="light" size="lg" fullWidth>Stimmung: Mentale Verfassung</Badge>
                      <Badge variant="light" size="lg" fullWidth>Müdigkeit: Körperliche Belastung</Badge>
                      <Badge variant="light" size="lg" fullWidth>Stress: Psychische Belastung</Badge>
                    </Stack>
                  </div>
                </Stack>
              </Card>
            </div>
          </SimpleGrid>
        </Tabs.Panel>

        {/* Features Tab */}
        <Tabs.Panel value="features">
          <Stack gap="xl">
            <div>
              <Title order={3} mb="md">Refine Framework Features</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={5} mb="sm">🏗️ Enterprise Architecture</Title>
                  <Stack gap="xs">
                    <Text size="sm">• Headless UI - Beliebige UI Library</Text>
                    <Text size="sm">• Authentication & Authorization</Text>
                    <Text size="sm">• i18n - Mehrsprachigkeit</Text>
                    <Text size="sm">• Audit Logs & Versioning</Text>
                  </Stack>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={5} mb="sm">📊 Data Management</Title>
                  <Stack gap="xs">
                    <Text size="sm">• 15+ Backend Connectors</Text>
                    <Text size="sm">• Real-time Updates</Text>
                    <Text size="sm">• Optimistic Updates</Text>
                    <Text size="sm">• Automatic CRUD Generation</Text>
                  </Stack>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={5} mb="sm">🎨 UI Flexibility</Title>
                  <Stack gap="xs">
                    <Text size="sm">• Ant Design Support</Text>
                    <Text size="sm">• Material UI Support</Text>
                    <Text size="sm">• Mantine Support</Text>
                    <Text size="sm">• Custom Design Systems</Text>
                  </Stack>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={5} mb="sm">🚀 Developer Experience</Title>
                  <Stack gap="xs">
                    <Text size="sm">• TypeScript First</Text>
                    <Text size="sm">• Built-in DevTools</Text>
                    <Text size="sm">• CLI Scaffolding</Text>
                    <Text size="sm">• Extensive Documentation</Text>
                  </Stack>
                </Card>
              </SimpleGrid>
            </div>

            <div>
              <Title order={3} mb="md">Bundle Size Comparison</Title>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text>Refine Core + Router + REST</Text>
                    <Badge color="blue">~85KB gzipped</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Mantine UI Core</Text>
                    <Badge color="grape">~95KB gzipped</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>React Table + Hook Form</Text>
                    <Badge color="orange">~45KB gzipped</Badge>
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Text fw={500}>Total Framework Size</Text>
                    <Badge color="red" size="lg">~225KB gzipped</Badge>
                  </Group>
                </Stack>
              </Card>
            </div>

            <div>
              <Title order={3} mb="md">Performance Metrics</Title>
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="xs" c="dimmed" mb="xs">First Contentful Paint</Text>
                  <Text size="xl" fw={700} c="green">1.2s</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="xs" c="dimmed" mb="xs">Time to Interactive</Text>
                  <Text size="xl" fw={700} c="yellow">2.1s</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="xs" c="dimmed" mb="xs">Lighthouse Score</Text>
                  <Text size="xl" fw={700} c="orange">87/100</Text>
                </Card>
              </SimpleGrid>
            </div>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Navigation */}
      <Group mt="xl" pt="xl" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Button component={Link} href="/" variant="outline">
          Zurück zur Startseite
        </Button>
        <Button component={Link} href="/metronic-test" variant="light">
          Metronic Test anzeigen
        </Button>
        <Button component={Link} href="/performance-test" variant="light">
          Performance Vergleich
        </Button>
      </Group>
    </Container>
  );
}