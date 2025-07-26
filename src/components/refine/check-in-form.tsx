'use client';

import { useForm } from '@mantine/form';
import { Button, Card, Group, NumberInput, Slider, Stack, Text, Textarea, Title } from '@mantine/core';
import { IconMoodSmile, IconBed, IconBattery, IconBrain } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const marks = [
  { value: 1, label: '1' },
  { value: 5, label: '5' },
  { value: 10, label: '10' },
];

export function CheckInForm() {
  const form = useForm({
    initialValues: {
      sleep: 7,
      mood: 5,
      fatigue: 5,
      stress: 5,
      notes: '',
    },
    validate: {
      sleep: (value) => {
        if (value < 0 || value > 12) {
          return 'Schlafstunden müssen zwischen 0 und 12 liegen';
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Form submitted:', values);
    notifications.show({
      title: 'Check-in gespeichert',
      message: 'Deine Daten wurden erfolgreich gespeichert.',
      color: 'green',
    });
    form.reset();
  };

  const getSliderColor = (value: number, inverted = false) => {
    if (inverted) {
      if (value <= 3) return 'green';
      if (value <= 7) return 'yellow';
      return 'red';
    }
    if (value >= 8) return 'green';
    if (value >= 5) return 'yellow';
    return 'red';
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} mb="lg">Täglicher Check-in</Title>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Sleep Hours */}
          <div>
            <Group gap="xs" mb="xs">
              <IconBed size={20} />
              <Text size="sm" fw={500}>Schlafstunden</Text>
            </Group>
            <NumberInput
              {...form.getInputProps('sleep')}
              min={0}
              max={12}
              step={0.5}
              decimalScale={1}
              placeholder="Stunden geschlafen"
            />
          </div>

          {/* Mood */}
          <div>
            <Group gap="xs" mb="xs">
              <IconMoodSmile size={20} />
              <Text size="sm" fw={500}>Stimmung</Text>
            </Group>
            <Slider
              {...form.getInputProps('mood')}
              min={1}
              max={10}
              marks={marks}
              step={1}
              color={getSliderColor(form.values.mood)}
            />
          </div>

          {/* Fatigue */}
          <div>
            <Group gap="xs" mb="xs">
              <IconBattery size={20} />
              <Text size="sm" fw={500}>Müdigkeit</Text>
            </Group>
            <Slider
              {...form.getInputProps('fatigue')}
              min={1}
              max={10}
              marks={marks}
              step={1}
              color={getSliderColor(form.values.fatigue, true)}
            />
          </div>

          {/* Stress */}
          <div>
            <Group gap="xs" mb="xs">
              <IconBrain size={20} />
              <Text size="sm" fw={500}>Stress</Text>
            </Group>
            <Slider
              {...form.getInputProps('stress')}
              min={1}
              max={10}
              marks={marks}
              step={1}
              color={getSliderColor(form.values.stress, true)}
            />
          </div>

          {/* Notes */}
          <div>
            <Text size="sm" fw={500} mb="xs">Notizen (optional)</Text>
            <Textarea
              {...form.getInputProps('notes')}
              placeholder="Wie fühlst du dich heute?"
              rows={3}
            />
          </div>

          <Button type="submit" fullWidth mt="md" color="green">
            Check-in speichern
          </Button>
        </Stack>
      </form>
    </Card>
  );
}