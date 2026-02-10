import type { Metadata } from 'next';
import './globals.css';
import AuthListener from '@/app/components/AuthListener';

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
        <AuthListener />
        <main>{children}</main>
      </body>
    </html>
  );
}
