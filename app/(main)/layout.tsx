import type { ReactNode } from 'react';
import Sidebar from '@/app/(main)/components/Sidebar';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      <main style={{ flex: 1 }}>
        <Breadcrumbs />
        {/* Main page content */}
        {children}
      </main>
    </div>
  );
}
