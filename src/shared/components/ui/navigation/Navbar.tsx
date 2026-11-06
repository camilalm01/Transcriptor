import {
  Mic,
  FolderOpen,
  Accessibility,
  User,
} from "lucide-react";

import NavItem from "./NavItem";

export default function Navbar() {
  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      style={{
        position: "fixed",

        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: "var(--surface)",

        borderTop:
          "1px solid var(--border)",

        display: "flex",

        height: "80px",

        zIndex: 1000,
      }}
    >
      <NavItem
        to="/recording/start"
        icon={Mic}
        label="Grabar"
      />

      <NavItem
        to="/spaces"
        icon={FolderOpen}
        label="Reuniones"
      />

      <NavItem
        to="/accessibility"
        icon={Accessibility}
        label="Accesibilidad"
      />

      <NavItem
        to="/profile"
        icon={User}
        label="Perfil"
      />
    </nav>
  );
}