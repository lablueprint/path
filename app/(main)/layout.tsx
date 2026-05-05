import type { ReactNode } from 'react';
import Sidebar from '@/app/(main)/components/Sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="main">
      {/* Sidebar */}
      <Sidebar />
      <main className="main-container">
        {/* Main page content */}
        {children}
      </main>
    </div>
  );
}
