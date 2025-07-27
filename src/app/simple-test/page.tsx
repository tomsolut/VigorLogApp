'use client';

export default function SimpleTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <p>Diese Seite funktioniert!</p>
      <div className="mt-8 p-4 border rounded">
        <p>Server läuft auf Port 3000</p>
      </div>
    </div>
  );
}