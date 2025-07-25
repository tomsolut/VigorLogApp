// VigorLog - Authentication Store (Zustand)
// Mock-Authentifizierung für Version 1 mit 4-Rollen-System

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';

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
  switchRole: (newRole: UserRole) => void; // Für Demo-Zwecke
  getCurrentUser: () => User | null;
  clearError: () => void;
  
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
          // Demo Athlete
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
          },
          // Demo Coach
          {
            id: 'demo-coach-1',
            email: 'coach.demo@vigorlog.com',
            firstName: 'Sarah',
            lastName: 'Coach',
            role: 'coach',
            createdAt: new Date().toISOString(),
            isActive: true,
            licenseNumber: 'TR-2024-001',
            specializations: ['Jugendtraining', 'Konditionstraining'],
            teamIds: ['demo-team-1'],
            clubId: 'demo-club-1',
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
            childrenIds: ['demo-athlete-1'],
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
        const users = storage.getUsers();
        const demoUser = users.find(u => u.role === role && u.id.startsWith('demo-'));

        if (demoUser) {
          set({ 
            currentUser: demoUser, 
            isAuthenticated: true, 
            error: null 
          });
          console.log(`Demo login as ${role}: ${demoUser.firstName} ${demoUser.lastName}`);
        } else {
          set({ error: `Demo-${role} nicht gefunden` });
        }
      },
    }),
    {
      name: 'vigorlog-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
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
    switchRole: store.switchRole,
    clearError: store.clearError,
    createDemoUsers: store.createDemoUsers,
    loginAsDemo: store.loginAsDemo,
  };
};

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