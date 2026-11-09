import {
    Play,
    MoreVertical,
    Link2,
    CloudUpload,
    Pencil,
    Trash2,
    EyeOff,
} from "lucide-react";

import BaseCard from "../../../shared/components/ui/cards/BaseCard";
import type { Recording } from "../types/recordings.types";
import RecordingStatusBadge from "./RecordingStatusBadge";
import DropdownMenu from "../../../shared/components/ui/navigation/DropdownMenu";

interface Props {
    recording: Recording;
    onOpen?: () => void;
    onPublish?: () => void;
    onRename?: () => void;
    onUnpublish?: () => void;
    onDelete?: () => void;
    onAddResource?: () => void;
}

export default function RecordingCardStandard({
    recording,
    onOpen,
    onPublish,
    onRename,
    onUnpublish,
    onDelete,
    onAddResource,
}: Props) {
    const showResources = recording.visibility === "PUBLISHED";

    const isPublished = recording.visibility === "PUBLISHED";
    const isDraft =
        recording.status === "READY" &&
        recording.visibility ===
        "PRIVATE";

    return (
        <BaseCard
            onClick={() => {
                console.log(
                    "CLICK",
                    recording.id
                );

                onOpen?.();
            }}
        >      <div className="flex items-center gap-4">

                <button
                    className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-black
            text-white
          "
                >
                    <Play size={18} fill="currentColor" />
                </button>

                <div className="flex-1">
                    <h3 className="font-semibold">
                        {recording.title}
                    </h3>

                    <p className="text-sm text-(--text-secondary)">
                        {new Date(
                            recording.createdAt
                        ).toLocaleDateString()}
                        {" | "}
                        {Math.round(
                            recording.durationSec / 60
                        )} min
                    </p>
                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >
                    <RecordingStatusBadge
                        recording={recording}
                    />

                    {isPublished && (
                        <div
    onClick={(e) =>
      e.stopPropagation()
    }
  >
                        <DropdownMenu
                            trigger={
                                <MoreVertical
                                    size={18}
                                />
                            }
                            items={[
                                {
                                    id: "rename",
                                    label: "Renombrar",
                                    icon: (
                                        <Pencil
                                            size={16}
                                        />
                                    ),
                                    onClick: () =>
                                        onRename?.(),
                                },

                                {
                                    id: "unpublish",
                                    label:
                                        "Mover a Por publicar",
                                    icon: (
                                        <EyeOff
                                            size={16}
                                        />
                                    ),
                                    onClick: () =>
                                        onUnpublish?.(),
                                },

                                {
                                    id: "delete",
                                    label:
                                        "Eliminar",
                                    icon: (
                                        <Trash2
                                            size={16}
                                        />
                                    ),
                                    danger: true,
                                    onClick: () =>
                                        onDelete?.(),
                                },
                            ]}
                        />
                        </div>
                    )}

                    {isDraft && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();

                                onPublish?.();
                            }}
                        >
                            <CloudUpload
                                size={18}
                            />
                        </button>
                    )}
                </div>

            </div>

            {showResources && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();

                        onAddResource?.();
                    }}
                    className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            p-2
            text-(--primary)
          "
                >
                    <Link2 size={16} />

                    Añadir enlace de recursos
                </button>
            )}
        </BaseCard>
    );
}