// VigorLog - LocalStorage Manager mit Verschlüsselung
// DSGVO-konforme Datenspeicherung für sensitive Gesundheitsdaten

import { LocalStorageData } from '@/types';

// Einfache Verschlüsselung für localStorage (Version 1)
// In Produktion sollte eine robustere Lösung verwendet werden
class SimpleEncryption {
  private readonly key: string;

  constructor() {
    // Einfacher Schlüssel - in Produktion sollte dieser sicherer generiert werden
    this.key = 'vigorlog-health-data-2024';
  }

  encrypt(data: string): string {
    try {
      // Base64 Encoding mit einfachem XOR-Verschlüsselung
      const encrypted = data
        .split('')
        .map((char, index) => 
          String.fromCharCode(char.charCodeAt(0) ^ this.key.charCodeAt(index % this.key.length))
        )
        .join('');
      
      return btoa(encrypted);
    } catch (error) {
      console.error('Encryption error:', error);
      return data; // Fallback ohne Verschlüsselung
    }
  }

  decrypt(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData);
      const decrypted = decoded
        .split('')
        .map((char, index) => 
          String.fromCharCode(char.charCodeAt(0) ^ this.key.charCodeAt(index % this.key.length))
        )
        .join('');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData; // Fallback
    }
  }
}

export class VigorLogStorage {
  private encryption: SimpleEncryption;
  private readonly STORAGE_KEY = 'vigorlog_data';
  private readonly VERSION_KEY = 'vigorlog_version';
  private readonly CURRENT_VERSION = '1.0.0';

  // Sensitive Datentypen die verschlüsselt werden sollen
  private readonly SENSITIVE_KEYS = [
    'checkins',
    'alerts', 
    'users',
    'consents'
  ];

  constructor() {
    this.encryption = new SimpleEncryption();
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }

    // Version Check - Migration bei Schema-Updates
    const currentVersion = localStorage.getItem(this.VERSION_KEY);
    if (!currentVersion || currentVersion !== this.CURRENT_VERSION) {
      this.migrateData(currentVersion);
      localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
    }

    // Initialisiere mit Default-Daten falls noch nicht vorhanden
    const existingData = this.getAllData();
    if (!existingData) {
      this.setAllData(this.getDefaultData());
    }
  }

  private isStorageAvailable(): boolean {
    try {
      const test = '__vigorlog_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getDefaultData(): LocalStorageData {
    return {
      users: [],
      checkins: [],
      alerts: [],
      teams: [],
      clubs: [],
      goals: [],
      achievements: [],
      sessions: [],
      notifications: [],
      consents: [],
      lastSync: new Date().toISOString(),
    };
  }

  private migrateData(fromVersion: string | null): void {
    console.log(`Migrating data from version ${fromVersion} to ${this.CURRENT_VERSION}`);
    
    // Hier würden Datenmigrationen implementiert werden
    // Für Version 1 noch nicht nötig
    
    if (!fromVersion) {
      // Erste Installation
      console.log('First time setup - initializing storage');
    }
  }

  // Haupt-Methoden für Datenzugriff
  public getAllData(): LocalStorageData | null {
    if (!this.isStorageAvailable()) return null;

    try {
      const rawData = localStorage.getItem(this.STORAGE_KEY);
      if (!rawData) return null;

      const decryptedData = this.encryption.decrypt(rawData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error reading storage data:', error);
      return null;
    }
  }

  public setAllData(data: LocalStorageData): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      data.lastSync = new Date().toISOString();
      const jsonData = JSON.stringify(data);
      const encryptedData = this.encryption.encrypt(jsonData);
      
      localStorage.setItem(this.STORAGE_KEY, encryptedData);
      return true;
    } catch (error) {
      console.error('Error saving storage data:', error);
      return false;
    }
  }

  // Spezifische Getter-Methoden
  public getUsers() {
    const data = this.getAllData();
    return data?.users || [];
  }

  public getCheckins() {
    const data = this.getAllData();
    return data?.checkins || [];
  }

  public getAlerts() {
    const data = this.getAllData();
    return data?.alerts || [];
  }

  public getTeams() {
    const data = this.getAllData();
    return data?.teams || [];
  }

  public getGoals() {
    const data = this.getAllData();
    return data?.goals || [];
  }

  public getAchievements() {
    const data = this.getAllData();
    return data?.achievements || [];
  }

  // Spezifische Setter-Methoden
  public updateUsers(users: LocalStorageData['users']): boolean {
    const data = this.getAllData();
    if (!data) return false;

    data.users = users;
    return this.setAllData(data);
  }

  public updateCheckins(checkins: LocalStorageData['checkins']): boolean {
    const data = this.getAllData();
    if (!data) return false;

    data.checkins = checkins;
    return this.setAllData(data);
  }

  public updateAlerts(alerts: LocalStorageData['alerts']): boolean {
    const data = this.getAllData();
    if (!data) return false;

    data.alerts = alerts;
    return this.setAllData(data);
  }

  // Utility-Methoden
  public getUserById(id: string) {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  public getUserByEmail(email: string) {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  public getCheckinsByAthleteId(athleteId: string) {
    const checkins = this.getCheckins();
    return checkins.filter(checkin => checkin.athleteId === athleteId);
  }

  public getRecentCheckins(athleteId: string, days: number = 7) {
    const checkins = this.getCheckinsByAthleteId(athleteId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return checkins
      .filter(checkin => new Date(checkin.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getAlertsByAthleteId(athleteId: string, onlyUnresolved: boolean = false) {
    const alerts = this.getAlerts();
    return alerts.filter(alert => {
      if (alert.athleteId !== athleteId) return false;
      if (onlyUnresolved && alert.isResolved) return false;
      return true;
    });
  }

  public addUser(user: LocalStorageData['users'][0]): boolean {
    const users = this.getUsers();
    
    // Prüfe auf doppelte E-Mail-Adressen
    if (users.some(existingUser => existingUser.email === user.email)) {
      console.error('User with this email already exists');
      return false;
    }

    users.push(user);
    return this.updateUsers(users);
  }

  public addCheckin(checkin: LocalStorageData['checkins'][0]): boolean {
    const checkins = this.getCheckins();
    
    // Prüfe auf doppelte Check-ins am selben Tag
    const existingCheckin = checkins.find(
      c => c.athleteId === checkin.athleteId && c.date === checkin.date
    );
    
    if (existingCheckin) {
      // Update existing checkin
      const index = checkins.indexOf(existingCheckin);
      checkins[index] = checkin;
    } else {
      checkins.push(checkin);
    }

    return this.updateCheckins(checkins);
  }

  public addAlert(alert: LocalStorageData['alerts'][0]): boolean {
    const alerts = this.getAlerts();
    alerts.push(alert);
    return this.updateAlerts(alerts);
  }

  public resolveAlert(alertId: string, resolvedBy: string): boolean {
    const alerts = this.getAlerts();
    const alert = alerts.find(a => a.id === alertId);
    
    if (!alert) return false;

    alert.isResolved = true;
    alert.resolvedBy = resolvedBy;
    alert.resolvedAt = new Date().toISOString();

    return this.updateAlerts(alerts);
  }

  // DSGVO-Compliance Methoden
  public deleteUserData(userId: string): boolean {
    const data = this.getAllData();
    if (!data) return false;

    // Lösche alle Daten des Benutzers
    data.users = data.users.filter(user => user.id !== userId);
    data.checkins = data.checkins.filter(checkin => checkin.athleteId !== userId);
    data.alerts = data.alerts.filter(alert => alert.athleteId !== userId);
    data.goals = data.goals.filter(goal => goal.athleteId !== userId);
    data.sessions = data.sessions.filter(session => session.athleteId !== userId);
    data.notifications = data.notifications.filter(notification => notification.userId !== userId);
    data.consents = data.consents.filter(consent => consent.userId !== userId);

    console.log(`Deleted all data for user ${userId} (GDPR compliance)`);
    return this.setAllData(data);
  }

  public exportUserData(userId: string): any {
    const data = this.getAllData();
    if (!data) return null;

    const userData = {
      user: data.users.find(user => user.id === userId),
      checkins: data.checkins.filter(checkin => checkin.athleteId === userId),
      alerts: data.alerts.filter(alert => alert.athleteId === userId),
      goals: data.goals.filter(goal => goal.athleteId === userId),
      sessions: data.sessions.filter(session => session.athleteId === userId),
      notifications: data.notifications.filter(notification => notification.userId === userId),
      consents: data.consents.filter(consent => consent.userId === userId),
      exportDate: new Date().toISOString(),
    };

    console.log(`Exported data for user ${userId} (GDPR compliance)`);
    return userData;
  }

  // Storage-Management
  public clearAllData(): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.VERSION_KEY);
      console.log('All storage data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  public getStorageSize(): number {
    if (!this.isStorageAvailable()) return 0;

    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? new Blob([data]).size : 0;
  }

  public getStorageInfo() {
    return {
      version: this.CURRENT_VERSION,
      size: this.getStorageSize(),
      lastSync: this.getAllData()?.lastSync || 'never',
      userCount: this.getUsers().length,
      checkinCount: this.getCheckins().length,
      alertCount: this.getAlerts().length,
    };
  }
}

// Singleton Instance
export const storage = new VigorLogStorage();

// Export für Tests
export { SimpleEncryption };