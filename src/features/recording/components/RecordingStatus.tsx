interface RecordingStatusProps {
  paused?: boolean;
}

export default function RecordingStatus({
  paused = false,
}: RecordingStatusProps) {
  return (
    <div
      className="
        rounded-2xl

        bg-[var(--surface)]

        border
        border-[var(--border)]

        py-3

        text-center
      "
    >
      {paused
        ? "⏸ Grabación pausada"
        : "🔴 Grabación en curso"}
    </div>
  );
}