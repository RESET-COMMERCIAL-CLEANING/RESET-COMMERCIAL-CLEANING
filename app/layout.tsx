import type { Metadata, Viewport } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import RootLayoutClient from '@/components/RootLayoutClient';
import './globals.css';

export const metadata: Metadata = {
  title: 'RESET - Premium Commercial Cleaning',
  description: 'We don\'t just clean. We Reset. Premium commercial cleaning services for businesses across Sydney.',
  icons: {
    icon: '/RESET-COMMERCIAL-CLEANING/logos/reset-favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white antialiased overflow-x-hidden">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
