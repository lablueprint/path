import type { ReactNode } from 'react';
import Sidebar from '@/app/(main)/components/Sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main page content */}
      {children}
    </div>
  );
}
