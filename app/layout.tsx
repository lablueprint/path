import type { Metadata } from 'next';
import './globals.css';
import UserProvider from '@/app/components/UserProvider';

export const metadata: Metadata = {
  title: 'PATH App',
  description: 'Resource management application for PATH',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
