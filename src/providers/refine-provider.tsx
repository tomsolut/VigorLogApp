'use client';

import { ReactNode } from 'react';

// Simplified provider without Refine's router dependencies
// This avoids the React Router compatibility issues with Next.js App Router

interface RefineProviderProps {
  children: ReactNode;
}

export function RefineProvider({ children }: RefineProviderProps) {
  // For now, we'll just pass through the children
  // This allows us to use Mantine UI components without Refine's meta-framework
  return <>{children}</>;
}