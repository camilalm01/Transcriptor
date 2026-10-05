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

        backgroundColor: "#FFFFFF",

        borderTop:
          "1px solid #E5E7EB",

        display: "flex",

        height: "80px",

        zIndex: 1000,
      }}
    >
      <NavItem
        to="/record"
        icon={Mic}
        label="Grabar"
      />

      <NavItem
        to="/meetings"
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