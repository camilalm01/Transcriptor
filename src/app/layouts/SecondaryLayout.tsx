import type { ReactNode } from "react";

interface SecondaryLayoutProps {
  children: ReactNode;
}

export default function SecondaryLayout({
  children,
}: SecondaryLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
      className="bg-app text-app"
    >
      <main
        style={{
          flex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
}