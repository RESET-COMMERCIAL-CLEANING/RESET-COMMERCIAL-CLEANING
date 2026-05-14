import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'RESET - Premium Commercial Cleaning',
  description: 'We don\'t just clean. We Reset. Premium commercial cleaning services for businesses across Sydney.',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/RESET-COMMERCIAL-CLEANING/logos/reset-favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white antialiased overflow-x-hidden">
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
