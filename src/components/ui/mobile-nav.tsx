'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  href: string;
  icon: IconName;
  label: string;
  badge?: number;
}

interface MobileNavProps {
  items: NavItem[];
  className?: string;
}

export function MobileNav({ items, className }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-background/95 backdrop-blur-lg',
        'border-t border-border',
        'safe-area-pb', // For iOS safe area
        className
      )}
    >
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'w-full h-full',
                'transition-all duration-200',
                'touch-target', // 44px minimum
                isActive ? 'text-primary' : 'text-muted-foreground',
                'hover:text-primary'
              )}
            >
              <div className="relative">
                <Icon
                  name={item.icon}
                  className={cn(
                    'w-6 h-6 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 text-[10px]"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] mt-1 font-medium',
                  'transition-all duration-200',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Preset configurations
export function AthleteNav({ alerts = 0 }: { alerts?: number }) {
  const items: NavItem[] = [
    { href: '/athlete', icon: 'home', label: 'Home' },
    { href: '/athlete/checkin', icon: 'add', label: 'Check-in' },
    { href: '/athlete/progress', icon: 'chart', label: 'Progress' },
    { href: '/athlete/alerts', icon: 'warning', label: 'Alerts', badge: alerts },
    { href: '/athlete/profile', icon: 'user', label: 'Profile' },
  ];

  return <MobileNav items={items} />;
}

export function CoachNav({ alerts = 0 }: { alerts?: number }) {
  const items: NavItem[] = [
    { href: '/coach', icon: 'home', label: 'Dashboard' },
    { href: '/coach/team', icon: 'users', label: 'Team' },
    { href: '/coach/alerts', icon: 'warning', label: 'Alerts', badge: alerts },
    { href: '/coach/analytics', icon: 'chart', label: 'Analytics' },
    { href: '/coach/profile', icon: 'user', label: 'Profile' },
  ];

  return <MobileNav items={items} />;
}

export function AdminNav({ alerts = 0 }: { alerts?: number }) {
  const items: NavItem[] = [
    { href: '/admin', icon: 'cog', label: 'Dashboard' },
    { href: '/admin/users', icon: 'users', label: 'Benutzer' },
    { href: '/admin/teams', icon: 'shirt-jersey', label: 'Teams' },
    { href: '/admin/alerts', icon: 'warning', label: 'Warnungen', badge: alerts > 0 ? alerts : undefined },
    { href: '/admin/analytics', icon: 'chart', label: 'Analytics' },
  ];

  return <MobileNav items={items} />;
}

// Floating Action Button for primary actions
interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: IconName;
  label?: string;
  className?: string;
  position?: 'left' | 'right' | 'center';
}

export function FloatingActionButton({
  onClick,
  icon = 'add',
  label,
  className,
  position = 'right',
}: FloatingActionButtonProps) {
  const positionClasses = {
    left: 'left-4',
    right: 'right-4',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 z-40', // Above mobile nav
        positionClasses[position],
        'w-14 h-14 rounded-full',
        'bg-primary text-primary-foreground',
        'shadow-lg hover:shadow-xl',
        'flex items-center justify-center',
        'transition-all duration-300',
        'hover:scale-110 active:scale-95',
        'touch-target',
        className
      )}
      aria-label={label || 'Primary action'}
    >
      <Icon name={icon} className="w-6 h-6" />
    </button>
  );
}

// Tab navigation for sub-pages
interface TabNavProps {
  tabs: {
    id: string;
    label: string;
    icon?: IconName;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabNav({ tabs, activeTab, onTabChange, className }: TabNavProps) {
  return (
    <div
      className={cn(
        'flex bg-muted/50 rounded-lg p-1',
        'overflow-x-auto scrollbar-hide',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md',
            'whitespace-nowrap transition-all',
            'min-h-[44px]', // Touch target
            activeTab === tab.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.icon && <Icon name={tab.icon} className="w-4 h-4" />}
          <span className="text-sm font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}