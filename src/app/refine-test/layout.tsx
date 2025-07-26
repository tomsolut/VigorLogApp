'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RefineProvider } from '@/providers/refine-provider';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';

export default function RefineTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'green',
        colors: {
          green: [
            '#e6f7e6',
            '#b3e6b3',
            '#80d580',
            '#4dc34d',
            '#39FF14', // VigorLog cyber-lime
            '#33e612',
            '#2dcc10',
            '#26b30e',
            '#20990c',
            '#1a800a',
          ],
        },
      }}
    >
      <Notifications position="top-right" />
      <RefineProvider>
        {children}
      </RefineProvider>
    </MantineProvider>
  );
}