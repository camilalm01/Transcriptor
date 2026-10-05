import { User, ChevronRight } from "lucide-react";
import BaseCard from "./BaseCard";

interface ParticipantCardProps {
  name: string;
  role?: string;
  onClick?: () => void;
}

export default function ParticipantCard({
  name,
  role,
  onClick,
}: ParticipantCardProps) {
  return (
    <BaseCard onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <User
            size={42}
            className="text-[#5F7EE7]"
          />

          <div>
            <h3 className="font-semibold text-lg">
              {name}
            </h3>

            {role && (
              <p className="text-slate-600">
                {role}
              </p>
            )}
          </div>
        </div>
        <ChevronRight />
      </div>
    </BaseCard>
  );
}