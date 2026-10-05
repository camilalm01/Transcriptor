import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/cn";

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
}

export default function IconButton({
  icon: Icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "flex items-center justify-center",
        "h-18 w-18 rounded-2xl",
        "bg-slate-100",
        "hover:bg-slate-200",
        className
      )}
    >
      <Icon size={28} />
    </button>
  );
}