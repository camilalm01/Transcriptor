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
        "border",
        "border-slate-300",
        "bg-white",
        "p-6",
        "text-left",
        className
      )}
    >
      {children}
    </button>
  );
}