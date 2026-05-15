// No navbar/footer for support login page
export default function SupportLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative">
      {children}
    </main>
  );
}
