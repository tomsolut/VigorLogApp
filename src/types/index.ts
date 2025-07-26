// VigorLog - Core Type Definitions
// Jugendathleten-Monitoring System

// User System - 4 Rollen-Architektur
export type UserRole = 'athlete' | 'coach' | 'parent' | 'admin';

export interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
  isActive: boolean;
}

// Daily Check-in System (Kern-Feature)
export interface DailyCheckin {
  id: string;
  athleteId: string;
  date: string; // YYYY-MM-DD
  sleepQuality: number; // 0-10
  fatigueLevel: number; // 0-10
  muscleSoreness: number; // 0-10
  moodRating: number; // 0-10
  painLevel: number; // 0-10
  painLocation?: string;
  stressLevel: number; // 0-10
  notes?: string;
  completedAt: string;
}

// Athleten-spezifische Daten
export interface Athlete extends BaseUser {
  role: 'athlete';
  birthDate: string;
  sport: string;
  teamId?: string;
  parentIds: string[];
  currentStreak: number;
  totalPoints: number;
  achievements: Achievement[];
  healthStatus: HealthStatus;
  // GDPR Dual-Consent für <16 Jahre
  needsParentalConsent: boolean;
  hasParentalConsent: boolean;
  parentalConsentDate?: string;
  parentalConsentBy?: string; // Parent ID
}

// Coach-Daten
export interface Coach extends BaseUser {
  role: 'coach';
  licenseNumber?: string;
  specializations: string[];
  teamIds: string[];
  clubId?: string;
}

// Eltern-Daten
export interface Parent extends BaseUser {
  role: 'parent';
  childrenIds: string[];
  phoneNumber?: string;
  emergencyContact: boolean;
  hasDataConsent: boolean;
  hasMedicalConsent: boolean;
  consentDate?: string;
  // GDPR Dual-Consent Management
  canGiveConsentFor: string[]; // Athlete IDs unter 16
  consentHistory: ConsentRecord[];
}

// Admin-Daten
export interface Admin extends BaseUser {
  role: 'admin';
  permissions: AdminPermission[];
  clubId?: string;
}

export type User = Athlete | Coach | Parent | Admin;

// Team & Club System
export interface Team {
  id: string;
  name: string;
  sport: string;
  ageGroup: string;
  coachId: string;
  athleteIds: string[];
  clubId?: string;
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  licenseNumber?: string;
  teams: Team[];
  createdAt: string;
}

// Alert System
export type AlertType = 'pain' | 'fatigue' | 'mood' | 'overload' | 'streak_broken' | 'improvement';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  athleteId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  actionRequired: boolean;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Gamification System
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: string;
  category: 'consistency' | 'improvement' | 'milestone' | 'special';
}

// Gesundheitsstatus
export type HealthStatus = 'excellent' | 'good' | 'concern' | 'critical';

// Ziele-System
export interface Goal {
  id: string;
  athleteId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  isAchieved: boolean;
  createdBy: string;
  createdAt: string;
}

// Training Sessions (für zukünftige Versionen)
export interface TrainingSession {
  id: string;
  athleteId: string;
  coachId: string;
  date: string;
  type: string;
  duration: number; // Minuten
  intensityRPE: number; // 1-10
  trainingLoad: number; // duration * intensity
  notes?: string;
}

// Benachrichtigungs-System
export interface NotificationSettings {
  userId: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
  parentNotifications: boolean;
  coachUpdates: boolean;
  achievementNotifications: boolean;
  reminderTime?: string; // HH:MM
}

// DSGVO Compliance
export interface ConsentRecord {
  id: string;
  userId: string;
  parentId?: string; // für Minderjährige
  consentType: 'data_processing' | 'medical_data' | 'parent_access' | 'marketing' | 'dual_consent_minor';
  granted: boolean;
  grantedAt: string;
  revokedAt?: string;
  version: string;
  // Dual-Consent spezifisch
  isForMinor?: boolean;
  minorAge?: number;
  legalBasisGermany?: 'art6_1a_gdpr' | 'art8_gdpr_parental_consent';
  documentationUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Form Data Types
export interface DailyCheckinFormData {
  sleepQuality: number;
  fatigueLevel: number;
  muscleSoreness: number;
  moodRating: number;
  painLevel: number;
  painLocation?: string;
  stressLevel: number;
  notes?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterFormData extends LoginFormData {
  firstName: string;
  lastName: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  // GDPR Dual-Consent für Athleten
  birthDate?: string;
  parentEmail?: string; // Required für <16 Jahre
  parentConsent?: boolean; // Required für <16 Jahre
  acknowledgeMinorRights?: boolean; // Required für <16 Jahre
}

// Dual-Consent Flow Types
export interface DualConsentRequest {
  id: string;
  athleteId: string;
  parentId: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  consentTypes: string[];
  approvedAt?: string;
  rejectedAt?: string;
  expiresAt: string;
  notificationsSent: number;
}

export interface MinorRegistrationData {
  athlete: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    sport: string;
  };
  parent: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  consents: {
    dataProcessing: boolean;
    medicalData: boolean;
    parentAccess: boolean;
  };
}

// Dashboard Data Types
export interface AthleteDashboardData {
  athlete: Athlete;
  recentCheckins: DailyCheckin[];
  currentStreak: number;
  weeklyAverage: {
    sleep: number;
    fatigue: number;
    mood: number;
    pain: number;
  };
  activeAlerts: Alert[];
  achievements: Achievement[];
  goals: Goal[];
}

export interface CoachDashboardData {
  coach: Coach;
  teams: Team[];
  athletes: Athlete[];
  alerts: Alert[];
  teamHealthOverview: {
    athleteId: string;
    name: string;
    healthStatus: HealthStatus;
    lastCheckin: string;
    alertCount: number;
  }[];
}

export interface ParentDashboardData {
  parent: Parent;
  children: {
    athlete: Athlete;
    healthStatus: HealthStatus;
    lastCheckin?: DailyCheckin;
    alerts: Alert[];
    weeklyTrends: any;
  }[];
  notifications: Alert[];
}

// Storage Types
export interface LocalStorageData {
  users: User[];
  checkins: DailyCheckin[];
  alerts: Alert[];
  teams: Team[];
  clubs: Club[];
  goals: Goal[];
  achievements: Achievement[];
  sessions: TrainingSession[];
  notifications: NotificationSettings[];
  consents: ConsentRecord[];
  lastSync: string;
}

// Admin Permissions
export type AdminPermission = 
  | 'manage_users' 
  | 'manage_teams' 
  | 'view_analytics' 
  | 'export_data' 
  | 'system_config'
  | 'gdpr_compliance';

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface HealthTrendData {
  sleep: ChartDataPoint[];
  fatigue: ChartDataPoint[];
  mood: ChartDataPoint[];
  pain: ChartDataPoint[];
  soreness: ChartDataPoint[];
  stress: ChartDataPoint[];
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;