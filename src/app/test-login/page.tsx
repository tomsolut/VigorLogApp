'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { storage } from '@/lib/storage';
import { Icon } from '@/components/ui/icon';
import { initializeDemoData } from '@/lib/demo-data';

export default function TestLoginPage() {
  const { loginAsDemo, currentUser } = useAuthStore();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStorage = () => {
    addLog('Testing storage...');
    const users = storage.getUsers();
    addLog(`Found ${users.length} users in storage`);
    
    const coaches = users.filter(u => u.role === 'coach');
    addLog(`Found ${coaches.length} coaches`);
    
    coaches.forEach(coach => {
      addLog(`Coach: ${coach.email} (ID: ${coach.id})`);
    });

    const teams = storage.getTeams();
    addLog(`Found ${teams.length} teams`);
  };

  const initData = () => {
    addLog('Initializing demo data...');
    initializeDemoData();
    setTimeout(() => {
      addLog('Demo data initialized');
      testStorage();
    }, 500);
  };

  const testLogin = (role: 'athlete' | 'coach' | 'parent' | 'admin') => {
    addLog(`Attempting login as ${role}...`);
    
    try {
      loginAsDemo(role);
      addLog('Login function called');
      
      setTimeout(() => {
        const state = useAuthStore.getState();
        const user = state.currentUser;
        addLog(`Auth state - isAuthenticated: ${state.isAuthenticated}, user: ${user ? user.id : 'null'}`);
        if (user) {
          addLog(`Successfully logged in as: ${user.firstName} ${user.lastName} (${user.role})`);
          addLog(`User can navigate to: /${user.role}`);
        } else {
          addLog('Login failed - no user set');
          
          // Try to check storage directly
          const storageUsers = storage.getUsers();
          addLog(`Users in storage: ${storageUsers.length}`);
          const coaches = storageUsers.filter(u => u.role === 'coach');
          addLog(`Coaches found: ${coaches.map(c => c.id).join(', ')}`);
        }
      }, 100);
    } catch (error) {
      addLog(`Login error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Test Login Page</h1>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            
            <div className="space-y-4">
              <button 
                onClick={testStorage}
                className="w-full btn-secondary"
              >
                Test Storage
              </button>
              
              <button 
                onClick={initData}
                className="w-full btn-secondary"
              >
                Initialize Demo Data
              </button>
              
              <hr className="my-4" />
              
              <button 
                onClick={() => testLogin('coach')}
                className="w-full btn-primary"
              >
                <Icon name="users" className="mr-2" />
                Login as Coach
              </button>
              
              <button 
                onClick={() => testLogin('athlete')}
                className="w-full btn-primary"
              >
                <Icon name="running" className="mr-2" />
                Login as Athlete
              </button>
              
              {currentUser && (
                <div className="p-4 bg-green-100 rounded-lg mt-4">
                  <p className="text-sm font-semibold">Logged in as:</p>
                  <p>{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-sm text-gray-600">{currentUser.role} - {currentUser.email}</p>
                  <button 
                    onClick={() => window.location.href = `/${currentUser.role}`}
                    className="mt-2 btn-primary text-sm"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Logs</h2>
            <div className="bg-card p-4 rounded-lg h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet...</p>
              ) : (
                <div className="space-y-1 text-sm font-mono">
                  {logs.map((log, i) => (
                    <div key={i} className="text-foreground">{log}</div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setLogs([])}
              className="mt-2 btn-ghost text-sm"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}