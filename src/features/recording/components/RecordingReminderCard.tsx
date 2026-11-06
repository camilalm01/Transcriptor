import { Bell } from "lucide-react";

interface RecordingReminderCardProps {
  isSimple: boolean;
}

export default function RecordingReminderCard({
  isSimple,
}: RecordingReminderCardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        text-center
        p-6
      `}
    >
      <Bell
        size={
          isSimple
            ? 54
            : 44
        }
        className="
          mx-auto
          text-[var(--primary)]
        "
      />

      <h2
        className={`
          mt-4
          font-bold
          ${
            isSimple
              ? "text-4xl"
              : "text-3xl"
          }
        `}
      >
        Recuerda
      </h2>

      <p
        className={`
          mt-4
          text-[var(--text-secondary)]

          ${
            isSimple
              ? "text-md"
              : "text-sm"
          }
        `}
      >
        Para una mejor experiencia,
        tienes disponible un límite
        máximo de tiempo de:
      </p>

      <p
        className={`
          mt-8
          font-bold
          text-[var(--primary)]

          ${
            isSimple
              ? "text-5xl"
              : "text-4xl"
          }
        `}
      >
        2 Horas
      </p>
    </div>
  );
}