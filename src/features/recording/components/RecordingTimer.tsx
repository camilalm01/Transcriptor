interface RecordingTimerProps {
  seconds: number;
  isSimple: boolean;
}

export default function RecordingTimer({
  seconds,
  isSimple,
}: RecordingTimerProps) {

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div
      className={`
        rounded-full

        border-8
        border-[var(--border)]

        flex
        items-center
        justify-center

        mx-auto

        ${
          isSimple
            ? "h-64 w-64"
            : "h-52 w-52"
        }
      `}
    >
      <span
        className={`
          ${
            isSimple
              ? "text-5xl"
              : "text-4xl"
          }
        `}
      >
        {minutes
          .toString()
          .padStart(2, "0")}
        :
        {secs
          .toString()
          .padStart(2, "0")}
      </span>
    </div>
  );
}