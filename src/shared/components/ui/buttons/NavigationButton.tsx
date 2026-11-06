import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/cn";

interface NavigationButtonProps {
  title: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export default function NavigationButton({
  title,
  icon: Icon,
  onClick,
}: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full",
        "rounded-2xl",
        "bg-[var(--surface)]",
        "border",
        "border-[var(--border)]",
        "p-6",
        "flex items-center justify-between"
      )}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <Icon size={28} />
        )}

        <span className="text-lg font-semibold text-[var(--text)]">
          {title}
        </span>
      </div>

      <ChevronRight className="text-[var(--text)]" />
    </button>
  );
}