import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { useAccessibility } from "../../../../contexts/AccessibilityContext";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export default function NavItem({
  to,
  icon: Icon,
  label,
}: NavItemProps) {
  const { settings } = useAccessibility();

  const isSimple =
    settings.navigationMode === "simple";

  return (
    <NavLink
      to={to}
      aria-label={label}
      style={({ isActive }) => ({
        flex: 1,

        display: "flex",
        flexDirection: "column",

        justifyContent: "center",
        alignItems: "center",

        gap: isSimple ? "8px" : "4px",

        textDecoration: "none",

        color: isActive
          ? "#4F6FE8"
          : "#646464",

        minHeight: isSimple
          ? "84px"
          : "72px",

        fontSize: isSimple
          ? "1rem"
          : "0.8rem",

        fontWeight: isActive
          ? 600
          : 500,
      })}
    >
      <Icon
        size={isSimple ? 30 : 24}
        strokeWidth={
          isSimple ? 2.5 : 2
        }
      />

      <span>{label}</span>
    </NavLink>
  );
}