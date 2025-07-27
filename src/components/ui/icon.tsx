// VigorLog - Font Awesome Icon Component
// Vereinfachte Verwendung von Font Awesome Icons mit TypeScript Support

'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Font Awesome Icon Mapping für VigorLog
export const VigorLogIcons = {
  // Navigation
  home: 'fa-solid fa-house',
  dashboard: 'fa-solid fa-gauge-high',
  profile: 'fa-solid fa-user',
  settings: 'fa-solid fa-gear',
  logout: 'fa-solid fa-right-from-bracket',
  
  // User Roles
  athlete: 'fa-solid fa-person-running',
  coach: 'fa-solid fa-whistle',
  parent: 'fa-solid fa-people-group',
  admin: 'fa-solid fa-user-shield',
  user: 'fa-solid fa-user',
  
  // Health Metrics
  sleep: 'fa-solid fa-bed',
  fatigue: 'fa-solid fa-battery-quarter',
  mood: 'fa-solid fa-face-smile',
  pain: 'fa-solid fa-triangle-exclamation',
  heart: 'fa-solid fa-heart-pulse',
  health: 'fa-solid fa-stethoscope',
  
  // Sports
  football: 'fa-solid fa-futbol',
  basketball: 'fa-solid fa-basketball',
  tennis: 'fa-solid fa-tennis-ball',
  squash: 'fa-solid fa-racquet',
  swimming: 'fa-solid fa-person-swimming',
  baseball: 'fa-solid fa-baseball',
  americanFootball: 'fa-solid fa-football',
  volleyball: 'fa-solid fa-volleyball',
  golf: 'fa-solid fa-golf-ball-tee',
  running: 'fa-solid fa-person-running',
  cycling: 'fa-solid fa-person-biking',
  
  // Actions
  add: 'fa-solid fa-plus',
  edit: 'fa-solid fa-pen-to-square',
  delete: 'fa-solid fa-trash',
  save: 'fa-solid fa-floppy-disk',
  cancel: 'fa-solid fa-xmark',
  search: 'fa-solid fa-magnifying-glass',
  filter: 'fa-solid fa-filter',
  
  // Status & Alerts
  success: 'fa-solid fa-circle-check',
  warning: 'fa-solid fa-triangle-exclamation',
  error: 'fa-solid fa-circle-xmark',
  info: 'fa-solid fa-circle-info',
  notification: 'fa-solid fa-bell',
  photo: 'fa-solid fa-camera',
  recovery: 'fa-solid fa-heart-circle-plus',
  
  // Data & Charts
  chart: 'fa-solid fa-chart-line',
  'chart-line': 'fa-solid fa-chart-line',
  stats: 'fa-solid fa-chart-column',
  trend: 'fa-solid fa-arrow-trend-up',
  calendar: 'fa-solid fa-calendar-days',
  'calendar-check': 'fa-solid fa-calendar-check',
  'calendar-plus': 'fa-solid fa-calendar-plus',
  clock: 'fa-solid fa-clock',
  bolt: 'fa-solid fa-bolt',
  
  // Communication
  message: 'fa-solid fa-comment',
  comment: 'fa-solid fa-comment',
  comments: 'fa-solid fa-comments',
  email: 'fa-solid fa-envelope',
  envelope: 'fa-solid fa-envelope',
  phone: 'fa-solid fa-phone',
  'party-horn': 'fa-solid fa-champagne-glasses',
  'file-contract': 'fa-solid fa-file-contract',
  'file-medical': 'fa-solid fa-file-medical',
  
  // Gamification
  trophy: 'fa-solid fa-trophy',
  medal: 'fa-solid fa-medal',
  star: 'fa-solid fa-star',
  fire: 'fa-solid fa-fire-flame-curved',
  target: 'fa-solid fa-bullseye',
  
  // System
  loading: 'fa-solid fa-spinner',
  spinner: 'fa-solid fa-spinner',
  download: 'fa-solid fa-download',
  upload: 'fa-solid fa-upload',
  print: 'fa-solid fa-print',
  rocket: 'fa-solid fa-rocket',
  check: 'fa-solid fa-check',
  'check-circle': 'fa-solid fa-circle-check',
  'exclamation-triangle': 'fa-solid fa-triangle-exclamation',
  'exclamation-circle': 'fa-solid fa-circle-exclamation',
  'info-circle': 'fa-solid fa-circle-info',
  'circle-check': 'fa-solid fa-circle-check',
  'circle-question': 'fa-solid fa-circle-question',
  'circle-exclamation': 'fa-solid fa-circle-exclamation',
  'triangle-exclamation': 'fa-solid fa-triangle-exclamation',
  shield: 'fa-solid fa-shield-halved',
  users: 'fa-solid fa-users',
  cog: 'fa-solid fa-gear',
  
  // Arrows & Navigation
  chevronDown: 'fa-solid fa-chevron-down',
  chevronUp: 'fa-solid fa-chevron-up',
  chevronLeft: 'fa-solid fa-chevron-left',
  chevronRight: 'fa-solid fa-chevron-right',
  'chevron-right': 'fa-solid fa-chevron-right',
  'chevron-up': 'fa-solid fa-chevron-up',
  'chevron-down': 'fa-solid fa-chevron-down',
  arrowLeft: 'fa-solid fa-arrow-left',
  arrowRight: 'fa-solid fa-arrow-right',
  'arrow-left': 'fa-solid fa-arrow-left',
  'arrow-right': 'fa-solid fa-arrow-right',
  'arrow-up': 'fa-solid fa-arrow-up',
  'arrow-down': 'fa-solid fa-arrow-down',
  minus: 'fa-solid fa-minus',
  
  // Body Parts for Pain Location
  head: 'fa-solid fa-head-side-headphones',
  neck: 'fa-solid fa-user',
  shoulder: 'fa-solid fa-vest',
  arm: 'fa-solid fa-person-waving',
  chest: 'fa-solid fa-shirt',
  'shirt-jersey': 'fa-solid fa-shirt',
  back: 'fa-solid fa-spine',
  abdomen: 'fa-solid fa-stomach',
  hip: 'fa-solid fa-person-walking',
  thigh: 'fa-solid fa-person-running',
  knee: 'fa-solid fa-circle-dot',
  calf: 'fa-solid fa-socks',
  ankle: 'fa-solid fa-sneaker',
  foot: 'fa-solid fa-shoe-prints',
} as const;

export type IconName = keyof typeof VigorLogIcons;

interface IconProps {
  name: IconName;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spin?: boolean;
  pulse?: boolean;
  fixedWidth?: boolean;
  flip?: 'horizontal' | 'vertical' | 'both' | false;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export function Icon({ 
  name, 
  className,
  size = 'md',
  spin = false,
  pulse = false,
  fixedWidth = false,
  flip = false,
  ...props 
}: IconProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const iconClass = VigorLogIcons[name];
  const animationClasses = [
    spin && 'fa-spin',
    pulse && 'fa-pulse',
    fixedWidth && 'fa-fw',
    flip === 'horizontal' && 'fa-flip-horizontal',
    flip === 'vertical' && 'fa-flip-vertical',
    flip === 'both' && 'fa-flip-both'
  ].filter(Boolean).join(' ');

  // Render nothing on server to prevent hydration mismatch
  if (!isClient) {
    return (
      <span
        className={cn(
          'inline-block',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <i
      className={cn(
        iconClass,
        sizeClasses[size],
        animationClasses,
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

// Specialized Icon Components for common use cases
export function HealthIcon({ metric, className, ...props }: { 
  metric: 'sleep' | 'fatigue' | 'mood' | 'pain' | 'heart';
  className?: string;
} & Omit<IconProps, 'name'>) {
  const iconMap = {
    sleep: 'sleep' as const,
    fatigue: 'fatigue' as const,
    mood: 'mood' as const,
    pain: 'pain' as const,
    heart: 'heart' as const,
  };

  return <Icon name={iconMap[metric]} className={className} {...props} />;
}

export function RoleIcon({ role, className, ...props }: {
  role: 'athlete' | 'coach' | 'parent' | 'admin';
  className?: string;
} & Omit<IconProps, 'name'>) {
  return <Icon name={role} className={className} {...props} />;
}

export function StatusIcon({ status, className, ...props }: {
  status: 'success' | 'warning' | 'error' | 'info';
  className?: string;
} & Omit<IconProps, 'name'>) {
  return <Icon name={status} className={className} {...props} />;
}

export function SportIcon({ sport, className, ...props }: {
  sport: string;
  className?: string;
} & Omit<IconProps, 'name'>) {
  // Map common sports to icons
  const sportIconMap: Record<string, IconName> = {
    'fußball': 'football',
    'soccer': 'football',
    'football': 'americanFootball',
    'american football': 'americanFootball',
    'basketball': 'basketball',
    'tennis': 'tennis',
    'squash': 'squash',
    'schwimmen': 'swimming',
    'swimming': 'swimming',
    'baseball': 'baseball',
    'volleyball': 'volleyball',
    'golf': 'golf',
    'laufen': 'running',
    'running': 'running',
    'radfahren': 'cycling',
    'cycling': 'cycling',
  };

  const iconName = sportIconMap[sport.toLowerCase()] || 'football';
  return <Icon name={iconName} className={className} {...props} />;
}

// Loading Spinner Component
export function LoadingIcon({ className, ...props }: {
  className?: string;
} & Omit<IconProps, 'name' | 'spin'>) {
  return <Icon name="loading" spin className={className} {...props} />;
}

// Alert Icon with severity colors
export function AlertIcon({ severity, className, ...props }: {
  severity: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
} & Omit<IconProps, 'name'>) {
  const severityColors = {
    low: 'text-blue-600',
    medium: 'text-orange-600', 
    high: 'text-red-600',
    critical: 'text-red-800',
  };

  return (
    <Icon 
      name={severity === 'critical' ? 'error' : 'warning'} 
      className={cn(severityColors[severity], className)} 
      {...props} 
    />
  );
}

export default Icon;