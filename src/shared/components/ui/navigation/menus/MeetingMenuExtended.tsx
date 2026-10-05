import { Share2, Pencil, Trash2, LayoutGrid, Accessibility, MoreVertical, } from "lucide-react";
import DropdownMenu from "../DropdownMenu";
import DropdownItem from "../DropdownItem";

export default function MeetingMenuExtended() {
  return (
    <DropdownMenu
      trigger={
        <MoreVertical size={24} />
      }
    >
      <DropdownItem
        icon={Share2}
        label="Opciones de compartir"
      />

      <DropdownItem
        icon={Pencil}
        label="Renombrar reunión"
      />

      <DropdownItem
        icon={Trash2}
        label="Eliminar reunión"
        danger
      />

      <DropdownItem
        icon={LayoutGrid}
        label="Módulos"
      />

      <DropdownItem
        icon={Accessibility}
        label="Accesibilidad"
      />
    </DropdownMenu>
  );
}