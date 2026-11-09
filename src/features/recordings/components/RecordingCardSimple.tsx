import {
  Play,
  ChevronRight,
  Upload,
} from "lucide-react";

import BaseCard from "../../../shared/components/ui/cards/BaseCard";
import type { Recording } from "../types/recordings.types";
import RecordingStatusBadge from "./RecordingStatusBadge";

interface Props {
  recording: Recording;
  onOpen?: () => void;
  onPublish?: () => void;
}

export default function RecordingCardSimple({
  recording,
  onOpen,
  onPublish,
}: Props) {
  const isPublished =
    recording.visibility === "PUBLISHED";

  return (
    <BaseCard onClick={onOpen}>
      <div className="flex items-center gap-4">

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
          <h3 className="font-bold">
            {recording.title}
          </h3>

          <p className="text-sm text-(--text-secondary)">
            {new Date(
              recording.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

        {isPublished ? (
          <button onClick={onOpen}>
            <ChevronRight size={24} />
          </button>
        ) : (
          <button onClick={onPublish}>
            <Upload size={24} />
          </button>
        )}
      </div>

      <div className="mt-3">
        <RecordingStatusBadge
          recording={recording}
        />
      </div>
    </BaseCard>
  );
}