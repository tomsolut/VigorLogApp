// VigorLog - Zod Validation Schemas
// Type-safe Validierung für alle Formulare und Daten

import { z } from 'zod';
import type { UserRole, AlertType, AlertSeverity, HealthStatus } from '@/types';

// Basis-Validierungen
const emailSchema = z.string().email('Ungültige E-Mail-Adresse');
const passwordSchema = z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben');
const nameSchema = z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(50, 'Name darf maximal 50 Zeichen haben');

// Health Metrics Validierung (0-10 Skala)
const healthMetricSchema = z.number().min(0, 'Wert muss zwischen 0 und 10 liegen').max(10, 'Wert muss zwischen 0 und 10 liegen');

// Daily Check-in Validation Schema
export const DailyCheckinSchema = z.object({
  sleepQuality: healthMetricSchema,
  fatigueLevel: healthMetricSchema,
  muscleSoreness: healthMetricSchema,
  moodRating: healthMetricSchema,
  painLevel: healthMetricSchema,
  painLocation: z.string().max(100, 'Schmerzort-Beschreibung zu lang').optional(),
  stressLevel: healthMetricSchema,
  notes: z.string().max(500, 'Notizen zu lang (maximal 500 Zeichen)').optional(),
});

export type DailyCheckinData = z.infer<typeof DailyCheckinSchema>;

// User Role Validation
const userRoleSchema = z.enum(['athlete', 'coach', 'parent', 'admin'] as const);

// Base User Schema
const baseUserSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  role: userRoleSchema,
});

// Login Schema
export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Passwort ist erforderlich'),
  role: userRoleSchema.optional(),
});

export type LoginData = z.infer<typeof LoginSchema>;

// Registration Schema
export const RegisterSchema = baseUserSchema.extend({
  password: passwordSchema,
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'Sie müssen den Nutzungsbedingungen zustimmen',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
});

export type RegisterData = z.infer<typeof RegisterSchema>;

// Athlete-specific Schema
export const AthleteSchema = baseUserSchema.extend({
  role: z.literal('athlete'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datumsformat (YYYY-MM-DD)'),
  sport: z.string().min(2, 'Sportart muss angegeben werden').max(50),
  parentIds: z.array(z.string().uuid()).default([]),
});

export type AthleteData = z.infer<typeof AthleteSchema>;

// Coach-specific Schema
export const CoachSchema = baseUserSchema.extend({
  role: z.literal('coach'),
  licenseNumber: z.string().max(50).optional(),
  specializations: z.array(z.string()).default([]),
});

export type CoachData = z.infer<typeof CoachSchema>;

// Parent-specific Schema
export const ParentSchema = baseUserSchema.extend({
  role: z.literal('parent'),
  phoneNumber: z.string().regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Ungültige Telefonnummer').optional(),
  emergencyContact: z.boolean().default(false),
  hasDataConsent: z.boolean().default(false),
  hasMedicalConsent: z.boolean().default(false),
});

export type ParentData = z.infer<typeof ParentSchema>;

// Admin-specific Schema
export const AdminSchema = baseUserSchema.extend({
  role: z.literal('admin'),
  permissions: z.array(z.enum(['manage_users', 'manage_teams', 'view_analytics', 'export_data', 'system_config', 'gdpr_compliance'])).default([]),
});

export type AdminData = z.infer<typeof AdminSchema>;

// Team Schema
export const TeamSchema = z.object({
  name: z.string().min(2, 'Teamname muss mindestens 2 Zeichen haben').max(100),
  sport: z.string().min(2, 'Sportart muss angegeben werden').max(50),
  ageGroup: z.string().max(20, 'Altersgruppe zu lang'),
  coachId: z.string().uuid('Ungültige Coach-ID'),
});

export type TeamData = z.infer<typeof TeamSchema>;

// Club Schema
export const ClubSchema = z.object({
  name: z.string().min(2, 'Vereinsname muss mindestens 2 Zeichen haben').max(200),
  address: z.string().max(500).optional(),
  contactEmail: emailSchema.optional(),
  contactPhone: z.string().regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Ungültige Telefonnummer').optional(),
  licenseNumber: z.string().max(50).optional(),
});

export type ClubData = z.infer<typeof ClubSchema>;

// Goal Schema
export const GoalSchema = z.object({
  title: z.string().min(5, 'Ziel-Titel muss mindestens 5 Zeichen haben').max(200),
  description: z.string().max(1000).optional(),
  targetValue: z.number().positive('Zielwert muss positiv sein'),
  unit: z.string().max(20, 'Einheit zu lang'),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datumsformat'),
});

export type GoalData = z.infer<typeof GoalSchema>;

// Alert Schema
const alertTypeSchema = z.enum(['pain', 'fatigue', 'mood', 'overload', 'streak_broken', 'improvement'] as const);
const alertSeveritySchema = z.enum(['low', 'medium', 'high', 'critical'] as const);

export const AlertSchema = z.object({
  athleteId: z.string().uuid(),
  type: alertTypeSchema,
  severity: alertSeveritySchema,
  title: z.string().min(5, 'Alert-Titel zu kurz').max(200),
  message: z.string().min(10, 'Alert-Nachricht zu kurz').max(1000),
  actionRequired: z.boolean().default(false),
});

export type AlertData = z.infer<typeof AlertSchema>;

// Training Session Schema (für zukünftige Versionen)
export const TrainingSessionSchema = z.object({
  athleteId: z.string().uuid(),
  coachId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.string().min(2).max(50),
  duration: z.number().positive('Dauer muss positiv sein').max(480, 'Training kann nicht länger als 8 Stunden sein'),
  intensityRPE: z.number().min(1, 'RPE muss zwischen 1 und 10 liegen').max(10),
  notes: z.string().max(1000).optional(),
});

export type TrainingSessionData = z.infer<typeof TrainingSessionSchema>;

// Notification Settings Schema
export const NotificationSettingsSchema = z.object({
  emailAlerts: z.boolean().default(true),
  pushAlerts: z.boolean().default(true),
  parentNotifications: z.boolean().default(true),
  trainerUpdates: z.boolean().default(true),
  achievementNotifications: z.boolean().default(true),
  reminderTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Ungültiges Zeitformat (HH:MM)').optional(),
});

export type NotificationSettingsData = z.infer<typeof NotificationSettingsSchema>;

// GDPR Consent Schema
export const ConsentSchema = z.object({
  userId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  consentType: z.enum(['data_processing', 'medical_data', 'parent_access', 'marketing']),
  granted: z.boolean(),
  version: z.string().min(1, 'Consent-Version ist erforderlich'),
});

export type ConsentData = z.infer<typeof ConsentSchema>;

// Parent-Child Linking Schema
export const ParentChildLinkSchema = z.object({
  parentId: z.string().uuid('Ungültige Eltern-ID'),
  athleteId: z.string().uuid('Ungültige Athleten-ID'),
  relationshipType: z.enum(['parent', 'guardian', 'authorized_person']).default('parent'),
  hasDataConsent: z.boolean().default(false),
  hasMedicalConsent: z.boolean().default(false),
});

export type ParentChildLinkData = z.infer<typeof ParentChildLinkSchema>;

// Search and Filter Schemas
export const SearchSchema = z.object({
  query: z.string().max(100, 'Suchanfrage zu lang'),
  role: userRoleSchema.optional(),
  sport: z.string().max(50).optional(),
  healthStatus: z.enum(['excellent', 'good', 'concern', 'critical'] as const).optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type SearchData = z.infer<typeof SearchSchema>;

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100, 'Maximal 100 Einträge pro Seite').default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationData = z.infer<typeof PaginationSchema>;

// Utility Validation Functions
export const validateAge = (birthDate: string): boolean => {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 14 && age - 1 <= 18;
  }
  
  return age >= 14 && age <= 18;
};

export const validateCheckinDate = (date: string): boolean => {
  const checkinDate = new Date(date);
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  
  return checkinDate >= oneWeekAgo && checkinDate <= today;
};

// Error Messages
export const ValidationErrors = {
  REQUIRED: 'Dieses Feld ist erforderlich',
  INVALID_EMAIL: 'Ungültige E-Mail-Adresse',
  PASSWORD_TOO_SHORT: 'Passwort muss mindestens 8 Zeichen haben',
  PASSWORDS_DONT_MATCH: 'Passwörter stimmen nicht überein',
  INVALID_AGE: 'Athleten müssen zwischen 14 und 18 Jahre alt sein',
  INVALID_DATE: 'Ungültiges Datumsformat',
  VALUE_OUT_OF_RANGE: 'Wert liegt außerhalb des gültigen Bereichs',
  TEXT_TOO_LONG: 'Text ist zu lang',
  CONSENT_REQUIRED: 'Zustimmung ist erforderlich',
} as const;

// Schema Validation Helper
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Unbekannter Validierungsfehler'] };
  }
};