import { Circle, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/cn";

interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  selected?: boolean;
  onClick?: () => void;
}

export default function SelectableCard({
  title,
  description,
  icon: Icon,
  selected = false,
  onClick,
}: SelectableCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full",
        "rounded-3xl",
        "p-6",
        "flex items-center justify-between",
        "border",

        selected
          ? "border-[#5F7EE7] bg-[#EEF3FF]"
          : "border-slate-300 bg-white"
      )}
    >
      <div className="flex gap-4">
        {Icon && (
          <Icon size={32} />
        )}

        <div className="text-left">
          <h3 className="font-bold text-xl">
            {title}
          </h3>
            {description && (
              <p className="text-sm text-slate-600 mt-1">
                {description}
              </p>
            )}
        </div>
      </div>

      {selected ? (
        <CheckCircle2
          size={36}
          color="#5F7EE7"
        />
      ) : (
        <Circle
          size={36}
          color="#5F7EE7"
        />
      )}
    </button>
  );
}