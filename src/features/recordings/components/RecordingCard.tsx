import {
  FileAudio,
  Clock3,
} from "lucide-react";

import BaseCard from "../../../shared/components/ui/cards/BaseCard";
import type {Recording} from "../types/recordings.types";

interface RecordingCardProps {
  recording: Recording;
  onClick?: () => void;
}

export default function RecordingCard({
  recording,
  onClick,
}: RecordingCardProps) {

  return (
    <BaseCard onClick={onClick}>

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center

            text-(--primary)
          "
        >
          <FileAudio
            size={28}
          />
        </div>

        <div className="flex-1">

          <h3
            className="
              font-bold
              truncate
            "
          >
            {recording.title}
          </h3>

          <p
            className="
              text-sm
              text-(--text-secondary)
            "
          >
            {recording.status}
          </p>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            text-(--text-secondary)
          "
        >
          <Clock3 size={16} />

          {Math.round(
            recording.durationSec / 60
          )} min

        </div>

      </div>

    </BaseCard>
  );
}