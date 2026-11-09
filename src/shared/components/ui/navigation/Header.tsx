import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { ReactNode } from "react";
import { useAccessibility } from "../../../../contexts/accessibility/useAccessibility";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightActions?: ReactNode;
}

export default function Header({
  title,
  showBackButton = false,
  rightActions,
}: HeaderProps) {

  const navigate = useNavigate();

  const { settings } = useAccessibility();

  const isSimple =
    settings.navigationMode ===
    "simple";

  return (
    <header
      role="banner"
      className="
        bg-(--primary)
        text-white

        flex
        items-center
        justify-between

        p-4
        gap-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-3

          min-w-0
          flex-1
        "
      >
        {showBackButton && (
          <button
            type="button"
            aria-label="Volver"
            onClick={() => navigate(-1)}
            className=" shrink-0"
          >
            <ArrowLeft
              size={
                isSimple
                  ? 28
                  : 24
              }
            />
          </button>
        )}

        <h1
          className="
            truncate

            text-xl
            sm:text-2xl
            md:text-3xl
            font-bold
          "
        >
          {title}
        </h1>
      </div>

      {rightActions && (
        <div
          className="
            flex
            items-center
            gap-2

            shrink-0
          "
        >
          {rightActions}
        </div>
      )}
    </header>
  );
}
