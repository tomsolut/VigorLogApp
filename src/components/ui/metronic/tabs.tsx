// Metronic Tabs Component - Adapted for VigorLog
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Tab List Variants
const tabsListVariants = cva('flex items-center shrink-0', {
  variants: {
    variant: {
      default: 'bg-muted p-1 rounded-lg',
      button: '',
      line: 'border-b border-border',
    },
    size: {
      lg: 'gap-2.5',
      md: 'gap-2',
      sm: 'gap-1.5',
      xs: 'gap-1',
    },
  },
  compoundVariants: [
    { variant: 'default', size: 'lg', className: 'p-1.5 gap-2.5' },
    { variant: 'default', size: 'md', className: 'p-1 gap-2' },
    { variant: 'default', size: 'sm', className: 'p-1 gap-1.5' },
    { variant: 'line', size: 'lg', className: 'gap-6' },
    { variant: 'line', size: 'md', className: 'gap-4' },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Tab Trigger Variants
const tabsTriggerVariants = cva(
  'shrink-0 cursor-pointer whitespace-nowrap inline-flex justify-center items-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'text-muted-foreground data-[state=active]:bg-background hover:text-foreground data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        button:
          'text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
        line: 'border-b-2 text-muted-foreground border-transparent data-[state=active]:border-primary hover:text-primary data-[state=active]:text-primary',
      },
      size: {
        lg: 'gap-2.5 text-sm [&_svg]:size-5',
        md: 'gap-2 text-sm [&_svg]:size-4',
        sm: 'gap-1.5 text-xs [&_svg]:size-3.5',
        xs: 'gap-1 text-xs [&_svg]:size-3',
      },
    },
    compoundVariants: [
      { variant: 'default', size: 'lg', className: 'py-2.5 px-4 rounded-md' },
      { variant: 'default', size: 'md', className: 'py-1.5 px-3 rounded-md' },
      { variant: 'default', size: 'sm', className: 'py-1 px-2 rounded-sm' },
      { variant: 'button', size: 'lg', className: 'py-2.5 px-4 rounded-lg' },
      { variant: 'button', size: 'md', className: 'py-2 px-3 rounded-md' },
      { variant: 'button', size: 'sm', className: 'py-1.5 px-2.5 rounded-md' },
      { variant: 'line', size: 'lg', className: 'pb-3' },
      { variant: 'line', size: 'md', className: 'pb-2' },
      { variant: 'line', size: 'sm', className: 'pb-1.5' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Context
type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
  variant?: 'default' | 'button' | 'line';
  size?: 'lg' | 'md' | 'sm' | 'xs';
};

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

// Main Tabs Component
interface MetronicTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'button' | 'line';
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

const MetronicTabs = React.forwardRef<HTMLDivElement, MetronicTabsProps>(
  ({ className, defaultValue, value: controlledValue, onValueChange, variant, size, children, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
    const value = controlledValue ?? uncontrolledValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (controlledValue === undefined) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [controlledValue, onValueChange]
    );

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange, variant, size }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

MetronicTabs.displayName = 'MetronicTabs';

// Tabs List
interface MetronicTabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const MetronicTabsList = React.forwardRef<HTMLDivElement, MetronicTabsListProps>(
  ({ className, ...props }, ref) => {
    const { variant, size } = useTabsContext();
    
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(tabsListVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

MetronicTabsList.displayName = 'MetronicTabsList';

// Tabs Trigger
interface MetronicTabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const MetronicTabsTrigger = React.forwardRef<HTMLButtonElement, MetronicTabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, variant, size } = useTabsContext();
    const isActive = value === selectedValue;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        data-state={isActive ? 'active' : 'inactive'}
        className={cn(tabsTriggerVariants({ variant, size }), className)}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MetronicTabsTrigger.displayName = 'MetronicTabsTrigger';

// Tabs Content
interface MetronicTabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const MetronicTabsContent = React.forwardRef<HTMLDivElement, MetronicTabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();
    const isActive = value === selectedValue;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MetronicTabsContent.displayName = 'MetronicTabsContent';

// VigorLog Specific Dashboard Tabs
interface DashboardTabsProps {
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ defaultTab = 'overview', onTabChange }) => {
  return (
    <MetronicTabs defaultValue={defaultTab} onValueChange={onTabChange} variant="line" size="md">
      <MetronicTabsList>
        <MetronicTabsTrigger value="overview">Übersicht</MetronicTabsTrigger>
        <MetronicTabsTrigger value="checkins">Check-ins</MetronicTabsTrigger>
        <MetronicTabsTrigger value="analytics">Analysen</MetronicTabsTrigger>
        <MetronicTabsTrigger value="team">Team</MetronicTabsTrigger>
      </MetronicTabsList>
      
      <MetronicTabsContent value="overview">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dashboard Übersicht</h3>
          <p className="text-muted-foreground">Hier sehen Sie alle wichtigen Metriken auf einen Blick.</p>
        </div>
      </MetronicTabsContent>
      
      <MetronicTabsContent value="checkins">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Check-in Historie</h3>
          <p className="text-muted-foreground">Alle Check-ins der letzten 30 Tage.</p>
        </div>
      </MetronicTabsContent>
      
      <MetronicTabsContent value="analytics">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detaillierte Analysen</h3>
          <p className="text-muted-foreground">Trends und Muster in den Gesundheitsdaten.</p>
        </div>
      </MetronicTabsContent>
      
      <MetronicTabsContent value="team">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Team-Übersicht</h3>
          <p className="text-muted-foreground">Status und Performance des gesamten Teams.</p>
        </div>
      </MetronicTabsContent>
    </MetronicTabs>
  );
};

export { 
  MetronicTabs, 
  MetronicTabsList, 
  MetronicTabsTrigger, 
  MetronicTabsContent,
  DashboardTabs 
};