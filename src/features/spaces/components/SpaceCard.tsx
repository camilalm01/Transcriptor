import {
    FolderOpen,
    MoreVertical,
    Users,
} from "lucide-react";

import BaseCard from "../../../shared/components/ui/cards/BaseCard";
import Button from "../../../shared/components/ui/buttons/Button";

interface SpaceCardProps {
    title: string;
    recordingCount: number;
    memberCount?: number;
    secondaryInfo: string;
    onClick?: () => void;
    onManage?: () => void;
    onMenu?: () => void;
}

export default function SpaceCard({
    title,
    secondaryInfo,
    recordingCount,
    memberCount,

    onClick,
    onManage,
    onMenu,
}: SpaceCardProps) {
    return (
        <BaseCard onClick={onClick}>
            <div
                className="
          flex
          items-center
          justify-between
          gap-3
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
                    <FolderOpen
                        size={28}
                        strokeWidth={3}
                    />
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

                    <p
                        className="
              text-sm
              text-(--text-secondary)
            "
                    >
                        <p className="text-sm text-(--text-secondary)">
                            {recordingCount ?? 0} grabaciones
                            {" | "}
                            {memberCount ?? 0} participantes
                        </p>

                        <p className="text-sm text-(--text-secondary)">
                            {secondaryInfo}
                        </p>

                    </p>

                    <p
                        className="
              text-sm
              text-(--text-secondary)
            "
                    >
                        {secondaryInfo}
                    </p>
                </div>

                {/* Acciones */}
                <div
                    className="
            flex
            items-center
            gap-2

            shrink-0
          "
                >
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={Users}
                        onClick={(e) => {
                            e.stopPropagation();
                            onManage?.();
                        }}
                    >
                        Gestionar
                    </Button>

                    <button
                        type="button"
                        aria-label="Más opciones"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMenu?.();
                        }}
                        className="
              rounded-lg
              text-(--text-secondary)

              hover:bg-(--background)
            "
                    >
                        <MoreVertical
                            size={22}
                        />
                    </button>
                </div>
            </div>
        </BaseCard>
    );
}