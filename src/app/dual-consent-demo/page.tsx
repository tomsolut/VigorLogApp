'use client';

// VigorLog - Dual-Consent Demo Page
// GDPR Art. 8 Compliance Demonstration

import { DualConsentDemo } from '@/components/demos/dual-consent-demo';

export default function DualConsentDemoPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-green-50">
      <main className="max-w-6xl mx-auto">
        <DualConsentDemo />
      </main>
    </div>
  );
}