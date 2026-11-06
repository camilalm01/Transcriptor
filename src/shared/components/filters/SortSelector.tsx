import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

import type {
  SortOption,
} from "../../utils/sortByDate";

interface Props {
  value: SortOption;

  onChange: (
    value: SortOption
  ) => void;

  label?: string;
}

export default function SortSelector({
  value,
  onChange,
  label = "Ordenar por",
}: Props) {

  const [open, setOpen] =
    useState(false);

  return (
    <div className="relative">

      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="
          flex
          items-center
          gap-2
        "
      >

        <span
          className="
            text-sm
            text-(--text-secondary)
          "
        >
          {label}
        </span>

        <span className="font-medium">
          {value === "newest"
            ? "Más recientes"
            : "Más antiguas"}
        </span>

        <ChevronDown />

      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-2
            min-w-45

            overflow-hidden

            rounded-xl

            border
            border-(--border)

            bg-(--surface)

            shadow-lg
          "
        >

          {(
            [
              "newest",
              "oldest",
            ] as SortOption[]
          ).map((option) => (

            <button
              key={option}
              type="button"
              onClick={() => {

                onChange(option);

                setOpen(false);
              }}
              className="
                flex
                w-full
                justify-between
                gap-4

                px-4
                py-3

                hover:bg-(--background)
              "
            >

              <span className="whitespace-nowrap">

                {option === "newest"
                  ? "Más recientes"
                  : "Más antiguas"}

              </span>

              {value === option && (
                <Check
                  size={14}
                />
              )}

            </button>

          ))}

        </div>
      )}

    </div>
  );
}