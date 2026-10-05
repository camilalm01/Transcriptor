import type { ButtonHTMLAttributes, } from "react";
import { cn } from "../../../utils/cn";
import { useAccessibility } from "../../../../contexts/useAccessibility";

type Variant =
  | "primary"
  | "secondary"
  | "danger";

type Size =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const { settings } = useAccessibility();
  const isSimple = settings.navigationMode === "simple";

  return (
    <button
      {...props}
      className={cn(
        "rounded-2xl font-semibold transition-colors",

        fullWidth && "w-full",

        variant === "primary" &&
        "bg-[#5F7EE7] text-white",

        variant === "secondary" &&
        "bg-[#EEF3FF] text-[#1D317A]",

        variant === "danger" &&
        "bg-[#E77A7A] text-white",

        size === "sm" &&
        (isSimple
          ? "h-14 text-base px-6"
          : "h-11 text-sm px-4"),

        size === "md" &&
        (isSimple
          ? "h-16 text-lg px-8"
          : "h-13 text-base px-6"),

        size === "lg" &&
        (isSimple
          ? "h-20 text-xl px-10"
          : "h-16 text-lg px-8"),

        className
      )}
    >
      {children}
    </button>
  );
}