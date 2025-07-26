'use client';

import { Table, Badge, Button, Group, TextInput, ActionIcon, Progress, Text } from '@mantine/core';
import { IconSearch, IconEdit, IconEye, IconTrash, IconFilter } from '@tabler/icons-react';
import { useState, useMemo } from 'react';

interface Athlete {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'injured';
  healthScore: number;
  lastCheckIn: string;
  team: string;
}

// Mock data for demonstration
const mockData: Athlete[] = [
  { id: 1, name: 'Max Mustermann', email: 'max@example.com', status: 'active', healthScore: 85, lastCheckIn: '26.01.2024', team: 'FC VigorLog' },
  { id: 2, name: 'Anna Schmidt', email: 'anna@example.com', status: 'active', healthScore: 92, lastCheckIn: '26.01.2024', team: 'FC VigorLog' },
  { id: 3, name: 'Tom Weber', email: 'tom@example.com', status: 'inactive', healthScore: 78, lastCheckIn: '25.01.2024', team: 'SC Fitness' },
  { id: 4, name: 'Lisa Meyer', email: 'lisa@example.com', status: 'injured', healthScore: 45, lastCheckIn: '24.01.2024', team: 'FC VigorLog' },
  { id: 5, name: 'Jonas Fischer', email: 'jonas@example.com', status: 'active', healthScore: 88, lastCheckIn: '26.01.2024', team: 'SC Fitness' },
];

export function AthleteDataTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  
  const filteredData = useMemo(() => {
    if (!globalFilter) return mockData;
    
    const filter = globalFilter.toLowerCase();
    return mockData.filter((athlete) => 
      athlete.name.toLowerCase().includes(filter) ||
      athlete.team.toLowerCase().includes(filter) ||
      athlete.email.toLowerCase().includes(filter)
    );
  }, [globalFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'yellow';
      case 'injured': return 'red';
      default: return 'gray';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  return (
    <div>
      <Group justify="space-between" mb="md">
        <TextInput
          placeholder="Suche nach Namen, Team..."
          leftSection={<IconSearch size={16} />}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ width: 300 }}
        />
        <Group>
          <Button variant="light" leftSection={<IconFilter size={16} />} size="sm">
            Filter
          </Button>
          <Button color="green" size="sm">
            Neuer Athlet
          </Button>
        </Group>
      </Group>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Health Score</Table.Th>
            <Table.Th>Letzter Check-in</Table.Th>
            <Table.Th>Team</Table.Th>
            <Table.Th>Aktionen</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData.map((athlete) => (
            <Table.Tr key={athlete.id}>
              <Table.Td>
                <Text fw={500}>{athlete.name}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(athlete.status)} variant="light" size="sm">
                  {athlete.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <div style={{ width: '100px' }}>
                  <Text size="xs" ta="right" mb={2}>{athlete.healthScore}%</Text>
                  <Progress value={athlete.healthScore} color={getHealthColor(athlete.healthScore)} size="sm" />
                </div>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{athlete.lastCheckIn}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{athlete.team}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="blue" size="sm">
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="gray" size="sm">
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" size="sm">
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}