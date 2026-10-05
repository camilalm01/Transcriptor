import type { InputHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "w-full",
        "h-14",
        "rounded-2xl",
        "border",
        "border-slate-300",
        "px-4",
        "text-base",
        "outline-none",
        "focus:border-[#5F7EE7]",
        className
      )}
    />
  );
}