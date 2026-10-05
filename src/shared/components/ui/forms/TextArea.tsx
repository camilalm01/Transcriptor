import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea({
  className,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full",
        "rounded-2xl",
        "border",
        "border-slate-300",
        "p-4",
        "outline-none",
        "resize-none",
        "focus:border-[#5F7EE7]",
        className
      )}
    />
  );
}