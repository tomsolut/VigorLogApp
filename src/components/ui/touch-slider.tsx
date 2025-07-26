'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TouchSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  showTicks?: boolean;
  disabled?: boolean;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  hapticFeedback?: boolean;
}

const colorClasses = {
  primary: 'bg-primary',
  secondary: 'bg-secondary', 
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

const sizeClasses = {
  sm: {
    track: 'h-2',
    thumb: 'w-5 h-5',
    touchTarget: 'h-10',
  },
  md: {
    track: 'h-3',
    thumb: 'w-7 h-7',
    touchTarget: 'h-12',
  },
  lg: {
    track: 'h-4',
    thumb: 'w-9 h-9', 
    touchTarget: 'h-14',
  },
};

export function TouchSlider({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  label,
  showValue = true,
  showTicks = false,
  disabled = false,
  className,
  trackClassName,
  thumbClassName,
  color = 'primary',
  size = 'md',
  hapticFeedback = true,
}: TouchSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  // Ensure value is within bounds
  const clampedValue = Math.max(min, Math.min(max, value));
  const [localValue, setLocalValue] = useState(clampedValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Update local value when prop changes
  useEffect(() => {
    if (!isDragging) {
      const clampedValue = Math.max(min, Math.min(max, value));
      setLocalValue(clampedValue);
    }
  }, [value, isDragging, min, max]);

  // Haptic feedback for mobile
  const triggerHaptic = useCallback(() => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [hapticFeedback]);

  // Calculate position from value
  const getPositionFromValue = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  // Calculate value from position
  const getValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return value;

    const rect = trackRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    const rawValue = position * (max - min) + min;
    
    // Round to step
    const steppedValue = Math.round(rawValue / step) * step;
    
    // Clamp to min/max
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step, value]);

  // Handle drag start
  const handleStart = useCallback((clientX: number) => {
    if (disabled) return;
    
    setIsDragging(true);
    const newValue = getValueFromPosition(clientX);
    setLocalValue(newValue);
    triggerHaptic();
  }, [disabled, getValueFromPosition, triggerHaptic]);

  // Handle drag move
  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || disabled) return;
    
    const newValue = getValueFromPosition(clientX);
    if (newValue !== localValue) {
      setLocalValue(newValue);
      if (step >= 1) {
        triggerHaptic();
      }
    }
  }, [isDragging, disabled, getValueFromPosition, localValue, step, triggerHaptic]);

  // Handle drag end
  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    onChange(localValue);
    triggerHaptic();
  }, [isDragging, localValue, onChange, triggerHaptic]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Add/remove global listeners
  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const position = getPositionFromValue(localValue);
  const { track, thumb, touchTarget } = sizeClasses[size];

  // Generate tick marks
  const ticks = [];
  if (showTicks) {
    for (let i = min; i <= max; i += step) {
      const tickPosition = getPositionFromValue(i);
      ticks.push(
        <div
          key={i}
          className="absolute w-0.5 h-full bg-muted-foreground/20"
          style={{ left: `${tickPosition}%` }}
        />
      );
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-medium tabular-nums">
              {localValue}
            </span>
          )}
        </div>
      )}
      
      <div
        ref={sliderRef}
        className={cn(
          'relative',
          touchTarget,
          'flex items-center',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Track */}
        <div
          ref={trackRef}
          className={cn(
            'relative w-full rounded-full bg-muted',
            track,
            trackClassName,
          )}
        >
          {/* Ticks */}
          {showTicks && ticks}
          
          {/* Fill */}
          <div
            className={cn(
              'absolute left-0 top-0 h-full rounded-full transition-all',
              colorClasses[color],
              isDragging && 'transition-none',
            )}
            style={{ width: `${position}%` }}
          />
          
          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
              'rounded-full bg-background border-2 shadow-md',
              'transition-all touch-none select-none',
              thumb,
              colorClasses[color].replace('bg-', 'border-'),
              isDragging && 'scale-125 shadow-lg transition-none',
              thumbClassName,
            )}
            style={{ left: `${position}%` }}
            aria-valuenow={localValue}
            aria-valuemin={min}
            aria-valuemax={max}
            role="slider"
          />
        </div>
      </div>
    </div>
  );
}

// Preset variants for common use cases
export const HealthSlider = (props: Omit<TouchSliderProps, 'color' | 'size'>) => {
  const getColor = (value: number): TouchSliderProps['color'] => {
    if (value >= 8) return 'success';
    if (value >= 6) return 'primary';
    if (value >= 4) return 'warning';
    return 'danger';
  };

  return (
    <TouchSlider
      {...props}
      color={getColor(props.value)}
      size="lg"
      showTicks
    />
  );
};

export const MoodSlider = (props: Omit<TouchSliderProps, 'min' | 'max' | 'showTicks'>) => (
  <TouchSlider
    {...props}
    min={0}
    max={10}
    showTicks
    label={props.label || 'Stimmung'}
  />
);

export const StressSlider = (props: Omit<TouchSliderProps, 'min' | 'max' | 'color'>) => (
  <TouchSlider
    {...props}
    min={0}
    max={10}
    color={props.value > 5 ? 'danger' : props.value > 3 ? 'warning' : 'success'}
    label={props.label || 'Stress Level'}
  />
);