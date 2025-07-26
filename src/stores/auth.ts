// VigorLog - Authentication Store (Zustand)
// Mock-Authentifizierung für Version 1 mit 4-Rollen-System

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, MinorRegistrationData, ConsentRecord, DualConsentRequest } from '@/types';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { 
  calculateAge, 
  needsParentalConsent, 
  createDualConsentRecord,
  validateMinorRegistration 
} from '@/lib/dual-consent';

interface AuthState {
  // State
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterUserData) => Promise<boolean>;
  registerMinor: (data: MinorRegistrationData) => Promise<boolean>;
  switchRole: (newRole: UserRole) => void; // Für Demo-Zwecke
  getCurrentUser: () => User | null;
  clearError: () => void;
  
  // Dual-Consent Functions
  checkConsentStatus: (athleteId: string) => Promise<{ compliant: boolean; missing: string[] }>;
  requestParentalConsent: (athleteId: string, parentId: string) => Promise<boolean>;
  approveParentalConsent: (requestId: string, parentId: string) => Promise<boolean>;
  
  // Demo Functions
  createDemoUsers: () => void;
  loginAsDemo: (role: UserRole) => void;
}

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  additionalData?: any;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login Action
      login: async (email: string, password: string, role?: UserRole) => {
        set({ isLoading: true, error: null });

        try {
          // Mock-Authentifizierung - in Produktion würde hier ein API-Call stehen
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

          const users = storage.getUsers();
          const user = users.find(u => u.email === email);

          if (!user) {
            set({ error: 'Benutzer nicht gefunden', isLoading: false });
            return false;
          }

          // Einfache Passwort-Prüfung (in Produktion sollte gehashed werden)
          if (password !== 'demo123') {
            set({ error: 'Ungültiges Passwort', isLoading: false });
            return false;
          }

          // Rollen-Check falls spezifiziert
          if (role && user.role !== role) {
            set({ error: 'Ungültige Rolle für diesen Benutzer', isLoading: false });
            return false;
          }

          set({ 
            currentUser: user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });

          console.log(`User logged in: ${user.firstName} ${user.lastName} (${user.role})`);
          return true;

        } catch (error) {
          console.error('Login error:', error);
          set({ 
            error: 'Anmeldung fehlgeschlagen', 
            isLoading: false 
          });
          return false;
        }
      },

      // Logout Action
      logout: () => {
        set({ 
          currentUser: null, 
          isAuthenticated: false, 
          error: null 
        });
        console.log('User logged out');
      },

      // Register Action
      register: async (userData: RegisterUserData) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 800));

          // Prüfe ob E-Mail bereits existiert
          const existingUser = storage.getUserByEmail(userData.email);
          if (existingUser) {
            set({ error: 'E-Mail-Adresse bereits registriert', isLoading: false });
            return false;
          }

          // Erstelle neuen Benutzer basierend auf Rolle
          const baseUser = {
            id: generateId(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            createdAt: new Date().toISOString(),
            isActive: true,
          };

          let newUser: User;

          switch (userData.role) {
            case 'athlete':
              newUser = {
                ...baseUser,
                role: 'athlete',
                birthDate: userData.additionalData?.birthDate || '2008-01-01',
                sport: userData.additionalData?.sport || 'Fußball',
                teamId: userData.additionalData?.teamId,
                parentIds: [],
                currentStreak: 0,
                totalPoints: 0,
                achievements: [],
                healthStatus: 'good',
              };
              break;

            case 'coach':
              newUser = {
                ...baseUser,
                role: 'coach',
                licenseNumber: userData.additionalData?.licenseNumber,
                specializations: userData.additionalData?.specializations || [],
                teamIds: [],
                clubId: userData.additionalData?.clubId,
              };
              break;

            case 'parent':
              newUser = {
                ...baseUser,
                role: 'parent',
                childrenIds: [],
                phoneNumber: userData.additionalData?.phoneNumber,
                emergencyContact: false,
                hasDataConsent: false,
                hasMedicalConsent: false,
              };
              break;

            case 'admin':
              newUser = {
                ...baseUser,
                role: 'admin',
                permissions: userData.additionalData?.permissions || ['manage_users'],
                clubId: userData.additionalData?.clubId,
              };
              break;

            default:
              throw new Error('Ungültige Rolle');
          }

          // Speichere Benutzer
          const success = storage.addUser(newUser);
          if (!success) {
            set({ error: 'Fehler beim Speichern des Benutzers', isLoading: false });
            return false;
          }

          set({ 
            currentUser: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });

          console.log(`New user registered: ${newUser.firstName} ${newUser.lastName} (${newUser.role})`);
          return true;

        } catch (error) {
          console.error('Registration error:', error);
          set({ 
            error: 'Registrierung fehlgeschlagen', 
            isLoading: false 
          });
          return false;
        }
      },

      // Demo Role Switch (nur für Entwicklung)
      switchRole: (newRole: UserRole) => {
        const { currentUser } = get();
        if (!currentUser) return;

        // Suche Demo-User mit der gewünschten Rolle
        const users = storage.getUsers();
        const demoUser = users.find(u => u.role === newRole && u.email.includes('demo'));

        if (demoUser) {
          set({ currentUser: demoUser });
          console.log(`Switched to demo ${newRole}: ${demoUser.firstName} ${demoUser.lastName}`);
        }
      },

      // Get Current User
      getCurrentUser: () => {
        return get().currentUser;
      },

      // Clear Error
      clearError: () => {
        set({ error: null });
      },

      // Demo Functions
      createDemoUsers: () => {
        const demoUsers: User[] = [
          // Demo Athlete (unter 16, benötigt Dual-Consent)
          {
            id: 'demo-athlete-1',
            email: 'max.demo@vigorlog.com',
            firstName: 'Max',
            lastName: 'Mustermann',
            role: 'athlete',
            createdAt: new Date().toISOString(),
            isActive: true,
            birthDate: '2008-05-15',
            sport: 'Fußball',
            teamId: 'demo-team-1',
            parentIds: ['demo-parent-1'],
            currentStreak: 5,
            totalPoints: 250,
            achievements: [],
            healthStatus: 'good',
            needsParentalConsent: true,
            hasParentalConsent: true,
            parentalConsentDate: new Date().toISOString(),
            parentalConsentBy: 'demo-parent-1'
          },
          // Demo Athlete 2 (ohne heutigen Check-in)
          {
            id: 'demo-athlete-2',
            email: 'sophie.demo@vigorlog.com',
            firstName: 'Sophie',
            lastName: 'Müller',
            role: 'athlete',
            createdAt: new Date().toISOString(),
            isActive: true,
            birthDate: '2009-03-22',
            sport: 'Basketball',
            teamId: 'team-2',
            parentIds: [],
            currentStreak: 0,
            totalPoints: 180,
            achievements: [],
            healthStatus: 'unknown',
            needsParentalConsent: true,
            hasParentalConsent: false,
            parentalConsentDate: undefined,
            parentalConsentBy: undefined
          },
          // Demo Coach
          {
            id: 'demo-coach-1',
            email: 'coach.demo@vigorlog.com',
            firstName: 'Sarah',
            lastName: 'Schmidt',
            role: 'coach',
            createdAt: new Date().toISOString(),
            isActive: true,
            licenseNumber: 'TR-2024-001',
            specializations: ['Jugendtraining', 'Konditionstraining'],
            teamIds: ['team-1', 'team-2'],
            clubId: 'club-1',
          },
          // Demo Parent
          {
            id: 'demo-parent-1',
            email: 'parent.demo@vigorlog.com',
            firstName: 'Maria',
            lastName: 'Mustermann',
            role: 'parent',
            createdAt: new Date().toISOString(),
            isActive: true,
            childrenIds: ['demo-athlete-1', 'demo-athlete-2'],
            phoneNumber: '+49 123 456789',
            emergencyContact: true,
            hasDataConsent: true,
            hasMedicalConsent: true,
            consentDate: new Date().toISOString(),
          },
          // Demo Admin
          {
            id: 'demo-admin-1',
            email: 'admin.demo@vigorlog.com',
            firstName: 'Thomas',
            lastName: 'Administrator',
            role: 'admin',
            createdAt: new Date().toISOString(),
            isActive: true,
            permissions: ['manage_users', 'manage_teams', 'view_analytics', 'system_config'],
            clubId: 'demo-club-1',
          },
        ];

        // Prüfe ob Demo-User bereits existieren
        const existingUsers = storage.getUsers();
        const needsDemo = demoUsers.some(demoUser => 
          !existingUsers.some(existing => existing.id === demoUser.id)
        );

        if (needsDemo) {
          // Füge Demo-User hinzu
          const allUsers = [...existingUsers];
          demoUsers.forEach(demoUser => {
            if (!allUsers.some(existing => existing.id === demoUser.id)) {
              allUsers.push(demoUser);
            }
          });
          
          storage.updateUsers(allUsers);
          console.log('Demo users created successfully');
        }
      },

      // Quick Demo Login
      loginAsDemo: (role: UserRole) => {
        logger.info('AuthStore', 'Demo login started', { role });
        
        try {
          const users = storage.getUsers();
          logger.debug('AuthStore', 'Available users', { 
            count: users.length,
            users: users.map(u => ({ id: u.id, role: u.role, name: `${u.firstName} ${u.lastName}` }))
          });
          
          // Find demo user - either with demo- prefix or the specific IDs from demo-data
          const demoUser = users.find(u => {
            if (u.role !== role) return false;
            
            // Original demo users
            if (u.id.startsWith('demo-')) return true;
            
            // New demo users from demo-data.ts
            if (role === 'coach' && (u.id === 'coach-1' || u.id === 'demo-coach-1')) return true;
            if (role === 'athlete' && ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4', 'athlete-5', 'demo-athlete-2'].includes(u.id)) return true;
            if (role === 'parent' && u.id === 'demo-parent-1') return true;
            if (role === 'admin' && u.id === 'demo-admin-1') return true;
            
            return false;
          });

          if (demoUser) {
            set({ 
              currentUser: demoUser, 
              isAuthenticated: true, 
              error: null 
            });
            
            logger.info('AuthStore', 'Demo login successful', {
              userId: demoUser.id,
              role: demoUser.role,
              name: `${demoUser.firstName} ${demoUser.lastName}`
            });
          } else {
            logger.error('AuthStore', 'Demo user not found, creating demo users', { role });
            
            // Try to create demo users and retry
            get().createDemoUsers();
            
            // Wait a bit for users to be created
            setTimeout(() => {
              const retryUsers = storage.getUsers();
              const retryDemoUser = retryUsers.find(u => {
                if (u.role !== role) return false;
                if (u.id.startsWith('demo-')) return true;
                if (role === 'coach' && (u.id === 'coach-1' || u.id === 'demo-coach-1')) return true;
                if (role === 'athlete' && ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4', 'athlete-5', 'demo-athlete-2'].includes(u.id)) return true;
                if (role === 'parent' && u.id === 'demo-parent-1') return true;
                if (role === 'admin' && u.id === 'demo-admin-1') return true;
                return false;
              });
              
              if (retryDemoUser) {
                set({ 
                  currentUser: retryDemoUser, 
                  isAuthenticated: true, 
                  error: null 
                });
                logger.info('AuthStore', 'Demo login successful after retry', {
                  userId: retryDemoUser.id,
                  role: retryDemoUser.role
                });
              } else {
                set({ error: `Demo-${role} konnte nicht erstellt werden` });
              }
            }, 200);
          }
        } catch (error) {
          logger.error('AuthStore', 'Demo login failed', { error, role });
          set({ error: 'Login fehlgeschlagen' });
        }
      },

      // Minderjährigen-Registrierung mit Dual-Consent
      registerMinor: async (data: MinorRegistrationData) => {
        set({ isLoading: true, error: null });

        try {
          // Validiere Eingabedaten
          const validation = validateMinorRegistration(data);
          if (!validation.valid) {
            set({ error: `Validierungsfehler: ${validation.errors.join(', ')}`, isLoading: false });
            return false;
          }

          const age = calculateAge(data.athlete.birthDate);
          const needsConsent = needsParentalConsent(data.athlete.birthDate);

          // Erstelle Parent-Account
          const parentId = generateId();
          const parentUser: User = {
            id: parentId,
            email: data.parent.email,
            firstName: data.parent.firstName,
            lastName: data.parent.lastName,
            role: 'parent',
            createdAt: new Date().toISOString(),
            isActive: true,
            childrenIds: [],
            phoneNumber: data.parent.phoneNumber,
            emergencyContact: true,
            hasDataConsent: true,
            hasMedicalConsent: true,
            consentDate: new Date().toISOString(),
            canGiveConsentFor: [],
            consentHistory: []
          };

          // Erstelle Athlete-Account
          const athleteId = generateId();
          const athleteUser: User = {
            id: athleteId,
            email: data.athlete.email,
            firstName: data.athlete.firstName,
            lastName: data.athlete.lastName,
            role: 'athlete',
            createdAt: new Date().toISOString(),
            isActive: true,
            birthDate: data.athlete.birthDate,
            sport: data.athlete.sport,
            teamId: undefined,
            parentIds: [parentId],
            currentStreak: 0,
            totalPoints: 0,
            achievements: [],
            healthStatus: 'good',
            needsParentalConsent: needsConsent,
            hasParentalConsent: needsConsent, // Consent wird direkt erteilt
            parentalConsentDate: needsConsent ? new Date().toISOString() : undefined,
            parentalConsentBy: needsConsent ? parentId : undefined
          };

          // Update Parent mit Child-Referenz
          parentUser.childrenIds = [athleteId];
          if (needsConsent) {
            parentUser.canGiveConsentFor = [athleteId];
          }

          // Speichere beide Accounts
          const parentSuccess = storage.addUser(parentUser);
          const athleteSuccess = storage.addUser(athleteUser);

          if (!parentSuccess || !athleteSuccess) {
            set({ error: 'Fehler beim Speichern der Benutzer', isLoading: false });
            return false;
          }

          // Erstelle Consent Records falls erforderlich
          if (needsConsent) {
            const consentRecords: ConsentRecord[] = [
              createDualConsentRecord(athleteId, parentId, 'data_processing', data.consents.dataProcessing),
              createDualConsentRecord(athleteId, parentId, 'medical_data', data.consents.medicalData),
              createDualConsentRecord(athleteId, parentId, 'parent_access', data.consents.parentAccess)
            ];

            // Speichere Consent Records (wird in der Storage-Implementation hinzugefügt)
            console.log('Dual-Consent Records created:', consentRecords);
          }

          // Log in as Athlete
          set({
            currentUser: athleteUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          console.log(`Minor registered: ${athleteUser.firstName} ${athleteUser.lastName} (${age} Jahre, Parent: ${parentUser.firstName} ${parentUser.lastName})`);
          return true;

        } catch (error) {
          console.error('Minor registration error:', error);
          set({
            error: 'Fehler bei der Minderjährigen-Registrierung',
            isLoading: false
          });
          return false;
        }
      },

      // Consent-Status prüfen
      checkConsentStatus: async (athleteId: string) => {
        const users = storage.getUsers();
        const athlete = users.find(u => u.id === athleteId && u.role === 'athlete') as any;
        
        if (!athlete) {
          return { compliant: false, missing: ['Athlet nicht gefunden'] };
        }

        const age = calculateAge(athlete.birthDate);
        if (age >= 16) {
          return { compliant: true, missing: [] };
        }

        const missing: string[] = [];
        
        if (!athlete.hasParentalConsent) {
          missing.push('Parental Consent');
        }
        
        if (athlete.parentIds.length === 0) {
          missing.push('Parent-Verknüpfung');
        }

        return {
          compliant: missing.length === 0,
          missing
        };
      },

      // Parental Consent anfordern
      requestParentalConsent: async (athleteId: string, parentId: string) => {
        // Hier würde normalerweise eine E-Mail-Benachrichtigung versendet werden
        console.log(`Parental consent requested for athlete ${athleteId} from parent ${parentId}`);
        return true;
      },

      // Parental Consent genehmigen  
      approveParentalConsent: async (requestId: string, parentId: string) => {
        // Implementation für Consent-Genehmigung
        console.log(`Parental consent approved by parent ${parentId} for request ${requestId}`);
        return true;
      },
    }),
    {
      name: 'vigorlog-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: false,
    }
  )
);

// Helper function für Component usage
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    user: store.currentUser,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    register: store.register,
    registerMinor: store.registerMinor,
    switchRole: store.switchRole,
    clearError: store.clearError,
    checkConsentStatus: store.checkConsentStatus,
    requestParentalConsent: store.requestParentalConsent,
    approveParentalConsent: store.approveParentalConsent,
    createDemoUsers: store.createDemoUsers,
    loginAsDemo: store.loginAsDemo,
  };
};

// Client-side initialization
if (typeof window !== 'undefined') {
  // Wait for hydration to complete before creating demo users
  setTimeout(() => {
    const state = useAuthStore.getState();
    const users = storage.getUsers();
    
    // If no users exist, create demo users
    if (users.length === 0) {
      state.createDemoUsers();
    }
  }, 100);
}

// Helper für Permission-Checks
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    if (user.role === 'admin') {
      return (user as any).permissions?.includes(permission) || false;
    }
    
    // Rolle-basierte Berechtigungen
    switch (user.role) {
      case 'coach':
        return ['view_team', 'manage_athletes', 'create_alerts'].includes(permission);
      case 'parent':
        return ['view_children', 'receive_alerts'].includes(permission);
      case 'athlete':
        return ['view_own_data', 'create_checkin'].includes(permission);
      default:
        return false;
    }
  };

  const canViewUser = (targetUserId: string): boolean => {
    if (!user) return false;
    
    // Benutzer kann eigene Daten sehen
    if (user.id === targetUserId) return true;
    
    // Admin kann alle sehen
    if (user.role === 'admin') return true;
    
    // Parent kann Kinder sehen
    if (user.role === 'parent') {
      return (user as any).childrenIds?.includes(targetUserId) || false;
    }
    
    // Coach kann Team-Athleten sehen
    if (user.role === 'coach') {
      const users = storage.getUsers();
      const targetUser = users.find(u => u.id === targetUserId);
      if (targetUser?.role === 'athlete') {
        const coachTeamIds = (user as any).teamIds || [];
        const athleteTeamId = (targetUser as any).teamId;
        return coachTeamIds.includes(athleteTeamId);
      }
    }
    
    return false;
  };

  return {
    hasPermission,
    canViewUser,
    isAdmin: user?.role === 'admin',
    isCoach: user?.role === 'coach',
    isParent: user?.role === 'parent',
    isAthlete: user?.role === 'athlete',
  };
};