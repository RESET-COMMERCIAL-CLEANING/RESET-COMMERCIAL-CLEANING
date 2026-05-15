import { Navbar } from '@/components/Navbar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="relative">
        {children}
      </main>
    </>
  );
}
