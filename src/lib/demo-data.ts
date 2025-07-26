// Demo data for development
import { User, Team, DailyCheckin, Alert, Goal, Achievement } from '@/types';
import { generateId } from './utils';

// Demo Coach
export const demoCoach: User = {
  id: 'demo-coach-1',
  email: 'coach.demo@vigorlog.com',
  role: 'coach',
  firstName: 'Sarah',
  lastName: 'Schmidt',
  createdAt: '2024-01-01T10:00:00Z',
  isActive: true,
  licenseNumber: 'DFB-2024-1234',
  specializations: ['Fußball', 'Athletik', 'Jugendtraining'],
  teamIds: ['team-1', 'team-2'],
  clubId: 'club-1'
} as any;

// Demo Teams
export const demoTeams: Team[] = [
  {
    id: 'team-1',
    name: 'U16 Fußball',
    sport: 'Fußball',
    ageGroup: 'U16',
    coachId: 'demo-coach-1',
    athleteIds: ['demo-athlete-1', 'demo-athlete-2', 'athlete-2', 'athlete-3'],
    clubId: 'club-1',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'team-2',
    name: 'U18 Fußball',
    sport: 'Fußball', 
    ageGroup: 'U18',
    coachId: 'demo-coach-1',
    athleteIds: ['athlete-4', 'athlete-5'],
    clubId: 'club-1',
    createdAt: '2024-01-01T10:00:00Z'
  }
];

// Update original demo athlete to be in team
export const updatedDemoAthlete: User = {
  id: 'demo-athlete-1',
  email: 'max.demo@vigorlog.com',
  role: 'athlete',
  firstName: 'Max',
  lastName: 'Mustermann',
  createdAt: '2024-01-01T10:00:00Z',
  isActive: true,
  birthDate: '2008-05-15',
  sport: 'Fußball',
  teamId: 'team-1',
  parentIds: ['demo-parent-1'],
  currentStreak: 5,
  totalPoints: 250,
  achievements: [],
  healthStatus: 'good',
  needsParentalConsent: true,
  hasParentalConsent: true,
  parentalConsentDate: '2024-01-01T10:00:00Z',
  parentalConsentBy: 'demo-parent-1'
} as any;

// Update demo athlete 2 to have parent relationship
export const updatedDemoAthlete2: User = {
  id: 'demo-athlete-2',
  email: 'sophie.demo@vigorlog.com',
  role: 'athlete',
  firstName: 'Sophie',
  lastName: 'Müller',
  createdAt: '2024-01-01T10:00:00Z',
  isActive: true,
  birthDate: '2009-07-22',
  sport: 'Basketball',
  teamId: 'team-1',
  parentIds: ['demo-parent-1'],
  currentStreak: 0,
  totalPoints: 180,
  achievements: [],
  healthStatus: 'unknown',
  needsParentalConsent: true,
  hasParentalConsent: true,
  parentalConsentDate: '2024-01-01T10:00:00Z',
  parentalConsentBy: 'demo-parent-1'
} as any;

// Additional demo athletes
export const additionalAthletes: User[] = [
  {
    id: 'athlete-2',
    email: 'lisa.mueller@demo.com',
    role: 'athlete',
    firstName: 'Lisa',
    lastName: 'Müller',
    createdAt: '2024-01-10T10:00:00Z',
    isActive: true,
    birthDate: '2009-05-12',
    sport: 'Fußball',
    teamId: 'team-1',
    parentIds: [],
    currentStreak: 12,
    totalPoints: 850,
    achievements: [],
    healthStatus: 'excellent',
    needsParentalConsent: true,
    hasParentalConsent: true,
    parentalConsentDate: '2024-01-10T10:00:00Z'
  } as any,
  {
    id: 'athlete-3',
    email: 'tim.wagner@demo.com',
    role: 'athlete',
    firstName: 'Tim',
    lastName: 'Wagner',
    createdAt: '2024-01-15T10:00:00Z',
    isActive: true,
    birthDate: '2009-11-23',
    sport: 'Fußball',
    teamId: 'team-1',
    parentIds: [],
    currentStreak: 3,
    totalPoints: 320,
    achievements: [],
    healthStatus: 'concern',
    needsParentalConsent: true,
    hasParentalConsent: true,
    parentalConsentDate: '2024-01-15T10:00:00Z'
  } as any,
  {
    id: 'athlete-4',
    email: 'anna.becker@demo.com',
    role: 'athlete',
    firstName: 'Anna',
    lastName: 'Becker',
    createdAt: '2024-01-05T10:00:00Z',
    isActive: true,
    birthDate: '2007-03-18',
    sport: 'Fußball',
    teamId: 'team-2',
    parentIds: [],
    currentStreak: 25,
    totalPoints: 1200,
    achievements: [],
    healthStatus: 'good',
    needsParentalConsent: false,
    hasParentalConsent: false
  } as any,
  {
    id: 'athlete-5',
    email: 'lukas.meyer@demo.com',
    role: 'athlete',
    firstName: 'Lukas',
    lastName: 'Meyer',
    createdAt: '2024-01-08T10:00:00Z',
    isActive: true,
    birthDate: '2007-08-30',
    sport: 'Fußball',
    teamId: 'team-2',
    parentIds: [],
    currentStreak: 0,
    totalPoints: 150,
    achievements: [],
    healthStatus: 'critical',
    needsParentalConsent: false,
    hasParentalConsent: false
  } as any
];

// Generate demo checkins for additional athletes
export function generateDemoCheckins(): DailyCheckin[] {
  const checkins: DailyCheckin[] = [];
  const athleteIds = ['demo-athlete-1', 'demo-athlete-2', 'athlete-2', 'athlete-3', 'athlete-4', 'athlete-5'];
  
  athleteIds.forEach(athleteId => {
    // Generate last 14 days of checkins
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Skip some days randomly for realistic data
      if (Math.random() > 0.8 && i > 0) continue;
      
      // Different patterns for different athletes
      let sleepQuality = 6 + Math.random() * 3;
      let fatigueLevel = 3 + Math.random() * 4;
      let muscleSoreness = 2 + Math.random() * 5;
      let moodRating = 6 + Math.random() * 3;
      let painLevel = 1 + Math.random() * 3;
      let stressLevel = 3 + Math.random() * 4;
      
      // Athlete-specific patterns
      if (athleteId === 'demo-athlete-1') {
        // Good health - Max
        sleepQuality = 7 + Math.random() * 2;
        moodRating = 7 + Math.random() * 2;
        painLevel = 1 + Math.random() * 2;
        fatigueLevel = 3 + Math.random() * 2;
      } else if (athleteId === 'athlete-2') {
        // Excellent health
        sleepQuality = 8 + Math.random() * 2;
        moodRating = 8 + Math.random() * 2;
        painLevel = Math.random() * 2;
      } else if (athleteId === 'athlete-3') {
        // Concern status - higher pain
        painLevel = 5 + Math.random() * 3;
        muscleSoreness = 6 + Math.random() * 3;
      } else if (athleteId === 'athlete-5') {
        // Critical status
        sleepQuality = 3 + Math.random() * 3;
        fatigueLevel = 7 + Math.random() * 2;
        stressLevel = 7 + Math.random() * 2;
        moodRating = 3 + Math.random() * 3;
      }
      
      checkins.push({
        id: generateId(),
        athleteId,
        date: date.toISOString().split('T')[0],
        sleepQuality: Math.round(sleepQuality),
        fatigueLevel: Math.round(fatigueLevel),
        muscleSoreness: Math.round(muscleSoreness),
        moodRating: Math.round(moodRating),
        painLevel: Math.round(painLevel),
        stressLevel: Math.round(stressLevel),
        completedAt: date.toISOString()
      });
    }
  });
  
  return checkins;
}

// Generate demo alerts
export function generateDemoAlerts(): Alert[] {
  const alerts: Alert[] = [];
  
  // Critical alert for athlete-5
  alerts.push({
    id: generateId(),
    athleteId: 'athlete-5',
    type: 'fatigue',
    severity: 'critical',
    title: 'Kritische Erschöpfung',
    message: 'Lukas zeigt seit 5 Tagen hohe Müdigkeitswerte. Sofortiges Eingreifen empfohlen.',
    actionRequired: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  });
  
  // High alert for athlete-3
  alerts.push({
    id: generateId(),
    athleteId: 'athlete-3',
    type: 'pain',
    severity: 'high',
    title: 'Anhaltende Schmerzen',
    message: 'Tim meldet wiederholt Schmerzen im Kniebereich. Medizinische Abklärung empfohlen.',
    actionRequired: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  });
  
  // Medium alert for athlete-4
  alerts.push({
    id: generateId(),
    athleteId: 'athlete-4',
    type: 'overload',
    severity: 'medium',
    title: 'Trainingsbelastung erhöht',
    message: 'Anna zeigt Anzeichen von Übertraining. Trainingsintensität überprüfen.',
    actionRequired: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  });
  
  return alerts;
}

// Initialize demo data
export function initializeDemoData() {
  // Use dynamic import to avoid circular dependency
  import('./storage').then(({ storage }) => {
    const data = storage.getAllData();
    
    // Check if demo teams already exist
    if (data && data.teams && data.teams.length > 0) {
      console.log('Demo data already exists');
      return;
    }
    
    // Get existing users
    const existingUsers = data?.users || [];
    
    // Update demo-athlete-1 to be in team
    const demoAthleteIndex = existingUsers.findIndex(u => u.id === 'demo-athlete-1');
    if (demoAthleteIndex !== -1) {
      existingUsers[demoAthleteIndex] = updatedDemoAthlete;
    }
    
    // Update demo-athlete-2 to have parent relationship
    const demoAthlete2Index = existingUsers.findIndex(u => u.id === 'demo-athlete-2');
    if (demoAthlete2Index !== -1) {
      existingUsers[demoAthlete2Index] = updatedDemoAthlete2;
    }
    
    // Add demo coach if not exists
    if (!existingUsers.find(u => u.id === 'coach-1')) {
      existingUsers.push(demoCoach);
    }
    
    // Add additional athletes if not exist
    additionalAthletes.forEach(athlete => {
      if (!existingUsers.find(u => u.id === athlete.id)) {
        existingUsers.push(athlete);
      }
    });
    
    // Get existing data or create new
    const existingCheckins = data?.checkins || [];
    const existingAlerts = data?.alerts || [];
    
    // Add demo checkins
    const newCheckins = generateDemoCheckins();
    newCheckins.forEach(checkin => {
      if (!existingCheckins.find(c => c.id === checkin.id)) {
        existingCheckins.push(checkin);
      }
    });
    
    // Add demo alerts
    const newAlerts = generateDemoAlerts();
    newAlerts.forEach(alert => {
      if (!existingAlerts.find(a => a.id === alert.id)) {
        existingAlerts.push(alert);
      }
    });
    
    const updatedData = {
      users: existingUsers,
      checkins: existingCheckins,
      alerts: existingAlerts,
      teams: demoTeams,
      clubs: [{
        id: 'club-1',
        name: 'FC Musterstadt',
        address: 'Sportplatz 1, 12345 Musterstadt',
        contactEmail: 'info@fc-musterstadt.de',
        contactPhone: '+49 123 456789',
        licenseNumber: 'FCM-2024',
        teams: demoTeams,
        createdAt: '2024-01-01T10:00:00Z'
      }],
      goals: data?.goals || [],
      achievements: data?.achievements || [],
      sessions: data?.sessions || [],
      notifications: data?.notifications || [],
      consents: data?.consents || [],
      lastSync: new Date().toISOString()
    };
    
    storage.setAllData(updatedData);
    console.log('Demo data initialized');
  });
}