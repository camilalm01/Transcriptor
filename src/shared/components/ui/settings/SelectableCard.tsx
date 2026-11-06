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
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={selected ? ` seleccionado ` : `no seleccionado`}
      className={cn(
        "w-full",
        "rounded-3xl",
        "p-6",
        "flex items-center justify-between",
        "border",
        "focus:outline-none",
        "focus:ring-4",
        "focus:ring-[var(--primary)]",
        "text-[var(--text)]",

        selected
          ? "border-[var(--border)], bg-[var(--surface)]"
          : "border-[var(--primary)]"
      )}
    >
      <div className="flex gap-4">
        {Icon && (
          <Icon size={32} 
          className="text-[var(--text)]"/>
        )}

        <div className="text-left">
          <h3 className="font-bold text-xl text-[var(--text)]">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {selected ? (
        <CheckCircle2
          size={36}
          color="var(--primary)"
        />
      ) : (
        <Circle
          size={36}
          color="var(--primary)"
        />
      )}
    </button>
  );
}