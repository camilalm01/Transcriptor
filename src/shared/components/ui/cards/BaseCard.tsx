import type { ReactNode } from "react";

import { cn } from "../../../utils/cn";

interface BaseCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function BaseCard({
  children,
  className,
  onClick,
}: BaseCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full",
        "rounded-3xl",
        "p-4",
        "text-left",

        "border",

        "bg-[var(--surface)]",

        "border-[var(--border)]",

        className
      )}
    >
      {children}
    </button>
  );
}