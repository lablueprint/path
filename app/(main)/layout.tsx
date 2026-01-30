import type { ReactNode } from 'react';
import Sidebar from './components/sidebar';

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main page content */}
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}
