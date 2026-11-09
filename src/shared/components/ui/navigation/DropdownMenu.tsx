import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface Props {
  trigger: ReactNode;
  items: MenuItem[];
}

export default function DropdownMenu({
  trigger,
  items,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [focusedIndex, setFocusedIndex] =
    useState(0);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const itemRefs =
    useRef<
      Array<HTMLButtonElement | null>
    >([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    itemRefs.current[
      focusedIndex
    ]?.focus();
  }, [open, focusedIndex]);

  function handleMenuKeyDown(
    e: React.KeyboardEvent
  ) {
    switch (e.key) {
      case "Escape":
        setOpen(false);
        break;

      case "ArrowDown":
        e.preventDefault();

        setFocusedIndex(
          current =>
            current ===
              items.length - 1
              ? 0
              : current + 1
        );

        break;

      case "ArrowUp":
        e.preventDefault();

        setFocusedIndex(
          current =>
            current === 0
              ? items.length - 1
              : current - 1
        );

        break;

      case "Home":
        e.preventDefault();

        setFocusedIndex(0);

        break;

      case "End":
        e.preventDefault();

        setFocusedIndex(
          items.length - 1
        );

        break;
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          onClick={(e) =>
            e.stopPropagation()
          }
          onKeyDown={
            handleMenuKeyDown
          }
          className="
            absolute
            right-0
            z-50
            mt-2
            min-w-56
            overflow-hidden
            rounded-xl
            border
            border-(--border)
            bg-(--surface)
            shadow-lg
          "
        >
          {items.map(
            (
              item,
              index
            ) => (
              <button
                key={item.id}
                ref={el => {
                  itemRefs.current[
                    index
                  ] = el;
                }}
                role="menuitem"
                type="button"
                disabled={
                  item.disabled
                }
                onClick={(e) => {
                  e.stopPropagation();

                  item.onClick();

                  setOpen(false);
                }}
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  hover:bg-(--background)

                  ${item.danger
                    ? "text-red-600"
                    : ""
                  }

                  ${item.disabled
                    ? "opacity-50"
                    : ""
                  }
                `}
              >
                {item.icon}

                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}