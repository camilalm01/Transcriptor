import { useState } from "react";
import type {
  InputHTMLAttributes,
} from "react";

import { cn } from "../../../utils/cn";
import { Eye, EyeOff } from "lucide-react";

type InputProps =
  InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className,
  type = "text",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const isPassword =
    type === "password";

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={inputType}
        className={cn(
          "w-full",
          "h-14",
          "rounded-2xl",
          "border",
          "border-[var(--border)]",
          "bg-[var(--bg)]",
          "px-4",
          "text-[var(--text)]",
          "outline-none",
          "transition-colors",

          isPassword && "pr-12",

          className
        )}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (prev) => !prev
            )
          }
          aria-label={
            showPassword
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
          className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2

      text-[var(--primary)]

      hover:opacity-80

      transition-opacity
    "
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      )}
    </div>
  );
}