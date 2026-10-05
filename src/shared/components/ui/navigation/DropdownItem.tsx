import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/cn";

interface DropdownItemProps {
  label: string;
  icon: LucideIcon;
  danger?: boolean;
  onClick?: () => void;
}

export default function DropdownItem({
  label,
  icon: Icon,
  danger = false,
  onClick,
}: DropdownItemProps) {
  return (
    <button
      role="menuitem"

      onClick={onClick}

      className={cn(
        "w-full",

        "flex",
        "items-center",

        "gap-4",

        "px-5",
        "py-4",

        "min-h-[56px]",

        "text-left",

        "transition-colors",

        "hover:bg-slate-100",

        danger
          ? "text-red-500"
          : "text-slate-800"
      )}
    >
      <Icon size={22} />

      <span className="font-medium">
        {label}
      </span>
    </button>
  );
}