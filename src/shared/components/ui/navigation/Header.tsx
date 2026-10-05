import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAccessibility } from "../../../../contexts/AccessibilityContext";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
}: HeaderProps) {
  const navigate = useNavigate();

  const { settings } =
    useAccessibility();

  const isSimple =
    settings.navigationMode === "simple";

  return (
    <header
      role="banner"
      style={{
        backgroundColor: "#5F7EE7",

        color: "#FFFFFF",

        display: "flex",
        alignItems: "center",

        minHeight: isSimple
          ? "72px"
          : "64px",

        padding: isSimple
          ? "0 20px"
          : "0 16px",

        gap: "12px",
      }}
    >
      {showBackButton && (
        <button
          aria-label="Volver"

          onClick={() => navigate(-1)}

          style={{
            width: isSimple
              ? "56px"
              : "48px",

            height: isSimple
              ? "56px"
              : "48px",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            background: "transparent",

            border: "none",

            color: "#FFFFFF",

            cursor: "pointer",
          }}
        >
          <ArrowLeft
            size={
              isSimple
                ? 30
                : 24
            }
          />
        </button>
      )}

      <h1
        style={{
          margin: 0,

          fontSize: isSimple
            ? "1.4rem"
            : "1.2rem",

          fontWeight: 600,
        }}
      >
        {title}
      </h1>
    </header>
  );
}