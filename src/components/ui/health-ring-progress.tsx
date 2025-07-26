'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HealthRingProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string | React.ReactNode;
  color?: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'lime';
  showValue?: boolean;
  className?: string;
  animate?: boolean;
}

const colorMap = {
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316', 
  red: '#ef4444',
  blue: '#3b82f6',
  lime: '#39FF14',
};

export function HealthRingProgress({
  value,
  size = 120,
  strokeWidth = 12,
  label,
  color = 'lime',
  showValue = true,
  className,
  animate = true,
}: HealthRingProgressProps) {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  
  // Determine color based on value if not explicitly set
  const getAutoColor = () => {
    if (normalizedValue >= 80) return colorMap.green;
    if (normalizedValue >= 60) return colorMap.lime;
    if (normalizedValue >= 40) return colorMap.yellow;
    if (normalizedValue >= 20) return colorMap.orange;
    return colorMap.red;
  };
  
  const strokeColor = color === 'lime' && normalizedValue < 80 ? getAutoColor() : colorMap[color];
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-label={`Health score: ${normalizedValue}%`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground/20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            animate && 'transition-all duration-500 ease-out',
          )}
          style={{
            filter: `drop-shadow(0 0 ${strokeWidth / 2}px ${strokeColor}30)`,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <div className="text-2xl font-bold" style={{ color: strokeColor }}>
            {normalizedValue}
            <span className="text-sm">%</span>
          </div>
        )}
        {label && (
          <div className="text-xs text-muted-foreground mt-1 text-center max-w-[80%]">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// Mini version for inline use
export function HealthRingMini({
  value,
  size = 40,
  strokeWidth = 4,
  color = 'lime',
  className,
}: Omit<HealthRingProgressProps, 'label' | 'showValue'>) {
  return (
    <HealthRingProgress
      value={value}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      showValue={false}
      className={className}
      animate={false}
    />
  );
}

// Preset sizes
export const HealthRingLarge = (props: Omit<HealthRingProgressProps, 'size'>) => (
  <HealthRingProgress size={160} strokeWidth={16} {...props} />
);

export const HealthRingMedium = (props: Omit<HealthRingProgressProps, 'size'>) => (
  <HealthRingProgress size={120} strokeWidth={12} {...props} />
);

export const HealthRingSmall = (props: Omit<HealthRingProgressProps, 'size'>) => (
  <HealthRingProgress size={80} strokeWidth={8} {...props} />
);