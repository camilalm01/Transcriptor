import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}