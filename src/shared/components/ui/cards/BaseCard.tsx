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
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full",
        "rounded-3xl",
        "p-4",
        "text-left",
        "border",
        "cursor-pointer",
        "bg-(--surface)",
        "border-(--border)",
        className
      )}
    >
      {children}
    </div>
  );
}