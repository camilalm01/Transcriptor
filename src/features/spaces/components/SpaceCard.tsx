import { Folder, MoreVertical, UsersRound, Pencil, Trash2 } from "lucide-react";

import BaseCard from "../../../shared/components/ui/cards/BaseCard";
import DropdownMenu from "../../../shared/components/ui/navigation/DropdownMenu";
import Button from "../../../shared/components/ui/buttons/Button";

interface SpaceCardProps {
  title: string;
  secondaryInfo: string;
  sessions?: number;

  onClick?: () => void;
  onManage?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

export default function SpaceCard({
  title,
  secondaryInfo,
  sessions,
  onClick,
  onManage,
  onRename,
  onDelete,
}: SpaceCardProps) {
  return (
    <BaseCard onClick={onClick}>
      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >
        {/* Icono */}
        <div
          className="
            flex
            items-center
            justify-center

            h-10
            w-10
            shrink-0
            
            text-(--primary)
          "
        >
          <Folder size={28} strokeWidth={3} />
        </div>
        {/* Información */}
        <div
          className="
            flex-1
            min-w-0
          "
        >
          <h3
            className="
              truncate

              text-md
              font-bold

              text-(--text)
            "
          >
            {title}
          </h3>

          {sessions !== undefined && (
            <p
              className=" text-sm text-(--text-secondary)">
              {sessions} sesiones
            </p>
          )}
          <p
            className="text-sm text-(--text-secondary)">
            {secondaryInfo}
          </p>
        </div>

        {/* Acciones */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {onManage && (
            <Button
              variant="secondary"
              size="sm"
              icon={UsersRound}
              onClick={onManage}
            >
              Gestionar
            </Button>
          )}

          <DropdownMenu
            trigger={
              <MoreVertical size={18} />
            }
            items={[
              {
                id: "rename",
                label: "Renombrar",
                icon: (
                  <Pencil size={16} />
                ),
                onClick: () =>
                  onRename?.(),
              },
              {
                id: "delete",
                label: "Eliminar",
                icon: (
                  <Trash2 size={16} />
                ),
                danger: true,
                onClick: () =>
                  onDelete?.(),
              },
            ]}
          />
        </div>
      </div>
    </BaseCard>
  );
}