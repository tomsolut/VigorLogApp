'use client';

import { useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error('Application Error', 'Unhandled error occurred', { 
      error: error.message,
      stack: error.stack,
      digest: error.digest 
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-8">
      <div className="max-w-md w-full bg-card rounded-xl border border-border p-8 text-center">
        <div className="mb-4">
          <Icon 
            name="triangle-exclamation" 
            className="text-red-600 mx-auto mb-4" 
            size="3xl" 
          />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Oops! Etwas ist schiefgelaufen
          </h2>
          <p className="text-muted-foreground mb-6">
            Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full"
          >
            <Icon name="refresh" className="mr-2" />
            Erneut versuchen
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            <Icon name="home" className="mr-2" />
            Zur Startseite
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Fehlerdetails (nur in Entwicklung)
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}