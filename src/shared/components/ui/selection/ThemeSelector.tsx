import { cn } from "../../../utils/cn";

export type ThemeOption =
  | "light"
  | "dark"
  | "high-contrast";

interface ThemeSelectorProps {
  value: ThemeOption;

  onChange: (
    theme: ThemeOption
  ) => void;
}

interface ThemeItemProps {
  label: string;

  selected: boolean;

  onClick: () => void;
}

function ThemeItem({
  label,
  selected,
  onClick,
}: ThemeItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        items-center
        gap-4
      "
    >
      <div
        className={cn(
          "h-6 w-6 rounded-full border-2 flex items-center justify-center",

          selected
            ? "border-[#5B7CF0]"
            : "border-slate-400"
        )}
      >
        {selected && (
          <div
            className="
              h-3 w-3
              rounded-full
              bg-[#5B7CF0]
            "
          />
        )}
      </div>

      <span className="text-lg">
        {label}
      </span>
    </button>
  );
}

export default function ThemeSelector({
  value,
  onChange,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-5">
      <ThemeItem
        label="Claro"
        selected={value === "light"}
        onClick={() =>
          onChange("light")
        }
      />

      <ThemeItem
        label="Oscuro"
        selected={value === "dark"}
        onClick={() =>
          onChange("dark")
        }
      />

      <ThemeItem
        label="Alto Contraste"
        selected={
          value ===
          "high-contrast"
        }
        onClick={() =>
          onChange(
            "high-contrast"
          )
        }
      />
    </div>
  );
}