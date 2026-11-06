import {
  Share2,
  Trash2,
  Pencil,
  Download,
} from "lucide-react";

import Button
from "../../../shared/components/ui/buttons/Button";

interface Props {
  onExport?: () => void;

  onEdit?: () => void;

  onDelete?: () => void;

  onShare?: () => void;
}

export default function RecordingActionsPanel({
  onExport,
  onEdit,
  onDelete,
  onShare,
}: Props) {

  return (
    <div
      className="
        flex
        gap-3
      "
    >

      <Button
        icon={Download}
        variant="secondary"
        onClick={onExport}
      >
        Exportar
      </Button>

      <Button
        icon={Pencil}
        variant="secondary"
        onClick={onEdit}
      >
        Editar
      </Button>

      <Button
        icon={Share2}
        variant="secondary"
        onClick={onShare}
      >
        Compartir
      </Button>

      <Button
        icon={Trash2}
        variant="danger"
        onClick={onDelete}
      >
        Eliminar
      </Button>

    </div>
  );
}