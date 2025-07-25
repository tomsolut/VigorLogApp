import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// VigorLog Utility Functions

// Generate UUID v4
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Format time for display
export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

// Calculate age from birth date
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Get health status color
export function getHealthStatusColor(status: 'excellent' | 'good' | 'concern' | 'critical'): string {
  switch (status) {
    case 'excellent':
      return 'text-green-600 bg-green-50';
    case 'good':
      return 'text-blue-600 bg-blue-50';
    case 'concern':
      return 'text-orange-600 bg-orange-50';
    case 'critical':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

// Get alert severity color
export function getAlertSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (severity) {
    case 'low':
      return 'text-blue-600 bg-blue-50';
    case 'medium':
      return 'text-orange-600 bg-orange-50';
    case 'high':
      return 'text-red-600 bg-red-50';
    case 'critical':
      return 'text-red-800 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

// Format health metric value (0-10) to percentage or description
export function formatHealthMetric(value: number, type: 'percentage' | 'description' = 'percentage'): string {
  if (type === 'percentage') {
    return `${Math.round(value * 10)}%`;
  }
  
  // Description based on value
  if (value >= 8) return 'Sehr gut';
  if (value >= 6) return 'Gut';
  if (value >= 4) return 'Mittel';
  if (value >= 2) return 'Schlecht';
  return 'Sehr schlecht';
}

// Calculate streak from checkins
export function calculateStreak(checkins: Array<{ date: string }>): number {
  if (checkins.length === 0) return 0;
  
  const sortedCheckins = checkins
    .map(c => new Date(c.date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const checkinDate of sortedCheckins) {
    checkinDate.setHours(0, 0, 0, 0);
    
    if (checkinDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (checkinDate.getTime() === currentDate.getTime() + 86400000) {
      // Skip today if no checkin yet
      currentDate.setDate(currentDate.getDate() - 1);
      if (checkinDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    } else {
      break;
    }
  }
  
  return streak;
}

// Get today's date in YYYY-MM-DD format
export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Check if date is today
export function isToday(date: string): boolean {
  return date === getTodayString();
}

// Check if date is within last N days
export function isWithinDays(date: string, days: number): boolean {
  const checkDate = new Date(date);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return checkDate >= cutoff;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
