import type { ReactNode } from "react";

import Navbar from "../../shared/components/ui/navigation/Navbar";
import EmailVerificationBanner from "../../features/auth/components/EmailVerificationBanner";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor:
          "var(--background)",

        color:
          "var(--text)",
      }}
    >
      <EmailVerificationBanner />
      <main className="pb-24">
        {children}
      </main>

      <Navbar />
    </div>
  );
}