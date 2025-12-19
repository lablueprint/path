import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
