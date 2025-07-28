import { ReactNode } from 'react';

export default function PerformanceTestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}