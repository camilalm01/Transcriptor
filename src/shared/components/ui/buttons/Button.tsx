import type {
  ButtonHTMLAttributes,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import { cn } from "../../../utils/cn";

import {
  useAccessibility,
} from "../../../../contexts/accessibility/useAccessibility";

type Variant =
  | "primary"
  | "secondary"
  | "danger";

type Size =
  | "sm"
  | "md"
  | "lg";

type IconPosition =
  | "left"
  | "right";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;

  icon?: LucideIcon;

  iconPosition?: IconPosition;

  loading?: boolean;
}

export default function Button({
  children,

  variant = "primary",

  size = "md",

  fullWidth = false,

  icon: Icon,

  iconPosition = "left",

  loading = false,

  className,

  disabled,

  ...props
}: ButtonProps) {
  const { settings } =
    useAccessibility();

  const isSimple =
    settings.navigationMode ===
    "simple";

  const isDisabled =
    disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={cn(
        "rounded-2xl",
        "font-semibold",

        "transition-all",
        "duration-200",

        "active:scale-95",

        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        "flex",
        "items-center",
        "justify-center",
        "gap-3",

        fullWidth && "w-full",

        variant === "primary" &&
        `
          bg-(--primary)
          text-white
          hover:brightness-95
          shadow-md
          hover:shadow-lg
        `,

        variant === "secondary" &&
        `
          border
          border-var(--border)
        `,

        variant === "danger" &&
        `
          bg-red-600
          text-white
        `,

        size === "sm" &&
        (isSimple
          ? "h-14 text-base px-4"
          : "h-11 text-sm px-2"),

        size === "md" &&
        (isSimple
          ? "h-16 text-lg px-6"
          : "h-13 text-base px-4"),

        size === "lg" &&
        (isSimple
          ? "h-20 text-xl px-8"
          : "h-16 text-lg px-6"),

        className
      )}
    >
      {loading ? (
        <>
          <span
            className="
              h-5
              w-5
              animate-spin
              rounded-full
              border-2
              border-current
              border-t-transparent
            "
          />

          Cargando...
        </>
      ) : (
        <>
          {Icon &&
            iconPosition ===
            "left" && (
              <Icon
                size={
                  isSimple
                    ? 24
                    : 20
                }
              />
            )}

          {children}

          {Icon &&
            iconPosition ===
            "right" && (
              <Icon
                size={
                  isSimple
                    ? 24
                    : 20
                }
              />
            )}
        </>
      )}
    </button>
  );
}