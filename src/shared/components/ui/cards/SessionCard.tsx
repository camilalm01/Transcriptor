import { ChevronRight, FileText } from "lucide-react";

import BaseCard from "./BaseCard";

interface SessionCardProps {
  title: string;
  date: string;
  onClick?: () => void;
}

export default function SessionCard({
  title,
  date,
  onClick,
}: SessionCardProps) {
  return (
    <BaseCard onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex gap-5 items-center">
          <FileText
            size={48}
            className="text-[#5F7EE7]"
          />

          <div>
            <h3 className="text-xl font-bold">
              {title}
            </h3>

            <p className="text-lg">
              {date}
            </p>
          </div>
        </div>

        <ChevronRight size={36} />
      </div>
    </BaseCard>
  );
}