import type { Metadata } from 'next';
import AuthListener from '@/app/components/AuthListener';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Montserrat } from 'next/font/google';
import '@/app/globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={montserrat.className}
    >
      <body>
        <AuthListener />
        <main>{children}</main>
      </body>
    </html>
  );
}
