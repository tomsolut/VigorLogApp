import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types';

// Mock Next.js router
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockRouter.pathname,
  useSearchParams: () => new URLSearchParams(),
}));

interface AllTheProvidersProps {
  children: React.ReactNode;
}

// All providers wrapper
const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return <>{children}</>;
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test data helpers
export const createMockUser = (overrides?: Partial<User>): User => {
  const baseUser = {
    id: 'test-user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'athlete' as const,
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  if (overrides?.role === 'athlete') {
    return {
      ...baseUser,
      ...overrides,
      birthDate: '2008-01-01',
      sport: 'Fußball',
      teamId: 'team-1',
      parentIds: [],
      currentStreak: 0,
      totalPoints: 0,
      achievements: [],
      healthStatus: 'good' as const,
    };
  }

  return { ...baseUser, ...overrides } as User;
};

// Auth store helpers
export const setupAuthStore = (user?: User) => {
  const store = useAuthStore.getState();
  
  if (user) {
    store.currentUser = user;
    store.isAuthenticated = true;
  } else {
    store.logout();
  }
  
  return store;
};