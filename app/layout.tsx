import type { Metadata } from 'next';
import AuthListener from '@/app/components/AuthListener';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/globals.css';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat', 
  weight: ['300', '400', '500', '600', '700'], 
});

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
      <body className={`${montserrat.variable} antialiased`}>
        <AuthListener />
        <main>{children}</main>
      </body>
    </html>
  );
}
