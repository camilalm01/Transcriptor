import type { ReactNode } from "react";

import Navbar from "../../shared/components/ui/navigation/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main
        style={{
          flex: 1,
          paddingBottom: "80px",
        }}
      >
        {children}
      </main>

      <Navbar />
    </div>
  );
}