'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #e5e5e5',
            backgroundColor: '#ffffff'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1a1a1a'
            }}>
              Kritischer Fehler
            </h2>
            <p style={{
              marginBottom: '1.5rem',
              color: '#666666'
            }}>
              Ein schwerwiegender Fehler ist aufgetreten. Bitte laden Sie die Seite neu.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#39FF14',
                color: '#000000',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Seite neu laden
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}