'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Icon } from '@/components/ui/icon';

export default function ClearDataPage() {
  const router = useRouter();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Clear all data
    storage.clearAllData();
    
    // Clear auth store
    localStorage.removeItem('vigorlog-auth');
    
    setCleared(true);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-primary/15">
      <div className="text-center bg-card p-8 rounded-xl border border-border">
        {cleared ? (
          <>
            <Icon name="check-circle" className="text-6xl text-green-600 mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Daten gelöscht!
            </h1>
            <p className="text-muted-foreground">
              Du wirst zur Startseite weitergeleitet...
            </p>
          </>
        ) : (
          <>
            <Icon name="spinner" className="animate-spin text-6xl text-primary mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Lösche Daten...
            </h1>
          </>
        )}
      </div>
    </div>
  );
}