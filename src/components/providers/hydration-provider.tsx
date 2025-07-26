'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';

interface HydrationProviderProps {
  children: React.ReactNode;
}

/**
 * HydrationProvider - Handles Zustand store hydration for Next.js
 * 
 * This provider ensures that the Zustand store is properly hydrated
 * from localStorage before rendering children, preventing hydration
 * mismatches between server and client.
 * 
 * @see https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md
 */
export default function HydrationProvider({ children }: HydrationProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Trigger rehydration of the auth store
    useAuthStore.persist.rehydrate();
    
    // Small delay to ensure hydration completes
    const timeout = setTimeout(() => {
      setIsHydrated(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  // Show nothing until hydration is complete to prevent mismatch
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}