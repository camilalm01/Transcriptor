import { useEffect, useRef, useState } from "react";

import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

type Placement =
  | "left"
  | "right";

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;

  placement?: Placement;

  closeOnItemClick?: boolean;
}

export default function DropdownMenu({
  trigger,
  children,

  placement = "right",

  closeOnItemClick = true,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const closeMenu = () =>
    setIsOpen(false);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
    >
      <button
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        className="
          flex
          items-center
          justify-center
          h-12
          w-12
          rounded-xl
        "
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute",
            "top-full",
            "mt-2",
            "z-50",

            "min-w-[260px]",

            "overflow-hidden",

            "rounded-3xl",

            "border",
            "border-slate-200",

            "bg-white",

            "shadow-lg",

            placement === "right"
              ? "right-0"
              : "left-0"
          )}
        >
          {closeOnItemClick
            ? (
                <div
                  onClick={closeMenu}
                >
                  {children}
                </div>
              )
            : (
                children
              )}
        </div>
      )}
    </div>
  );
}