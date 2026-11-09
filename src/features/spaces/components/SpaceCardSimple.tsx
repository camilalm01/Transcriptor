import { Folder } from "lucide-react";

import BaseCard from "../../../shared/components/ui/cards/BaseCard";

interface SpaceCardSimpleProps {
  title: string;
  participants?: number;
  pendingRequests?: number;
  sessions?: number;
  onClick?: () => void;
}

export default function SpaceCardSimple({
  title,
  participants = 0,
  pendingRequests = 0,
  sessions,
  onClick,
}: SpaceCardSimpleProps) {
  return (
    <BaseCard onClick={onClick}>
      <div className="flex items-center gap-3">
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

        <div className="flex-1 min-w-0">
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
            <p className="text-sm text-(--text-secondary)">
              {sessions} sesiones
            </p>
          )}

          <p className="text-sm text-(--text-secondary)">
            {participants} participantes
            {pendingRequests > 0 &&
              ` · ${pendingRequests} solicitudes`}
          </p>
        </div>
      </div>
    </BaseCard>
  );
}