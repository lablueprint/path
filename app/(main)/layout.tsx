import type { ReactNode } from 'react';
import Sidebar from './components/sidebar';

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
