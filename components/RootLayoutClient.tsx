'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide navbar and footer on support-login page
  // pathname does NOT include basePath, so just check for support-login
  const isSupportLogin = pathname?.endsWith('support-login') || pathname?.includes('support-login');

  return (
    <>
      {!isSupportLogin && <Navbar />}
      <main className="relative">
        {children}
      </main>
      {!isSupportLogin && <Footer />}
    </>
  );
}
