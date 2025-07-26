// Metronic UI Components - Placeholder for main branch
// Die echten Metronic-Komponenten befinden sich im feature/metronic-integration Branch

import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

// Export placeholder components that use the existing shadcn/ui components
export const MetronicButton = Button;
export const MetronicCard = Card;

// Create placeholder components for missing ones
export const MetronicProgress = ({ value, className = '' }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-primary h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

export const MetronicTabs = ({ children, defaultValue, className = '' }: { children: React.ReactNode; defaultValue?: string; className?: string }) => (
  <div className={`w-full ${className}`}>
    {children}
  </div>
);

export const MetronicTabsList = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
    {children}
  </div>
);

export const MetronicTabsTrigger = ({ children, value, className = '' }: { children: React.ReactNode; value: string; className?: string }) => (
  <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}>
    {children}
  </button>
);

export const MetronicTabsContent = ({ children, value, className = '' }: { children: React.ReactNode; value: string; className?: string }) => (
  <div className={`mt-2 ${className}`}>
    {children}
  </div>
);

// Export additional components with fallbacks
export const MetronicAlert = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 rounded-lg border ${className}`}>
    {children}
  </div>
);

export const MetronicBadge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

export const MetronicAvatar = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
    {children}
  </div>
);

export const MetronicStepper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

export const MetronicStep = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    {children}
  </div>
);

export const MetronicStepIndicator = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center ${className}`}>
    {children}
  </div>
);

export const MetronicStepContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex-1 ${className}`}>
    {children}
  </div>
);
