import { ChevronRight, Folder } from "lucide-react";
import BaseCard from "./BaseCard";

interface MeetingCardProps {
  title: string;
  date: string;
  sessions: number;

  onClick?: () => void;
}

export default function MeetingCard({
  title,
  date,
  sessions,
  onClick,
}: MeetingCardProps) {
  return (
    <BaseCard onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex gap-5 items-center">
          <Folder
            size={48}
            className="text-[#5F7EE7]"
          />

          <div>
            <h3 className="text-2xl font-bold">
              {title}
            </h3>

            <p className="text-lg">
              {date}
            </p>

            <p className="text-lg">
              {sessions} sesiones
            </p>
          </div>
        </div>

        <ChevronRight size={36} />
      </div>
    </BaseCard>
  );
}