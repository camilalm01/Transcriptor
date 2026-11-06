import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function SearchInput({
  className,
  ...props
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4",
        "w-full",
        "h-12",
        "rounded-1x1",
        "border",
        "border-slate-400",
        "px-5",
        className
      )}
    >
      <Search size={25} />
      <input
        {...props}
        className="w-full outline-none text-lg bg-transparent"
      />
    </div>
  );
}