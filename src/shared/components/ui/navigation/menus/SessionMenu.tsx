import { Pencil, Trash2, MoreVertical } from "lucide-react";
import DropdownMenu from "../DropdownMenu";
import DropdownItem from "../DropdownItem";

export default function SessionMenu() {
  return (
    <DropdownMenu
      trigger={
        <MoreVertical size={24} />
      }
    >
      <DropdownItem
        icon={Pencil}
        label="Renombrar sesión"
      />

      <DropdownItem
        icon={Trash2}
        label="Eliminar sesión"
        danger
      />
    </DropdownMenu>
  );
}