import type { ReactNode } from 'react';
import '@/app/globals.css'
import Sidebar from '@/app/(main)/components/Sidebar';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className='main'>
      {/* Sidebar */}
      <Sidebar />
      <main>
        <Breadcrumbs />
        {/* Main page content */}
        {children}
      </main>
    </div>
  );
}
