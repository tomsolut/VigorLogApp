import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export default function PerformanceTestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  );
}